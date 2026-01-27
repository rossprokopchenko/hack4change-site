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

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const secret = process.env.CRON_SECRET;
    
    if (secret && authHeader !== `Bearer ${secret}`) {
      console.warn("Unauthorized sync attempt detected");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notionApiKey = process.env.NOTION_API_KEY;
    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!notionApiKey || !databaseId) {
      console.error("Notion Configuration Missing");
      return NextResponse.json({ error: "Notion configuration missing" }, { status: 500 });
    }

    const notionHeaders = {
      "Authorization": `Bearer ${notionApiKey}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28"
    };

    const body = await request.json();

    // Check if this is a Supabase Webhook payload
    // Supabase Webhook payload typically has 'record', 'table', 'type'
    if (body.record && body.table === 'profiles') {
      console.log(`Webhook trigger for profile: ${body.record.email}`);
      const action = await syncProfileToNotion(body.record as ProfileWithTeam, notionHeaders, databaseId);
      return NextResponse.json({ message: "Webhook sync completed", action });
    }

    // Otherwise, assume it's a full sync request
    console.log("Full sync triggered via fetch...");
    const { data: profiles, error: supabaseError } = await supabaseService
      .from("profiles")
      .select(`
        *,
        team_members (
          teams (
            name
          )
        )
      `)
      .eq("role", "user");

    if (supabaseError) {
      console.error("Supabase Error:", supabaseError);
      return NextResponse.json({ error: "Failed to fetch profiles" }, { status: 500 });
    }

    let successCount = 0;
    let errorCount = 0;

    for (const profile of (profiles || []) as any) {
      try {
        await syncProfileToNotion(profile as ProfileWithTeam, notionHeaders, databaseId);
        successCount++;
      } catch (err) {
        console.error(`Failed to sync user ${profile.email}:`, err);
        errorCount++;
      }
    }

    return NextResponse.json({
      message: "Full sync completed",
      successCount,
      errorCount,
    });
  } catch (error) {
    console.error("Global Sync Error:", error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
