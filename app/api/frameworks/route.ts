import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { AppError } from "@/lib/errors";
import { rateLimit } from "@/lib/rate-limit";

const AddFrameworkSchema = z.object({
  framework_id: z.string().min(1).max(64),
});

export async function GET(req: NextRequest) {
  const limited = await rateLimit(req, { limit: 100, window: 60 });
  if (limited) return limited;

  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const orgId = user.user_metadata?.org_id;
    const { data, error } = await supabase
      .from("org_frameworks")
      .select(`
        id,
        framework_id,
        added_at,
        framework:frameworks(id, name, version, description),
        controls:controls(count),
        compliant:controls(count).eq(status, compliant)
      `)
      .eq("org_id", orgId);

    if (error) throw new AppError(error.message, 500);
    return NextResponse.json({ data });
  } catch (err) {
    if (err instanceof AppError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const limited = await rateLimit(req, { limit: 20, window: 60 });
  if (limited) return limited;

  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = AddFrameworkSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const orgId = user.user_metadata?.org_id;
    const { data, error } = await supabase
      .from("org_frameworks")
      .insert({ org_id: orgId, framework_id: parsed.data.framework_id })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") return NextResponse.json({ error: "Framework already added" }, { status: 409 });
      throw new AppError(error.message, 500);
    }
    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    if (err instanceof AppError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}