
export function getAvatarUrl(avatarUrl) {
  if (!avatarUrl) return null;
  if (/^https?:\/\//i.test(avatarUrl)) return avatarUrl;

  const apiBase = "http://localhost:3000";

  const path = avatarUrl.startsWith("/") ? avatarUrl.slice(1) : avatarUrl;
  return `${apiBase}/${path}`;
}
