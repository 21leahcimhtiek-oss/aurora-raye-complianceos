import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { AppError } from "@/lib/errors";
import { rateLimit } from "@/lib/rate-limit";

const PatchFindingSchema = z.object({
  status:   z.enum(["open", "in_progress", "resolved"]).optional(),
  assignee: z.string().email().optional(),
  due_date: z.string().datetime().optional(),
  notes:    z.string().max(2000).optional(),
});

interface Context { params: { id: string } }

export async function PATCH(req: NextRequest, { params }: Context) {
  const limited = await rateLimit(req, { limit: 50, window: 60 });
  if (limited) return limited;

  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = PatchFindingSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const orgId = user.user_metadata?.org_id;
    const { data, error } = await supabase
      .from("findings")
      .update({ ...parsed.data, updated_at: new Date().toISOString() })
      .eq("id", params.id)
      .eq("org_id", orgId)
      .select()
      .single();

    if (error) throw new AppError(error.message, 500);
    if (!data) return NextResponse.json({ error: "Finding not found" }, { status: 404 });
    return NextResponse.json({ data });
  } catch (err) {
    if (err instanceof AppError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}