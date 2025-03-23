<template>
  <div class="card">
    <h2>{{ post.title }}</h2>
    <div class="tags">
      <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
    </div>
    <p class="snippet">{{ post.text.substring(0, 50) }}...</p>
    <div class="button-group">
      <router-link :to="{ name: 'post-detail', params: { id: post.id }}" class="btn btn-primary">
        Lire la suite
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SinglePost',
  props: {
    post: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.card {
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: white;
}

.tags {
  margin: 0.5rem 0;
}

.tag {
  background-color: #e9ecef;
  padding: 0.25rem 0.5rem;
  margin-right: 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.snippet {
  color: #666;
  margin: 1rem 0;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.btn-primary {
  color: #42b983;
  text-decoration: none;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background-color: #f8f9fa;
}

.btn-primary:hover {
  background-color: #e9ecef;
  text-decoration: none;
}
</style> 