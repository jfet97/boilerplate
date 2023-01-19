import { nullable } from "@effect-ts-app/boilerplate-prelude/schema"
import { Operation, OperationId } from "../../Views.js"

@allowRoles("user")
@allowAnonymous
export class FindOperationRequest extends Get("/operations/:id")<FindOperationRequest>()({
  id: prop(OperationId)
}) {}

export const FindOperationResponse = nullable(Operation)
