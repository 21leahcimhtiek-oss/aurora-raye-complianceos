# Aurora Rayes ComplianceOS API Reference

All API routes are under `/api/`. Authentication is required on all routes (Supabase JWT in cookie). Rate limits apply — see headers `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `Retry-After`.

---

## Authentication

Aurora Rayes ComplianceOS uses Supabase Auth. Authenticate via the UI (login/signup) — the session cookie is automatically sent with every request.

---

## Frameworks

### `GET /api/frameworks`

Returns all frameworks added to the authenticated user's organisation.

**Response 200**
```json
{
  "data": [
    {
      "id": "org-fw-uuid",
      "framework_id": "soc2",
      "added_at": "2024-01-10T12:00:00Z",
      "framework": { "id": "soc2", "name": "SOC 2 Type II", "version": "2017", "description": "..." },
      "controls": [{ "count": 60 }],
      "compliant": [{ "count": 45 }]
    }
  ]
}
```

### `POST /api/frameworks`

Add a framework to your organisation.

**Body**
```json
{ "framework_id": "soc2" }
```

**Responses**
- `201` — Framework added
- `400` — Invalid payload
- `409` — Framework already added

---

### `GET /api/frameworks/:id`

Get full framework detail including controls and evidence.

**Response 200**
```json
{
  "data": {
    "id": "soc2",
    "name": "SOC 2 Type II",
    "version": "2017",
    "controls": [
      {
        "id": "ctrl-uuid",
        "title": "CC6.1 — Logical Access Controls",
        "status": "compliant",
        "sort_order": 1,
        "evidence": [
          { "id": "ev-uuid", "title": "Access policy doc", "url": "https://...", "uploaded_at": "2024-01-10T..." }
        ]
      }
    ]
  }
}
```

---

## Controls

### `GET /api/controls`

Returns controls for the authenticated org. Optionally filter by `?framework_id=soc2`.

**Response 200**
```json
{ "data": [{ "id": "uuid", "title": "...", "status": "compliant", "evidenceCount": 3 }] }
```

### `POST /api/controls`

Update a control's status or notes.

**Body**
```json
{
  "id": "ctrl-uuid",
  "status": "compliant",
  "notes": "Reviewed by Alice on 2024-01-10"
}
```

**status values:** `compliant` | `partial` | `non_compliant`

---

## Findings

### `GET /api/findings`

Returns all findings. Optional query params: `?severity=critical`, `?status=open`.

**Response 200**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "MFA not enforced for admin accounts",
      "severity": "critical",
      "status": "open",
      "assignee": "alice@acme.com",
      "due_date": "2024-02-01T00:00:00Z",
      "created_at": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### `POST /api/findings`

Create a new finding.

**Body**
```json
{
  "title": "MFA not enforced for admin accounts",
  "description": "Admin users can log in without MFA enabled.",
  "severity": "critical",
  "framework_id": "soc2",
  "control_id": "ctrl-uuid",
  "assignee": "alice@acme.com",
  "due_date": "2024-02-01T00:00:00Z"
}
```

**severity values:** `critical` | `high` | `medium` | `low`

### `PATCH /api/findings/:id`

Update status or assignee.

**Body**
```json
{
  "status": "in_progress",
  "assignee": "bob@acme.com",
  "notes": "Bob is investigating"
}
```

**status values:** `open` | `in_progress` | `resolved`

---

## Audits

### `GET /api/audits`

Returns all audits. Optional filter: `?status=upcoming`.

**Response 200**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "SOC 2 Annual Audit",
      "auditor": "Deloitte",
      "framework_name": "SOC 2 Type II",
      "scheduled_at": "2024-06-01T00:00:00Z",
      "status": "upcoming"
    }
  ]
}
```

### `POST /api/audits`

Schedule a new audit.

**Body**
```json
{
  "name": "SOC 2 Annual Audit",
  "auditor": "Deloitte",
  "framework_id": "soc2",
  "framework_name": "SOC 2 Type II",
  "scheduled_at": "2024-06-01T00:00:00Z",
  "notes": "Prepare evidence by May 15"
}
```

---

## AI Gap Analysis

### `POST /api/ai/gap-analysis`

Run GPT-4-powered gap analysis for a framework.

**Body**
```json
{ "framework_id": "soc2", "context": "Optional additional context" }
```

**Response 200**
```json
{
  "gaps": [
    {
      "control": "CC6.1",
      "title": "Logical Access Controls",
      "status": "partial",
      "recommendation": "Enable MFA for all administrative accounts immediately."
    }
  ],
  "summary": "17 controls need attention. 3 are critical gaps.",
  "score": 67
}
```

Rate limit: 5 requests per 60 seconds.

---

## Auth

### `POST /api/auth/invite`

Invite a team member.

**Body**
```json
{ "email": "newmember@acme.com", "role": "member" }
```

**role values:** `admin` | `member`

**Responses**
- `201` — Invite sent
- `409` — Already invited

---

## Checkout

### `POST /api/checkout`

Create a Stripe Checkout session.

**Body**
```json
{ "plan": "pro" }
```

**plan values:** `starter` | `pro` | `enterprise`

**Response 200**
```json
{ "url": "REPLACE_WITH_CHECKOUT_SESSION_URL" }
```

---

## Error Format

All errors return a consistent JSON structure:

```json
{ "error": "Human-readable error message" }
```

Validation errors include field-level detail:

```json
{
  "error": {
    "fieldErrors": { "severity": ["Invalid enum value"] },
    "formErrors": []
  }
}
```