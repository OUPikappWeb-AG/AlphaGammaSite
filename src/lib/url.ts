/**
 * URL normalisation.
 *
 * `Astro.url.pathname` reflects however the build happens to emit files —
 * "/join", "/join/", or "/join.html" depending on configuration. Anything that
 * compares or publishes a path needs one canonical spelling, or two bugs
 * appear: canonical tags point at "/index.html" instead of "/", and the
 * navigation's active-page highlight silently never matches.
 *
 * Everything that touches a path goes through here.
 */

/**
 * Reduce any pathname to its canonical, extensionless, no-trailing-slash form.
 *
 *   "/"            → "/"
 *   "/index.html"  → "/"
 *   "/join.html"   → "/join"
 *   "/join/"       → "/join"
 */
export function canonicalPath(pathname: string): string {
  const stripped = pathname
    .replace(/\/index\.html?$/i, '/')
    .replace(/\.html?$/i, '')
    .replace(/\/+$/, '');

  return stripped === '' ? '/' : stripped;
}

/** The absolute canonical URL for a pathname, given the configured site. */
export function canonicalUrl(pathname: string, site: URL | undefined): string {
  return new URL(canonicalPath(pathname), site).href;
}
