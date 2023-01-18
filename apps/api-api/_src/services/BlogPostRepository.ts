import { BlogPost, BlogPostId } from "@effect-ts-app/boilerplate-types/Blog"

export interface BlogPostRepository {
  all: Effect<never, never, readonly BlogPost[]>
  find: (id: BlogPostId) => Effect<never, never, Opt<BlogPost>>
  save: (post: BlogPost) => Effect<never, never, void>
}
export const BlogPostRepository = Tag<BlogPostRepository>()

export const BlogPostLive = Layer(BlogPostRepository)((): BlogPostRepository => {
  const items: BlogPost[] = [
    new BlogPost({
      id: BlogPostId("post-test123"),
      title: ReasonableString("Test post"),
      body: LongString("imma test body")
    })
  ]

  return {
    all: Effect([...items]),
    find: id => Effect(items.findFirst(_ => _.id === id)),
    save: post => Effect(items.push(post))
  }
})
