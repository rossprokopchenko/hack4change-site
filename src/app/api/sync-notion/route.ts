import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase/service";
import type { Database } from "@/lib/supabase/types";

interface ProfileWithTeam {
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  rsvp_status?: string | null;
  created_at?: string | null;
  team_members?: Array<{
    teams: {
      name: string;
    } | null;
  }>;
}

async function syncProfileToNotion(profile: ProfileWithTeam, notionHeaders: any, databaseId: string) {
  const teamName = profile.team_members?.[0]?.teams?.name || "No Team";

  // Query Notion database for existing entry
  const queryResponse = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    method: "POST",
    headers: notionHeaders,
    body: JSON.stringify({
      filter: {
        property: "Email",
        email: {
          equals: profile.email,
        },
      },
    }),
  });

  if (!queryResponse.ok) {
    const errorData = await queryResponse.json();
    throw new Error(`Notion Query Error: ${JSON.stringify(errorData)}`);
  }

  const queryData = await queryResponse.json();
  
  const properties: any = {
    "First Name": {
      title: [{ text: { content: profile.first_name || "" } }],
    },
    "Last Name": {
      rich_text: [{ text: { content: profile.last_name || "" } }],
    },
    "Email": {
      email: profile.email,
    },
    "RSVP Status": {
      status: { name: profile.rsvp_status || "pending" },
    },
    "Team": {
      rich_text: [{ text: { content: teamName } }],
    },
  };

  if (profile.created_at) {
    properties["Created at"] = {
      date: { start: profile.created_at },
    };
  }

  if (queryData.results && queryData.results.length > 0) {
    // Update existing page
    const pageId = queryData.results[0].id;
    const updateResponse = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
      method: "PATCH",
      headers: notionHeaders,
      body: JSON.stringify({ properties }),
    });
    
    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      throw new Error(`Notion Update Error: ${JSON.stringify(errorData)}`);
    }
    return "updated";
  } else {
    // Create new page
    const createResponse = await fetch(`https://api.notion.com/v1/pages`, {
      method: "POST",
      headers: notionHeaders,
      body: JSON.stringify({
        parent: { database_id: databaseId },
        properties: properties,
      }),
    });

    if (!createResponse.ok) {
      const errorData = await createResponse.json();
      throw new Error(`Notion Create Error: ${JSON.stringify(errorData)}`);
    }
    return "created";
  }
}

async function syncTeamToNotion(team: any, notionHeaders: any, databaseId: string) {
  const leaderLabel = team.profiles ? `${team.profiles.first_name || ""} ${team.profiles.last_name || ""}`.trim() || team.profiles.email : "Unknown";

  // Query Notion database for existing entry by Team ID (stored in a property) or Name
  const queryResponse = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    method: "POST",
    headers: notionHeaders,
    body: JSON.stringify({
      filter: {
        property: "Team Name",
        title: {
          equals: team.name,
        },
      },
    }),
  });

  if (!queryResponse.ok) {
    const errorData = await queryResponse.json();
    throw new Error(`Notion Query Error (Teams): ${JSON.stringify(errorData)}`);
  }

  const queryData = await queryResponse.json();
  
  const properties: any = {
    "Team Name": {
      title: [{ text: { content: team.name } }],
    },
    "Description": {
      rich_text: [{ text: { content: team.description || "" } }],
    },
    "Leader": {
      rich_text: [{ text: { content: leaderLabel } }],
    },
    "Max Members": {
      number: team.max_members || 5,
    },
  };

  if (team.created_at) {
    properties["Created at"] = {
      date: { start: team.created_at },
    };
  }

  if (queryData.results && queryData.results.length > 0) {
    const pageId = queryData.results[0].id;
    const updateResponse = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
      method: "PATCH",
      headers: notionHeaders,
      body: JSON.stringify({ properties }),
    });
    
    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      throw new Error(`Notion Team Update Error: ${JSON.stringify(errorData)}`);
    }
    return "updated";
  } else {
    const createResponse = await fetch(`https://api.notion.com/v1/pages`, {
      method: "POST",
      headers: notionHeaders,
      body: JSON.stringify({
        parent: { database_id: databaseId },
        properties: properties,
      }),
    });

    if (!createResponse.ok) {
      const errorData = await createResponse.json();
      throw new Error(`Notion Team Create Error: ${JSON.stringify(errorData)}`);
    }
    return "created";
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const secret = process.env.CRON_SECRET;
    
    if (secret && authHeader !== `Bearer ${secret}`) {
      console.warn("Unauthorized sync attempt detected");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notionApiKey = process.env.NOTION_API_KEY;
    const profileDatabaseId = process.env.NOTION_DATABASE_ID;
    const teamsDatabaseId = process.env.NOTION_TEAMS_DATABASE_ID;

    if (!notionApiKey) {
      console.error("Notion API Key Missing");
      return NextResponse.json({ error: "Notion configuration missing" }, { status: 500 });
    }

    const notionHeaders = {
      "Authorization": `Bearer ${notionApiKey}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28"
    };

    const body = await request.json();

    // 1. Webhook trigger from Supabase
    if (body.record) {
      if (body.table === 'profiles' && profileDatabaseId) {
        console.log(`Webhook trigger for profile: ${body.record.email}`);
        const action = await syncProfileToNotion(body.record as ProfileWithTeam, notionHeaders, profileDatabaseId);
        return NextResponse.json({ message: "Profile webhook sync completed", action });
      }
      
      if (body.table === 'teams' && teamsDatabaseId) {
        console.log(`Webhook trigger for team: ${body.record.name}`);
        // For webhooks, we might need more info (leader name)
        const { data: teamWithLeader } = await supabaseService
          .from("teams")
          .select("*, profiles!created_by(*)")
          .eq("id", body.record.id)
          .single();
          
        const action = await syncTeamToNotion(teamWithLeader || body.record, notionHeaders, teamsDatabaseId);
        return NextResponse.json({ message: "Team webhook sync completed", action });
      }
    }

    // 2. Full Sync request
    console.log("Full sync triggered via fetch...");
    let results: any = {};

    // Sync Profiles
    if (profileDatabaseId) {
      const { data: profiles, error: pError } = await supabaseService
        .from("profiles")
        .select("*, team_members(teams(name))")
        .eq("role", "user");

      if (!pError) {
        let pSuccess = 0;
        let pErrorCount = 0;
        for (const p of profiles || []) {
          try {
            await syncProfileToNotion(p as any, notionHeaders, profileDatabaseId);
            pSuccess++;
          } catch (e) {
            pErrorCount++;
          }
        }
        results.profiles = { success: pSuccess, errors: pErrorCount };
      }
    }

    // Sync Teams
    if (teamsDatabaseId) {
      const { data: teams, error: tError } = await supabaseService
        .from("teams")
        .select("*, profiles!created_by(*)");

      if (!tError) {
        let tSuccess = 0;
        let tErrorCount = 0;
        for (const t of teams || []) {
          try {
            await syncTeamToNotion(t, notionHeaders, teamsDatabaseId);
            tSuccess++;
          } catch (e) {
            tErrorCount++;
          }
        }
        results.teams = { success: tSuccess, errors: tErrorCount };
      }
    }

    return NextResponse.json({
      message: "Full sync completed",
      results
    });
  } catch (error) {
    console.error("Global Sync Error:", error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
