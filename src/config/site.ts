import type { SidebarNavItem, SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  name: "ExportX",
  headline: "All-in-one Figma Plugin for Image Compression & Upload",
  description:
    "A local compression export tool based on WebAssembly supporting PNG, JPG, WEBP, SVG, AVIF Local compression | Quick and efficient | Privacy protection",
  url: "https://www.abfree.com",
  links: {
    twitter: "https://twitter.com/miickasmt",
    github: "https://github.com/tyaqing",
  },
};

export const footerLinks: SidebarNavItem[] = [
  {
    title: "Company",
    items: [
      { title: "About", href: "#" },
      // { title: "Enterprise", href: "#" },
      // { title: "Partners", href: "#" },
      // { title: "Jobs", href: "#" },
    ],
  },
  // {
  //   title: "Product",
  //   items: [
  //     { title: "Security", href: "#" },
  //     { title: "Customization", href: "#" },
  //     { title: "Customers", href: "#" },
  //     { title: "Changelog", href: "#" },
  //   ],
  // },
  // {
  //   title: "Docs",
  //   items: [
  //     { title: "Introduction", href: "#" },
  //     { title: "Installation", href: "#" },
  //     { title: "Components", href: "#" },
  //     { title: "Code Blocks", href: "#" },
  //   ],
  // },
];