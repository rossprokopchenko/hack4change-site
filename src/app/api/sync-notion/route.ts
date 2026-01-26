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

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID!;

export async function POST(request: Request) {
  try {
    // Basic security check: Validate CRON_SECRET if it exists
    const authHeader = request.headers.get("Authorization");
    const secret = process.env.CRON_SECRET;
    
    if (secret && authHeader !== `Bearer ${secret}`) {
      console.warn("Unauthorized sync attempt detected");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
      return NextResponse.json(
        { error: "Notion API key or Database ID is missing" },
        { status: 500 }
      );
    }

    // 1. Fetch profiles with team information, filtering for "user" role only
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

    for (const profile of typedProfiles) {
      try {
        // Extract team name safely
        const teamName = profile.team_members?.[0]?.teams?.name || "No Team";

        // Check if user already exists in Notion by email
        const response = await notion.databases.query({
          database_id: DATABASE_ID,
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
          // Update existing page
          const pageId = response.results[0].id;
          await notion.pages.update({
            page_id: pageId,
            properties: properties,
          });
        } else {
          // Create new page
          await notion.pages.create({
            parent: { database_id: DATABASE_ID },
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
    console.error("Sync Error:", error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
