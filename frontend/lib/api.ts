export class ApiError extends Error {
  constructor(
    public status: number,
    public body: unknown,
  ) {
    super(`API error: ${status}`)
    this.name = "ApiError"
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `/api/v1${path}`
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  })
  if (!res.ok) {
    throw new ApiError(res.status, await res.json().catch(() => null))
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

export function get<T>(path: string) {
  return request<T>(path)
}

export function post<T>(path: string, body?: unknown) {
  return request<T>(path, { method: "POST", body: body != null ? JSON.stringify(body) : undefined })
}

export function del<T>(path: string) {
  return request<T>(path, { method: "DELETE" })
}
