import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/findings/route";
import { PATCH } from "@/app/api/findings/[id]/route";

jest.mock("@/lib/rate-limit", () => ({ rateLimit: jest.fn().mockResolvedValue(null) }));

const mockUser = { id: "user-1", email: "test@example.com", user_metadata: { org_id: "org-1" } };

const mockSupabase = {
  auth: { getUser: jest.fn().mockResolvedValue({ data: { user: mockUser }, error: null }) },
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  order: jest.fn().mockReturnThis(),
  single: jest.fn().mockResolvedValue({ data: null, error: null }),
};

jest.mock("@/lib/supabase/server", () => ({ createClient: jest.fn(() => mockSupabase) }));

describe("GET /api/findings", () => {
  it("returns 401 when unauthenticated", async () => {
    mockSupabase.auth.getUser.mockResolvedValueOnce({ data: { user: null }, error: new Error("no auth") });
    const req = new NextRequest("http://localhost/api/findings");
    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it("returns 200 with findings list", async () => {
    const findings = [{ id: "f1", title: "Test", severity: "high", status: "open" }];
    const chain = { select: jest.fn().mockReturnThis(), eq: jest.fn().mockReturnThis(), order: jest.fn().mockResolvedValue({ data: findings, error: null }) };
    mockSupabase.from.mockReturnValueOnce(chain);
    const req = new NextRequest("http://localhost/api/findings");
    const res = await GET(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data).toHaveLength(1);
  });
});

describe("POST /api/findings", () => {
  it("returns 400 for missing required fields", async () => {
    const req = new NextRequest("http://localhost/api/findings", {
      method: "POST",
      body: JSON.stringify({ title: "" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 201 when finding created", async () => {
    const newFinding = { id: "f2", title: "Missing MFA", severity: "high", status: "open" };
    const chain = {
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: newFinding, error: null }),
    };
    mockSupabase.from.mockReturnValueOnce(chain);
    const req = new NextRequest("http://localhost/api/findings", {
      method: "POST",
      body: JSON.stringify({ title: "Missing MFA", severity: "high" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
  });
});

describe("PATCH /api/findings/[id]", () => {
  it("returns 400 for invalid status", async () => {
    const req = new NextRequest("http://localhost/api/findings/f1", {
      method: "PATCH",
      body: JSON.stringify({ status: "invalid_status" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await PATCH(req, { params: { id: "f1" } });
    expect(res.status).toBe(400);
  });

  it("returns 200 on successful status update", async () => {
    const updated = { id: "f1", status: "resolved" };
    const chain = {
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: updated, error: null }),
    };
    mockSupabase.from.mockReturnValueOnce(chain);
    const req = new NextRequest("http://localhost/api/findings/f1", {
      method: "PATCH",
      body: JSON.stringify({ status: "resolved" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await PATCH(req, { params: { id: "f1" } });
    expect(res.status).toBe(200);
  });
});