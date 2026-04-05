import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { AppError } from "@/lib/errors";
import { rateLimit } from "@/lib/rate-limit";

const UpdateControlSchema = z.object({
  id:          z.string().uuid(),
  status:      z.enum(["compliant", "partial", "non_compliant"]).optional(),
  notes:       z.string().max(2000).optional(),
});

export async function GET(req: NextRequest) {
  const limited = await rateLimit(req, { limit: 100, window: 60 });
  if (limited) return limited;

  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const frameworkId = searchParams.get("framework_id");
    const orgId = user.user_metadata?.org_id;

    let query = supabase
      .from("controls")
      .select("*, evidence:evidence(count)")
      .eq("org_id", orgId)
      .order("sort_order", { ascending: true });

    if (frameworkId) query = query.eq("framework_id", frameworkId);

    const { data, error } = await query;
    if (error) throw new AppError(error.message, 500);
    return NextResponse.json({ data: data ?? [] });
  } catch (err) {
    if (err instanceof AppError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const limited = await rateLimit(req, { limit: 50, window: 60 });
  if (limited) return limited;

  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = UpdateControlSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const { id, ...updates } = parsed.data;
    const orgId = user.user_metadata?.org_id;
    const { data, error } = await supabase
      .from("controls")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("org_id", orgId)
      .select()
      .single();

    if (error) throw new AppError(error.message, 500);
    if (!data) return NextResponse.json({ error: "Control not found" }, { status: 404 });
    return NextResponse.json({ data });
  } catch (err) {
    if (err instanceof AppError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}