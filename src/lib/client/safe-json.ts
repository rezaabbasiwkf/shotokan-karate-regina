export async function safelyReadJson<T = Record<string, unknown>>(response: Response): Promise<T> {
  const responseText = await response.text();
  if (!responseText.trim()) throw new Error(`The registration server returned an empty response. Status: ${response.status}`);
  try { return JSON.parse(responseText) as T; }
  catch { throw new Error(`The registration server returned an invalid response. Status: ${response.status}`); }
}
