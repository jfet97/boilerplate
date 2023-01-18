import type { BlogPost } from "@effect-ts-app/boilerplate-types/Blog"

export interface BlogPostRepository {
  all: Effect<never, never, readonly BlogPost[]>
  save: (post: BlogPost) => Effect<never, never, void>
}
export const BlogPostRepository = Tag<BlogPostRepository>()

export const BlogPostLive = Layer(BlogPostRepository)((): BlogPostRepository => {
  const items: BlogPost[] = []

  return {
    all: Effect([...items]),
    save: post => Effect(items.push(post))
  }
})
