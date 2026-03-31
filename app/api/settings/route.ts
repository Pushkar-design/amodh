import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabaseServer";
import { isAdminAuthenticated } from "@/lib/supabaseServerAuth";

export async function GET() {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("hotel_settings")
      .select("id, whatsapp_number")
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return NextResponse.json({
      whatsapp_number: data?.whatsapp_number ?? "",
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to load settings", whatsapp_number: "" },
      { status: 503 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { whatsapp_number?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const whatsapp_number =
    typeof body.whatsapp_number === "string" ? body.whatsapp_number.trim() : "";
  if (!whatsapp_number) {
    return NextResponse.json(
      { error: "whatsapp_number is required" },
      { status: 400 }
    );
  }

  try {
    const supabase = createServiceClient();
    const { data: existing } = await supabase
      .from("hotel_settings")
      .select("id")
      .limit(1)
      .maybeSingle();

    if (existing?.id) {
      const { error } = await supabase
        .from("hotel_settings")
        .update({ whatsapp_number })
        .eq("id", existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("hotel_settings")
        .insert({ whatsapp_number });
      if (error) throw error;
    }

    return NextResponse.json({ whatsapp_number });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 503 }
    );
  }
}
