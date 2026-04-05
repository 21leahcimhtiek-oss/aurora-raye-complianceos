import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { AppError } from "@/lib/errors";
import { rateLimit } from "@/lib/rate-limit";

const InviteSchema = z.object({
  email: z.string().email(),
  role:  z.enum(["admin", "member"]).default("member"),
});

export async function POST(req: NextRequest) {
  const limited = await rateLimit(req, { limit: 10, window: 60 });
  if (limited) return limited;

  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = InviteSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const orgId = user.user_metadata?.org_id;

    // Record the pending invite
    const { error: insertErr } = await supabase
      .from("invitations")
      .insert({
        org_id:     orgId,
        email:      parsed.data.email,
        role:       parsed.data.role,
        invited_by: user.id,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });

    if (insertErr) {
      if (insertErr.code === "23505") return NextResponse.json({ error: "User already invited" }, { status: 409 });
      throw new AppError(insertErr.message, 500);
    }

    // Send invite email via Supabase Auth Admin API
    const { error: inviteErr } = await supabase.auth.admin.inviteUserByEmail(parsed.data.email, {
      data: { org_id: orgId, role: parsed.data.role },
    });

    if (inviteErr) throw new AppError(inviteErr.message, 500);
    return NextResponse.json({ message: `Invitation sent to ${parsed.data.email}` }, { status: 201 });
  } catch (err) {
    if (err instanceof AppError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}