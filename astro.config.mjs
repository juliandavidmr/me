import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';
import mdx from '@astrojs/mdx';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare(),
  // base: '.', // Set a path prefix.
  // Use to generate your sitemap and canonical URLs in your final build.
  site: 'https://iamjuliand.com/',

  // Preserve legacy Blogger URLs that end in `.html`.
  trailingSlash: 'ignore',
  build: {
    format: 'file',
  },

  markdown: {
    shikiConfig: {
      // Choose from Shiki's built-in themes (or add your own)
      // https://github.com/shikijs/shiki/blob/main/docs/themes.md
      theme: 'monokai',
    },
  },

  integrations: [react(), mdx(), sitemap(), robotsTxt()],
  vite: {
    plugins: [tailwindcss()],
  },
});
