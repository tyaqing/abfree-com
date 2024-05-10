/** @type {import('astro-i18next').AstroI18nextConfig} */
export default {
    defaultLocale: "en",
    locales: ["en", "zh"],
    i18nextServer: {
        debug: true,
    },
    routes: {
        en: {
            about: "a-propos",
            "contact-us": "contactez-nous",
            products: {
                index: "produits",
                categories: "categories",
            },
        },
        zh: {
            about: "a-proposito",
            "contact-us": "contactenos",
            products: {
                index: "productos",
                categories: "categorias",
            },
        },
    },
};