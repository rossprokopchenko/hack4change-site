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

async function syncProfileToNotion(profile: any, notionHeaders: any, databaseId: string) {
  // Handle team association robustly (consistent with admin panel logic)
  const teamMembersRaw = profile.team_members;
  const teamMembers = Array.isArray(teamMembersRaw) ? teamMembersRaw : (teamMembersRaw ? [teamMembersRaw] : []);
  
  let teamName = "No Team";
  if (teamMembers.length > 0) {
    const rawTeam = teamMembers[0].teams || teamMembers[0].team;
    const teamData = Array.isArray(rawTeam) ? rawTeam[0] : rawTeam;
    teamName = teamData?.name || teamName;
  }

  console.log(`Syncing profile ${profile.email} with team: ${teamName}`);

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
  console.log("syncTeamToNotion started for team:", team.name);
  const leaderLabel = team.profiles?.email || "Unknown";

  console.log("Computed Leader Label:", leaderLabel);

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
    console.error("Notion Team Query Error Details:", JSON.stringify(errorData, null, 2));
    throw new Error(`Notion Query Error (Teams): ${JSON.stringify(errorData)}`);
  }

  const queryData = await queryResponse.json();
  console.log(`Notion Query Results for "${team.name}":`, queryData.results.length);
  
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

  if (queryData.results && queryData.results.length > 0) {
    console.log(`Updating existing Notion page: ${queryData.results[0].id}`);
    const pageId = queryData.results[0].id;
    const updateResponse = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
      method: "PATCH",
      headers: notionHeaders,
      body: JSON.stringify({ properties }),
    });
    
    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      console.error("Notion Team Update Error Details:", JSON.stringify(errorData, null, 2));
      throw new Error(`Notion Team Update Error: ${JSON.stringify(errorData)}`);
    }
    return "updated";
  } else {
    console.log(`Creating new Notion page in DB: ${databaseId}`);
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
      console.error("Notion Team Create Error Details:", JSON.stringify(errorData, null, 2));
      throw new Error(`Notion Team Create Error: ${JSON.stringify(errorData)}`);
    }
    return "created";
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const secret = process.env.CRON_SECRET;
    
    // Debug: Log the received header (masked)
    const maskedHeader = authHeader 
      ? (authHeader.length > 15 ? `${authHeader.substring(0, 15)}...` : authHeader)
      : "null";
    console.log(`Auth check - Received: "${maskedHeader}", Expected Secret: "${secret ? secret.substring(0, 5) + "..." : "not set"}"`);

    if (secret && authHeader !== `Bearer ${secret}`) {
      console.warn("Unauthorized sync attempt detected");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notionApiKey = process.env.NOTION_API_KEY;
    const profileDatabaseId = process.env.NOTION_DATABASE_ID;
    const teamsDatabaseId = process.env.NOTION_TEAMS_DATABASE_ID;

    console.log("Notion Sync Config:", {
      hasApiKey: !!notionApiKey,
      profileDbId: profileDatabaseId,
      teamsDbId: teamsDatabaseId,
      hasCronSecret: !!secret
    });

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
    console.log("Sync request body received:", JSON.stringify(body, null, 2));

    // 1. Webhook trigger from Supabase
    if (body.record) {
      console.log(`Webhook detected - Table: ${body.table}, Schema: ${body.schema}, Type: ${body.type}`);
      
      // Handle Profile sync (from public.profiles OR auth.users)
      if ((body.table === 'profiles' || body.table === 'users') && profileDatabaseId) {
        console.log(`Fetching full profile for sync: ${body.record.id} (${body.table})`);
        
        // Always fetch full profile info including teams to avoid partial records clearing data
        const { data: pData, error: pError } = await supabaseService
          .from("profiles")
          .select("*, team_members(teams(name))")
          .eq("id", body.record.id)
          .single();
        
        if (pError || !pData) {
          console.error("Error fetching full profile for sync:", pError);
          // Fallback to record only if fetch fails, but warn
          const action = await syncProfileToNotion(body.record, notionHeaders, profileDatabaseId);
          return NextResponse.json({ message: "Profile sync completed (partial record)", action });
        }

        const action = await syncProfileToNotion(pData, notionHeaders, profileDatabaseId);
        return NextResponse.json({ message: "Profile sync completed", action });
      }
      
      // Handle Team sync
      if (body.table === 'teams' && teamsDatabaseId) {
        console.log(`Syncing team to Notion: ${body.record.name}`);
        // Fetch leader info
        const { data: teamWithLeader, error: leaderError } = await supabaseService
          .from("teams")
          .select("*, profiles!created_by(*)")
          .eq("id", body.record.id)
          .single();
          
        if (leaderError) {
          console.error("Error fetching team leader for sync:", leaderError);
        }
          
        const action = await syncTeamToNotion(teamWithLeader || body.record, notionHeaders, teamsDatabaseId);
        return NextResponse.json({ message: "Team sync completed", action });
      }

      console.warn("Webhook received but no matching table/config found", { 
        table: body.table, 
        schema: body.schema,
        profileDb: !!profileDatabaseId, 
        teamsDb: !!teamsDatabaseId 
      });
    }

    // 2. Full Sync request
    console.log("Full sync logic starting...");
    let results: any = {};

    // Sync Profiles
    if (profileDatabaseId) {
      console.log("Fetching all profiles for full sync...");
      const { data: profiles, error: pError } = await supabaseService
        .from("profiles")
        .select("*, team_members(teams(name))");

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
