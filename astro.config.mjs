import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import AutoImport from "astro-auto-import";
import { defineConfig, fontProviders } from "astro/config";
import remarkCollapse from "remark-collapse";
import remarkToc from "remark-toc";
import sharp from "sharp";
import config from "./src/config/config.json";
import theme from "./src/config/theme.json";

function parseFontString(fontStr) {
  const [name, weightPart] = fontStr.split(":");
  let weights = [400];
  const weightMatch = weightPart?.match(/wght@?([\d;]+)/);
  if (weightMatch) weights = weightMatch[1].split(";").map((weight) => parseInt(weight, 10));
  return { name: name.replace(/\+/g, " "), weights };
}

const fontsConfig = Object.entries(theme.fonts.font_family)
  .filter(([key]) => !key.includes("_type"))
  .map(([key, fontStr]) => ({
    ...parseFontString(fontStr),
    cssVariable: `--font-${key}`,
    provider: fontProviders.google(),
    display: "swap",
    fallbacks: [theme.fonts.font_family[`${key}_type`] || "sans-serif"],
  }));

export default defineConfig({
  site: config.site.base_url,
  base: "/",
  trailingSlash: "never",
  output: "static",
  image: { service: sharp() },
  vite: { plugins: [tailwindcss()] },
  fonts: fontsConfig,
  integrations: [
    react(),
    sitemap(),
    AutoImport({ imports: ["@/shortcodes/Button", "@/shortcodes/Accordion", "@/shortcodes/Notice", "@/shortcodes/Video", "@/shortcodes/Youtube", "@/shortcodes/Tabs", "@/shortcodes/Tab"] }),
    mdx(),
  ],
  markdown: { remarkPlugins: [remarkToc, [remarkCollapse, { test: "Table of contents" }]] },
});
