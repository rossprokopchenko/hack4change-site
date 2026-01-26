import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase/service";
import { Client } from "@notionhq/client";
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

    // Initialize client inside the handler
    const notion = new Client({ auth: notionApiKey });

    // Debug: Check if databases.query exists
    if (!notion.databases || typeof notion.databases.query !== "function") {
      console.error("Notion Client Error: databases.query is not a function. Client structure:", Object.keys(notion));
      if (notion.databases) console.error("Databases structure:", Object.keys(notion.databases));
      return NextResponse.json({ error: "Internal Notion Client Error" }, { status: 500 });
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
    console.log(`Starting sync for ${typedProfiles.length} users...`);

    for (const profile of typedProfiles) {
      try {
        const teamName = profile.team_members?.[0]?.teams?.name || "No Team";

        // Query Notion database
        const response = await notion.databases.query({
          database_id: databaseId,
          filter: {
            property: "Email",
            title: {
              equals: profile.email,
            },
          },
        });

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

        if (response.results.length > 0) {
          const pageId = response.results[0].id;
          await notion.pages.update({
            page_id: pageId,
            properties: properties,
          });
        } else {
          await notion.pages.create({
            parent: { database_id: databaseId },
            properties: {
              Email: {
                title: [{ text: { content: profile.email } }],
              },
              ...properties,
            },
          });
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
