interface ErrorDetails {
  message: string;
  code?: string;
  pageViewId?: string;
  stack?: string;
}

export function parseErrorDetails(e: unknown): ErrorDetails {
  if (e instanceof Error) {
    return {
      message: e.message,
      stack: e.stack,
      code: 'ERROR'
    };
  }

  if (e && typeof e === 'object') {
    const err = e as Record<string, unknown>;
    return {
      message: typeof err.message === 'string' ? err.message : 'Unknown error',
      code: typeof err.code === 'string' ? err.code : 'UNKNOWN',
      pageViewId: typeof err.pageViewId === 'string' ? err.pageViewId : 'unknown',
      stack: typeof err.stack === 'string' ? err.stack : undefined
    };
  }

  return {
    message: String(e),
    code: 'UNKNOWN'
  };
}