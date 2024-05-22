import db from "@astrojs/db";
import icon from "astro-icon";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import simpleStackForm from "simple-stack-form";
import {defineConfig} from "astro/config";
import astroI18next from "astro-i18next";
import vercel from "@astrojs/vercel/static";


// https://astro.build/config
export default defineConfig({
    site: "https://www.abfree.com",
    integrations: [
        mdx({
            syntaxHighlight: "shiki",
            shikiConfig: {
                theme: "github-dark-dimmed",
            },
            gfm: true,
        }),
        icon(),
        sitemap(),
        react(),
        tailwind({
            applyBaseStyles: false,
        }),
        simpleStackForm(),
        astroI18next(),
    ],
    output: "static",
    adapter: vercel({
        webAnalytics:{
            enabled:true
        }
    }),
});
