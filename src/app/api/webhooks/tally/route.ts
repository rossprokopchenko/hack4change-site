import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase/service";
import { createHmac } from "crypto";

export async function POST(request: Request) {
  try {
    const signature = request.headers.get("tally-signature");
    const secret = process.env.TALLY_WEBHOOK_SECRET;

    if (!secret) {
      console.error("TALLY_WEBHOOK_SECRET is not defined");
      return NextResponse.json({ error: "Configuration error" }, { status: 500 });
    }

    const rawBody = await request.text();
    const hmac = createHmac("sha256", secret);
    const calculatedSignature = hmac.update(rawBody).digest("hex");

    if (calculatedSignature !== signature) {
      console.error("Invalid Tally signature", { calculatedSignature, receivedSignature: signature });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    
    // Tally sends data in a specific format
    // Hidden fields are usually in payload.data.fields
    const fields = payload.data?.fields || [];
    
    const findField = (name: string) => fields.find((f: any) => f.key === name || f.label === name)?.value;
    
    const user_id = findField("user_id");
    const event_id = findField("event_id");
    const submission_id = payload.data?.submissionId;

    if (!user_id || !event_id || !submission_id) {
      console.error("Missing required fields in Tally webhook", { user_id, event_id, submission_id });
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
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
