import { getCollection } from "astro:content";
import i18next from "i18next";

export async function getCategories() {
  const posts = await getCollection("blog");
  const categories = [
    ...new Set(posts.map((post) => post.data.category).flat()),
  ];

  return categories;
}

export async function getPosts() {
  const posts = (await getCollection("blog"))
    .filter((guide) => guide.data.published)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .map((post) => {
      return {
        ...post,
        slug:post.slug
      }
    })
  return posts;
}

export async function getPostsByCategory(category: string) {
  const posts = (await getCollection("blog"))
    .filter((post) => post.data.category.includes(category))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return posts;
}

export async function getGuides() {
  const guides = (await getCollection("guides"))
    .filter((guide) => guide.data.published)
    .map((guide) => {
      return {
        ...guide,
        // 去掉语言前缀
        slug: guide.slug
      }
    })
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return guides;
}
