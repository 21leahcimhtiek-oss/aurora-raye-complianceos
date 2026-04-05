import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/frameworks/route";

// Mock rate limiter to always pass
jest.mock("@/lib/rate-limit", () => ({ rateLimit: jest.fn().mockResolvedValue(null) }));

const mockUser = { id: "user-1", email: "test@example.com", user_metadata: { org_id: "org-1" } };
const mockFrameworks = [
  { id: "f1", framework_id: "soc2", framework: { id: "soc2", name: "SOC 2", version: "2017" }, controls: [{ count: 60 }] },
];

const mockSupabase = {
  auth: { getUser: jest.fn().mockResolvedValue({ data: { user: mockUser }, error: null }) },
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  single: jest.fn().mockResolvedValue({ data: mockFrameworks[0], error: null }),
  data: mockFrameworks,
  error: null,
};

jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(() => mockSupabase),
}));

describe("GET /api/frameworks", () => {
  it("returns 401 when not authenticated", async () => {
    mockSupabase.auth.getUser.mockResolvedValueOnce({ data: { user: null }, error: new Error("Not auth") });
    const req = new NextRequest("http://localhost/api/frameworks");
    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it("returns 200 with framework list", async () => {
    mockSupabase.auth.getUser.mockResolvedValueOnce({ data: { user: mockUser }, error: null });
    // Simulate chained query resolving with data
    const chainMock = { select: jest.fn().mockReturnThis(), eq: jest.fn().mockResolvedValue({ data: mockFrameworks, error: null }) };
    mockSupabase.from.mockReturnValueOnce(chainMock);
    const req = new NextRequest("http://localhost/api/frameworks");
    const res = await GET(req);
    expect(res.status).toBe(200);
  });
});

describe("POST /api/frameworks", () => {
  it("returns 400 for invalid payload", async () => {
    const req = new NextRequest("http://localhost/api/frameworks", {
      method: "POST",
      body: JSON.stringify({ framework_id: "" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 201 when framework added successfully", async () => {
    const insertChain = {
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: { id: "of-1", framework_id: "soc2" }, error: null }),
    };
    mockSupabase.from.mockReturnValueOnce(insertChain);
    const req = new NextRequest("http://localhost/api/frameworks", {
      method: "POST",
      body: JSON.stringify({ framework_id: "soc2" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
  });

  it("returns 409 when framework already added", async () => {
    const insertChain = {
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: { message: "duplicate", code: "23505" } }),
    };
    mockSupabase.from.mockReturnValueOnce(insertChain);
    const req = new NextRequest("http://localhost/api/frameworks", {
      method: "POST",
      body: JSON.stringify({ framework_id: "soc2" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(409);
  });
});