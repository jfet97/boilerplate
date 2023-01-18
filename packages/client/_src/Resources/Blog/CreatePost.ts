import { BlogPost, BlogPostId } from "@effect-ts-app/boilerplate-types/Blog"

export class CreatePostRequest extends Post("/blog/posts")<CreatePostRequest>()(
  BlogPost.pick("title", "body")
) {}

export const CreatePostResponse = BlogPostId
