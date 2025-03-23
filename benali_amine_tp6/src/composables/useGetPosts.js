import { ref } from 'vue'

export function useGetPosts() {
  const posts = ref([])

  const fetchPosts = () => {
    fetch('http://localhost:3000/posts')
      .then(response => response.json())
      .then(data => {
        posts.value = data
      })
  }

  return {
    posts,
    fetchPosts
  }
} 