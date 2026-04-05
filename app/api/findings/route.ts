import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { AppError } from "@/lib/errors";
import { rateLimit } from "@/lib/rate-limit";

const CreateFindingSchema = z.object({
  title:        z.string().min(1).max(255),
  description:  z.string().max(5000).optional(),
  severity:     z.enum(["critical", "high", "medium", "low"]),
  framework_id: z.string().optional(),
  control_id:   z.string().uuid().optional(),
  assignee:     z.string().email().optional(),
  due_date:     z.string().datetime().optional(),
});

export async function GET(req: NextRequest) {
  const limited = await rateLimit(req, { limit: 100, window: 60 });
  if (limited) return limited;

  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const severity = searchParams.get("severity");
    const status   = searchParams.get("status");
    const orgId    = user.user_metadata?.org_id;

    let query = supabase
      .from("findings")
      .select("*")
      .eq("org_id", orgId)
      .order("created_at", { ascending: false });

    if (severity) query = query.eq("severity", severity);
    if (status)   query = query.eq("status",   status);

    const { data, error } = await query;
    if (error) throw new AppError(error.message, 500);
    return NextResponse.json({ data: data ?? [] });
  } catch (err) {
    if (err instanceof AppError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const limited = await rateLimit(req, { limit: 30, window: 60 });
  if (limited) return limited;

  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = CreateFindingSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const orgId = user.user_metadata?.org_id;
    const { data, error } = await supabase
      .from("findings")
      .insert({
        ...parsed.data,
        org_id:     orgId,
        created_by: user.id,
        status:     "open",
      })
      .select()
      .single();

    if (error) throw new AppError(error.message, 500);
    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    if (err instanceof AppError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}