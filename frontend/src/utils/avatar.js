
export function getAvatarUrl(avatarUrl) {
  if (!avatarUrl) return null;
  if (/^https?:\/\//i.test(avatarUrl)) return avatarUrl;

  const API_URL = import.meta.env.API_URL;

  const apiBase = `${API_URL}`;

  const path = avatarUrl.startsWith("/") ? avatarUrl.slice(1) : avatarUrl;
  return `${apiBase}/${path}`;
}
