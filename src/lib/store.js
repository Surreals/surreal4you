export const STORE_PATH = "/store";

/**
 * Whether an admin-managed link points at the on-site store. Links are stored
 * as free-form "NAME | URL" pairs, so the path is what identifies them — not
 * the label, which the admin is free to rename.
 */
export function isStoreLink(link) {
  const url = (link?.url ?? "").trim();
  return url === STORE_PATH || url.startsWith(`${STORE_PATH}/`) || url.startsWith(`${STORE_PATH}?`);
}
