<template>
  <div class="create-post">
    <h1>Ajouter un article</h1>
    <form @submit.prevent="submitPost">
      <div class="form-group">
        <label for="title">Titre</label>
        <input type="text" id="title" v-model="newPost.title" required>
      </div>
      <div class="form-group">
        <label for="tags">Tags (séparés par des virgules)</label>
        <input type="text" id="tags" v-model="tagsInput" required>
      </div>
      <div class="form-group">
        <label for="text">Contenu</label>
        <textarea id="text" v-model="newPost.text" required></textarea>
      </div>
      <div class="buttons">
        <button type="submit" class="btn-submit">Publier</button>
        <button type="button" class="btn-cancel" @click="$router.push('/')">Annuler</button>
      </div>
    </form>
  </div>
</template>

<script>
import { addPost } from '../store/posts';

export default {
  name: 'CreatePostView',
  data() {
    return {
      newPost: {
        title: '',
        tags: [],
        text: ''
      },
      tagsInput: ''
    }
  },
  methods: {
    submitPost() {
      this.newPost.tags = this.tagsInput.split(',').map(tag => tag.trim());
      addPost(this.newPost);
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
.create-post {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #2c3e50;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #2c3e50;
}

input, textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

textarea {
  height: 200px;
  resize: vertical;
}

.buttons {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.btn-submit {
  background-color: #42b983;
  color: white;
}

.btn-cancel {
  background-color: #dc3545;
  color: white;
}

button:hover {
  opacity: 0.9;
}
</style> 