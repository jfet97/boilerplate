<script setup lang="ts">
import { BlogRsc } from "@effect-ts-app/boilerplate-client"
import { BlogPostId } from "@effect-ts-app/boilerplate-types/Blog"

const { id } = useRouteParams({ id: BlogPostId })

const blogClient = clientFor(BlogRsc)
const [, latestPost, reloadPost] = useSafeQueryWithArg(blogClient.findPost, {
  id,
})

const progress = ref("")
const [publishing, publish] = useAndHandleMutation(
  refreshAndWaitForOperation(
    blogClient.publishPost,
    Effect.promise(() => reloadPost()),
    op => {
      progress.value = `${op.progress?.completed}/${op.progress?.total}`
    }
  ),
  "Publish Blog Post"
)
</script>

<template>
  <div v-if="latestPost">
    <v-btn @click="publish({ id })" :disabled="publishing.loading">
      Publish to all blog sites {{ publishing.loading && `(${progress})` }}
    </v-btn>
    <div>Title: {{ latestPost.title }}</div>
    <div>Body: {{ latestPost.body }}</div>
  </div>
</template>