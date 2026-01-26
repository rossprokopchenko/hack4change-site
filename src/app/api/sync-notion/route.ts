import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase/service";
import type { Database } from "@/lib/supabase/types";

type ProfileWithTeam = Database["public"]["Tables"]["profiles"]["Row"] & {
  team_members: Array<{
    teams: {
      name: string;
    } | null;
  }>;
};

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
      console.error("Notion Configuration Missing:", { 
        hasApiKey: !!notionApiKey, 
        hasDatabaseId: !!databaseId 
      });
      return NextResponse.json(
        { error: "Notion API key or Database ID is missing" },
        { status: 500 }
      );
    }

    // 1. Fetch profiles with team information
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

    // 2. Sync to Notion
    let successCount = 0;
    let errorCount = 0;

    const typedProfiles = (profiles || []) as unknown as ProfileWithTeam[];
    console.log(`Starting sync for ${typedProfiles.length} users via fetch...`);

    const notionHeaders = {
      "Authorization": `Bearer ${notionApiKey}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28"
    };

    for (const profile of typedProfiles) {
      try {
        const teamName = profile.team_members?.[0]?.teams?.name || "No Team";

        // Query Notion database using standard fetch
        const queryResponse = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
          method: "POST",
          headers: notionHeaders,
          body: JSON.stringify({
            filter: {
              property: "Email",
              title: {
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
            rich_text: [{ text: { content: profile.first_name || "" } }],
          },
          "Last Name": {
            rich_text: [{ text: { content: profile.last_name || "" } }],
          },
          "RSVP Status": {
            select: { name: profile.rsvp_status },
          },
          "Team": {
            rich_text: [{ text: { content: teamName } }],
          },
          "Created at": {
            date: { start: profile.created_at },
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
        } else {
          // Create new page
          const createResponse = await fetch(`https://api.notion.com/v1/pages`, {
            method: "POST",
            headers: notionHeaders,
            body: JSON.stringify({
              parent: { database_id: databaseId },
              properties: {
                Email: {
                  title: [{ text: { content: profile.email } }],
                },
                ...properties,
              },
            }),
          });

          if (!createResponse.ok) {
            const errorData = await createResponse.json();
            throw new Error(`Notion Create Error: ${JSON.stringify(errorData)}`);
          }
        }
        successCount++;
      } catch (err) {
        console.error(`Failed to sync user ${profile.email}:`, err);
        errorCount++;
      }
    }

    return NextResponse.json({
      message: "Sync completed",
      successCount,
      errorCount,
    });
  } catch (error) {
    console.error("Global Sync Error:", error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
