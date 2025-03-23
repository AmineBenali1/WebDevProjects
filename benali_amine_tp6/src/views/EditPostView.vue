<template>
  <div class="container">
    <h2>Modifier l'article</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="title">Titre :</label>
        <input 
          type="text" 
          id="title" 
          v-model="title" 
          required
        >
      </div>

      <div class="form-group">
        <label for="text">Contenu :</label>
        <textarea 
          id="text" 
          v-model="text" 
          required
          rows="10"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="tags">Mots-clés (séparés par des virgules) :</label>
        <input 
          type="text" 
          id="tags" 
          v-model="tagsInput" 
          placeholder="ex: JavaScript, Vue.js, Frontend"
          required
        >
      </div>

      <div class="button-group">
        <button type="submit" class="btn btn-primary">Mettre à jour</button>
        <router-link :to="{ name: 'post-detail', params: { id: route.params.id }}" class="btn btn-secondary">
          Annuler
        </router-link>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGetPost } from '../composables/getPost'

export default {
  name: 'EditPostView',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const { post, fetchPost } = useGetPost()
    const title = ref('')
    const text = ref('')
    const tagsInput = ref('')

    onMounted(() => {
      fetchPost(route.params.id)
    })

    // Remplir les champs quand le post est chargé
    watch(post, (newPost) => {
      if (newPost) {
        title.value = newPost.title
        text.value = newPost.text
        tagsInput.value = newPost.tags.join(', ')
      }
    })

    const handleSubmit = () => {
      const tags = tagsInput.value.split(',').map(tag => tag.trim())
      
      fetch(`http://localhost:3000/posts/${route.params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.value,
          text: text.value,
          tags
        })
      })
        .then(response => response.json())
        .then(() => router.push('/'))
    }

    return {
      route,
      title,
      text,
      tagsInput,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .button-group {
    flex-direction: column;
  }
}
</style> 