import { computed } from 'vue'
import { useGetPosts } from './getPosts'

export function useFilteredPosts() {
  const { posts, error, fetchPosts } = useGetPosts()

  const filteredPosts = computed(() => {
    return posts.value
  })

  const filterByTag = (tag) => {
    if (!tag) return posts.value
    return posts.value.filter(post => post.tags.includes(tag))
  }

  return {
    posts: filteredPosts,
    error,
    fetchPosts,
    filterByTag
  }
} 