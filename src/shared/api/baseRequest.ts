export const baseRequest = async (
  path: string,
  method: "GET" | "POST" | "DELETE" = "GET",
  body: Record<string, unknown> | null = null,
  signal?: AbortSignal,
) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const url = `${apiUrl}${path}`;

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : body,
    signal,
  });

  return response;
};
