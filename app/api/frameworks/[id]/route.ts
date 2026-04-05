import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { AppError } from "@/lib/errors";
import { rateLimit } from "@/lib/rate-limit";

interface Context { params: { id: string } }

export async function GET(req: NextRequest, { params }: Context) {
  const limited = await rateLimit(req, { limit: 100, window: 60 });
  if (limited) return limited;

  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: framework, error: fwErr } = await supabase
      .from("frameworks")
      .select("*")
      .eq("id", params.id)
      .single();

    if (fwErr || !framework) return NextResponse.json({ error: "Framework not found" }, { status: 404 });

    const orgId = user.user_metadata?.org_id;
    const { data: controls, error: ctrlErr } = await supabase
      .from("controls")
      .select("*, evidence:evidence(id, title, url, uploaded_at)")
      .eq("framework_id", params.id)
      .eq("org_id", orgId)
      .order("sort_order", { ascending: true });

    if (ctrlErr) throw new AppError(ctrlErr.message, 500);

    return NextResponse.json({ data: { ...framework, controls: controls ?? [] } });
  } catch (err) {
    if (err instanceof AppError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}