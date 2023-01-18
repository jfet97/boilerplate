import { BlogPostRepository } from "@/services.js"
import { BlogRsc } from "@effect-ts-app/boilerplate-client"
import { BlogPost } from "@effect-ts-app/boilerplate-types/Blog"

export const BlogControllers = Effect.servicesWith(
  { BlogPostRepository },
  ({ BlogPostRepository }) =>
    matchResource(BlogRsc)({
      GetPosts: () => BlogPostRepository.all.map(items => ({ items })),

      CreatePost: req =>
        Effect(new BlogPost({ ...req }))
          .tap(BlogPostRepository.save)
          .map(_ => _.id)
    })
)
