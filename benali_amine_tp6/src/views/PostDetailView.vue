<template>
  <div class="container">
    <div v-if="post" class="card">
      <h1>{{ post.title }}</h1>
      <div class="tags">
        <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
      <p class="text">{{ post.text }}</p>
      <div class="button-group">
        <router-link :to="{ name: 'edit-post', params: { id: post.id }}" class="btn btn-primary">
          Modifier l'article
        </router-link>
        <button @click="handleDelete" class="btn btn-danger">
          Supprimer l'article
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PostDetailView',
  data() {
    return {
      post: null
    }
  },
  mounted() {
    this.fetchPost()
  },
  methods: {
    fetchPost() {
      fetch(`http://localhost:3000/posts/${this.$route.params.id}`)
        .then(response => response.json())
        .then(data => {
          this.post = data
        })
    },
    handleDelete() {
      if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
        return
      }

      fetch(`http://localhost:3000/posts/${this.$route.params.id}`, {
        method: 'DELETE'
      })
        .then(() => this.$router.push('/'))
    }
  }
}
</script>

<style scoped>
.text {
  line-height: 1.6;
  margin: 1rem 0;
}

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