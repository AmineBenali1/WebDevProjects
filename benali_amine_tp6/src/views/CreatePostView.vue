<template>
  <div class="container">
    <h2>Créer un nouvel article</h2>
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
        <button type="submit" class="btn btn-primary">Créer l'article</button>
        <router-link to="/" class="btn btn-secondary">Annuler</router-link>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'CreatePostView',
  data() {
    return {
      title: '',
      text: '',
      tagsInput: ''
    }
  },
  methods: {
    handleSubmit() {
      const tags = this.tagsInput.split(',').map(tag => tag.trim())
      
      fetch('http://localhost:3000/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: this.title,
          text: this.text,
          tags
        })
      })
        .then(response => response.json())
        .then(() => this.$router.push('/'))
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