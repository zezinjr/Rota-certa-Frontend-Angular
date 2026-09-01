export type PaginatedResponse<T> =
  | T[]
  | {
      value?: T[];
      results?: T[];
      count?: number;
      Count?: number;
    }
  | null
  | undefined;

export function extractPaginatedItems<T>(response: PaginatedResponse<T>): T[] {
  if (!response) return [];
  if (Array.isArray(response)) return response;

  return response.value ?? response.results ?? [];
}

export function extractPaginatedCount<T>(response: PaginatedResponse<T>, fallbackLength = 0): number {
  if (!response) return fallbackLength;

  if (Array.isArray(response)) return response.length;

  const count = response.count ?? response.Count;
  if (typeof count === 'number') return count;

  if (Array.isArray(response.value)) return response.value.length;
  if (Array.isArray(response.results)) return response.results.length;

  return fallbackLength;
}
