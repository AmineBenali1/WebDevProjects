import { ref } from 'vue'

export function useGetPosts() {
  const posts = ref([])
  const error = ref(null)

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:3000/posts')
      posts.value = await response.json()
    } catch (err) {
      error.value = err.message
    }
  }

  return {
    posts,
    error,
    fetchPosts
  }
} 