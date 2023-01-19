import type { Operation, OperationId, OperationProgress } from "@effect-ts-app/boilerplate-client/Views"

export const OperationsId = Symbol("OperationsId")
export interface Operations extends ServiceTagged<typeof OperationsId> {
  register: Effect<Scope, never, OperationId>
  update: (id: OperationId, progress: OperationProgress) => Effect<never, never, void>
  find: (id: OperationId) => Effect<never, never, Opt<Operation>>
  cleanup: Effect<never, never, void>
}

/**
 * @tsplus type Operations.Ops
 */
export interface OperationsOps extends Tag<Operations> {}

export const Operations: OperationsOps = Tag<Operations>()

/**
 * @tsplus getter effect/io/Effect forkOperation
 */
export function forkOperation<R, E, A>(self: Effect<R, E, A>) {
  return Operations.accessWithEffect(
    Operations =>
      Scope.make()
        .flatMap(scope =>
          scope.extend(Operations.register).tap(() => scope.use(self).forkDaemonReportRequestUnexpected)
        )
  )
}

/**
 * @tsplus getter function forkOperation
 */
export function forkOperationFunction<R, E, A, Inp>(fnc: (inp: Inp) => Effect<R, E, A>) {
  return (inp: Inp) => fnc(inp).forkOperation
}

/**
 * @tsplus static effect/io/Effect.Ops forkOperation
 */
export function forkOperation2<R, E, A>(self: (opId: OperationId) => Effect<R, E, A>) {
  return Operations.accessWithEffect(
    Operations =>
      Scope.make()
        .flatMap(scope =>
          scope.extend(Operations.register)
            .tap(id => scope.use(self(id)).forkDaemonReportRequestUnexpected)
        )
  )
}

/**
 * @tsplus static effect/io/Effect.Ops forkOperationWithEffect
 */
export function forkOperationWithEffect<R, R2, E, E2, A, A2>(
  self: (id: OperationId) => Effect<R, E, A>,
  fnc: (id: OperationId) => Effect<R2, E2, A2>
) {
  return Operations.accessWithEffect(
    Operations =>
      Scope.make()
        .flatMap(scope =>
          scope.extend(Operations.register)
            .tap(opId => scope.use(self(opId)).forkDaemonReportRequestUnexpected)
            .tap(opId => scope.extend(fnc(opId).interruptible.forkScoped))
        )
  )
}
