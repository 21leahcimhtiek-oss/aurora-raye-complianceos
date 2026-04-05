export class AppError extends Error {
  constructor(public message: string, public code: string, public status = 400) { super(message); }
}
export function errorResponse(error: unknown) {
  if (error instanceof AppError) return Response.json({ error: error.message, code: error.code }, { status: error.status });
  console.error('Unhandled error:', error);
  return Response.json({ error: 'Internal server error', code: 'INTERNAL_ERROR' }, { status: 500 });
}