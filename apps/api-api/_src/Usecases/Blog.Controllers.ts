import { BlogRsc } from "@effect-ts-app/boilerplate-client"
import { BlogPost } from "@effect-ts-app/boilerplate-types/Blog"

const items: BlogPost[] = []

export const BlogControllers = Effect(
  matchResource(BlogRsc)({
    GetPosts: () => Effect({ items }),

    CreatePost: req =>
      Effect(new BlogPost({ ...req }))
        .tap(post => Effect(items.push(post)))
        .map(_ => _.id)
  })
)
