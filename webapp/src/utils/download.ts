const BASE_URL = "http://localhost:8080";

export async function downloadDocumentWithAuth(
  docId: number,
  token: string,
  fallbackName?: string
) {
  const res = await fetch(`${BASE_URL}/documents/${docId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Download failed (${res.status}). ${txt}`);
  }

  const blob = await res.blob();

  const cd = res.headers.get("content-disposition") || "";
  const match = /filename="([^"]+)"/i.exec(cd);
  const filename = match?.[1] || fallbackName || `document_${docId}.pdf`;

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}
