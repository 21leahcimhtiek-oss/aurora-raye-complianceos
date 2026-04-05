import { test, expect } from "@playwright/test";

const TEST_EMAIL    = process.env.E2E_EMAIL    ?? "test@example.com";
const TEST_PASSWORD = process.env.E2E_PASSWORD ?? "testpassword123";

test.describe("Compliance Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("login and reach dashboard", async ({ page }) => {
    await page.fill('[name="email"]',    TEST_EMAIL);
    await page.fill('[name="password"]', TEST_PASSWORD);
    await page.click('[type="submit"]');

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText("Dashboard")).toBeVisible();
    await expect(page.getByText("Overall Score")).toBeVisible();
  });

  test("add a compliance framework", async ({ page }) => {
    // Login
    await page.fill('[name="email"]',    TEST_EMAIL);
    await page.fill('[name="password"]', TEST_PASSWORD);
    await page.click('[type="submit"]');
    await page.waitForURL(/\/dashboard/);

    // Navigate to frameworks
    await page.click("text=Frameworks");
    await expect(page).toHaveURL(/\/frameworks/);
    await expect(page.getByText("SOC 2 Type II")).toBeVisible();

    // Add SOC 2 if not already active
    const addButton = page.getByRole("button", { name: "+ Add Framework" }).first();
    if (await addButton.isVisible()) {
      await addButton.click();
      await expect(page.getByText("Active")).toBeVisible({ timeout: 5000 });
    }
  });

  test("run AI gap analysis", async ({ page }) => {
    await page.fill('[name="email"]',    TEST_EMAIL);
    await page.fill('[name="password"]', TEST_PASSWORD);
    await page.click('[type="submit"]');
    await page.waitForURL(/\/dashboard/);

    await page.goto("/frameworks/soc2");
    await expect(page.getByText("SOC 2")).toBeVisible();

    const gapBtn = page.getByRole("button", { name: /gap analysis/i });
    await expect(gapBtn).toBeVisible();
    await gapBtn.click();

    // Should show loading state or redirect to findings
    await expect(
      page.getByText(/generating|analysis|findings/i).first()
    ).toBeVisible({ timeout: 15000 });
  });

  test("create and view a finding", async ({ page }) => {
    await page.fill('[name="email"]',    TEST_EMAIL);
    await page.fill('[name="password"]', TEST_PASSWORD);
    await page.click('[type="submit"]');
    await page.waitForURL(/\/dashboard/);

    await page.goto("/findings");
    await expect(page.getByText("Findings")).toBeVisible();

    // Create a finding via API
    const response = await page.request.post("/api/findings", {
      data: {
        title:    "E2E Test Finding",
        severity: "medium",
      },
    });
    expect(response.status()).toBe(201);

    // Reload and verify
    await page.reload();
    await expect(page.getByText("E2E Test Finding")).toBeVisible();
  });

  test("view billing plans", async ({ page }) => {
    await page.fill('[name="email"]',    TEST_EMAIL);
    await page.fill('[name="password"]', TEST_PASSWORD);
    await page.click('[type="submit"]');
    await page.waitForURL(/\/dashboard/);

    await page.goto("/billing");
    await expect(page.getByText("Billing & Plans")).toBeVisible();
    await expect(page.getByText("Starter")).toBeVisible();
    await expect(page.getByText("Pro")).toBeVisible();
    await expect(page.getByText("Enterprise")).toBeVisible();
  });
});