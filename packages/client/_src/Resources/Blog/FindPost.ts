import { BlogPost, BlogPostId } from "@effect-ts-app/boilerplate-types/Blog"

@allowAnonymous
@allowRoles("user")
export class FindPostRequest extends Get("/blog/posts/:id")<FindPostRequest>()({
  id: prop(BlogPostId)
}) {}

export const FindPostResponse = nullable(BlogPost)
