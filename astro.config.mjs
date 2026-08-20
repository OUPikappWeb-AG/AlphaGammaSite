// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/**
 * Astro configuration.
 *
 * You should rarely need to edit this file. Content lives in src/data and
 * src/content; see EDITING.md.
 */
export default defineConfig({
  /**
   * The canonical production URL. Used to build absolute links in the sitemap
   * and in Open Graph tags, which is what makes the site preview correctly
   * when a parent texts the link to another parent.
   */
  site: 'https://oupikapp.com',

  /** Fully static HTML. No server, no database, nothing to keep patched. */
  output: 'static',

  integrations: [mdx(), sitemap()],

  /** Trailing slashes off, so /parents and /parents/ don't split SEO signals. */
  trailingSlash: 'never',

  vite: {
    // Tailwind v4 is a Vite plugin, not an Astro integration, and is
    // configured in CSS (src/styles/global.css) rather than a JS config file.
    plugins: [tailwindcss()],
  },
});
