import { BlogPostRepository, Events, Operations } from "@/services.js"
import { BlogRsc } from "@effect-ts-app/boilerplate-client"
import { BogusEvent } from "@effect-ts-app/boilerplate-client/Events"
import { BlogPost } from "@effect-ts-app/boilerplate-types/Blog"
import { NotFoundError } from "@effect-ts-app/infra/errors"

export const BlogControllers = Effect.servicesWith(
  { BlogPostRepository, Operations, Events },
  ({ BlogPostRepository, Events, Operations }) =>
    matchResource(BlogRsc)({
      FindPost: req =>
        BlogPostRepository.find(req.id)
          .map(_ => _.getOrNull),

      GetPosts: () => BlogPostRepository.all.map(items => ({ items })),

      CreatePost: req =>
        Effect(new BlogPost({ ...req }))
          .tap(BlogPostRepository.save)
          .map(_ => _.id),

      PublishPost: req =>
        Do($ => {
          $(
            BlogPostRepository.find(req.id)
              .flatMap(_ => _.encaseInEffect(() => new NotFoundError("BlogPost", req.id)))
          )

          const targets = [
            "google",
            "twitter",
            "facebook"
          ]

          const done: string[] = []

          const operationId = $(
            targets
              .forEachEffect(_ =>
                Effect(done.push(_))
                  .delay(DUR.seconds(4))
              )
              .map(() => "the answer to the universe is 41")
              .forkOperation
          )

          $(
            Effect.suspendSucceed(() =>
              Operations.update(operationId, {
                total: PositiveInt(targets.length),
                completed: PositiveInt(done.length)
              })
                .zipRight(Events.publish(new BogusEvent({})))
            )
              .delay(DUR.seconds(1))
              .forever
              .fork
          )

          return operationId
        })
    })
)
