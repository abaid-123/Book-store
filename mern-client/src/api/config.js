export const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? "/api" : "http://localhost:5000");

export function apiUrl(path) {
  const prefix = path.startsWith("/") ? path : `/${path}`;
  return `${API_URL}${prefix}`;
}

export function bookCoverUrl(url) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_URL}${url.startsWith("/") ? url : `/${url}`}`;
}

export async function uploadBookCover(file) {
  const body = new FormData();
  body.append("file", file);
  const res = await fetch(`${API_URL}/upload-cover`, {
    method: "POST",
    body,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Could not upload the image.");
  }
  return data.imgURL;
}
