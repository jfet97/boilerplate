<script setup lang="ts">
import { BlogRsc } from "@effect-ts-app/boilerplate-client"
import { BlogPostId } from "@effect-ts-app/boilerplate-types/Blog"

const { id } = useRouteParams({ id: BlogPostId })

const blogClient = clientFor(BlogRsc)
const [, latestPost] = useSafeQueryWithArg(blogClient.findPost, { id })
</script>

<template>
  <div v-if="latestPost">
    <div>Title: {{ latestPost.title }}</div>
    <div>Body: {{ latestPost.body }}</div>
  </div>
</template>