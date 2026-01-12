import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase/service";
import { createHmac } from "crypto";

export async function POST(request: Request) {
  try {
    const signature = request.headers.get("tally-signature");
    const secret = process.env.TALLY_WEBHOOK_SECRET;

    if (!secret) {
      console.error("TALLY_WEBHOOK_SECRET is not defined in environment variables");
      return NextResponse.json({ error: "Configuration error" }, { status: 500 });
    }

    const rawBody = await request.text();
    const hmac = createHmac("sha256", secret);
    const calculatedSignature = hmac.update(rawBody).digest("base64");

    if (calculatedSignature !== signature) {
      console.error("Webhook Signature Mismatch:", { 
        received: signature, 
        calculated: calculatedSignature 
      });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    console.log("Full Tally Payload:", JSON.stringify(payload, null, 2));
    
    const fields = payload.data?.fields || [];
    console.log("Found Fields:", JSON.stringify(fields.map((f: any) => ({ key: f.key, label: f.label })), null, 2));
    
    const findField = (name: string) => {
      const field = fields.find((f: any) => f.key?.toLowerCase() === name.toLowerCase() || f.label?.toLowerCase() === name.toLowerCase());
      return field?.value;
    };
    
    const user_id = findField("user_id");
    const event_id = findField("event_id");
    const submission_id = payload.data?.submissionId;

    if (!user_id || !event_id || !submission_id) {
      console.error("Missing required fields in Tally webhook. Detected:", { user_id, event_id, submission_id });
      return NextResponse.json({ 
        error: "Missing required fields", 
        detected: { user_id: !!user_id, event_id: !!event_id, submission_id: !!submission_id } 
      }, { status: 400 });
    }

    const { error } = await supabaseService
      .from("event_form_submissions" as any)
      .insert({
        user_id,
        event_id,
        tally_submission_id: submission_id,
        completed_at: new Date().toISOString(),
      });

    if (error) {
      if (error.code === "23505") { // Unique violation
        return NextResponse.json({ message: "Submission already recorded" }, { status: 200 });
      }
      console.error("Error storing Tally submission:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}
