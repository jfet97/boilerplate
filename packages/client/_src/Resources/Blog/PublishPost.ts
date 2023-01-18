import { BlogPostId } from "@effect-ts-app/boilerplate-types/Blog"
import { OperationId } from "../../Views.js"

@allowAnonymous
@allowRoles("user")
export class PublishPostRequest extends Post("/blog/posts/:id/publish")<PublishPostRequest>()({
  id: prop(BlogPostId)
}) {}

export const PublishPostResponse = OperationId
