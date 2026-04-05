export async function rateLimit(identifier: string, limit = 20, window = '1 m') {
  if (!process.env.UPSTASH_REDIS_REST_URL) return { success: true, remaining: 10 };
  const { Ratelimit } = await import('@upstash/ratelimit');
  const { Redis } = await import('@upstash/redis');
  const rl = new Ratelimit({ redis: Redis.fromEnv(), limiter: Ratelimit.slidingWindow(limit, window as any) });
  const r = await rl.limit(identifier);
  return { success: r.success, remaining: r.remaining };
}