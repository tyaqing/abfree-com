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
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .filter(post=>{
      const lang = i18next.language === 'en' ? '' : i18next.language
      return post.slug.startsWith( i18next.language)
    })
    .map((post) => {
      return {
        ...post,
        // 去掉语言前缀
        slug:post.slug
        // slug: post.slug.replace(i18next.language+'/', ''),
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
    .filter(post=>post.slug.startsWith(i18next.language))
    .map((guide) => {
      return {
        ...guide,
        // 去掉语言前缀
        slug: guide.slug.replace(i18next.language+'/', ''),
      }
    })
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return guides;
}
