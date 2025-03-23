import { ref } from 'vue'

export function useGetPost() {
  const post = ref(null)
  const error = ref(null)

  const fetchPost = (id) => {
    fetch(`http://localhost:3000/posts/${id}`)
      .then(response => response.json())
      .then(data => {
        post.value = data
      })
  }

  return {
    post,
    error,
    fetchPost
  }
} 