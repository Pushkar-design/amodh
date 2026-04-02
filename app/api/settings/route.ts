import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabaseServer";
import { isAdminAuthenticated } from "@/lib/supabaseServerAuth";

const SETTINGS_SELECT =
  "id, whatsapp_number, contact_phone, contact_email, meals_enabled, meal_breakfast_pp_night, meal_lunch_pp_night, meal_dinner_pp_night";

function parseNullableMoney(v: unknown): number | null | undefined {
  if (v === undefined) return undefined;
  if (v === null || v === "") return null;
  const n = Number(v);
  if (!Number.isFinite(n) || n < 0) return undefined;
  return n;
}

export async function GET() {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("hotel_settings")
      .select(SETTINGS_SELECT)
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return NextResponse.json({
      whatsapp_number: data?.whatsapp_number ?? "",
      contact_phone:
        typeof data?.contact_phone === "string" ? data.contact_phone : "",
      contact_email:
        typeof data?.contact_email === "string" ? data.contact_email : "",
      meals_enabled: Boolean(data?.meals_enabled),
      meal_breakfast_pp_night:
        data?.meal_breakfast_pp_night != null
          ? Number(data.meal_breakfast_pp_night)
          : null,
      meal_lunch_pp_night:
        data?.meal_lunch_pp_night != null
          ? Number(data.meal_lunch_pp_night)
          : null,
      meal_dinner_pp_night:
        data?.meal_dinner_pp_night != null
          ? Number(data.meal_dinner_pp_night)
          : null,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        error: "Failed to load settings",
        whatsapp_number: "",
        contact_phone: "",
        contact_email: "",
        meals_enabled: false,
        meal_breakfast_pp_night: null,
        meal_lunch_pp_night: null,
        meal_dinner_pp_night: null,
      },
      { status: 503 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    whatsapp_number?: string;
    contact_phone?: string;
    contact_email?: string;
    meals_enabled?: boolean;
    meal_breakfast_pp_night?: number | null;
    meal_lunch_pp_night?: number | null;
    meal_dinner_pp_night?: number | null;
  };
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

  const contact_phone =
    typeof body.contact_phone === "string" ? body.contact_phone.trim() : "";
  const contact_email =
    typeof body.contact_email === "string" ? body.contact_email.trim() : "";

  const meals_enabled =
    typeof body.meals_enabled === "boolean" ? body.meals_enabled : false;

  const b = parseNullableMoney(body.meal_breakfast_pp_night);
  const l = parseNullableMoney(body.meal_lunch_pp_night);
  const d = parseNullableMoney(body.meal_dinner_pp_night);
  if (b === undefined || l === undefined || d === undefined) {
    return NextResponse.json(
      { error: "Meal prices must be non-negative numbers or empty" },
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

    const payload = {
      whatsapp_number,
      contact_phone,
      contact_email,
      meals_enabled,
      meal_breakfast_pp_night: b,
      meal_lunch_pp_night: l,
      meal_dinner_pp_night: d,
    };

    if (existing?.id) {
      const { error } = await supabase
        .from("hotel_settings")
        .update(payload)
        .eq("id", existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("hotel_settings").insert(payload);
      if (error) throw error;
    }

    return NextResponse.json({
      whatsapp_number,
      contact_phone,
      contact_email,
      meals_enabled,
      meal_breakfast_pp_night: b,
      meal_lunch_pp_night: l,
      meal_dinner_pp_night: d,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 503 }
    );
  }
}
