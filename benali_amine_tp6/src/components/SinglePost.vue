<template>
  <div class="post">
    <h3>{{ post.title }}</h3>
    <div class="tags">
      <span v-for="tag in post.tags" :key="tag">{{ tag }}</span>
    </div>
    <p>{{ post.text.substring(0,50) }}...</p>
    <div class="actions">
      <router-link :to="'/post/' + post.title.toLowerCase().replace(/\s+/g, '-')" class="btn">Voir plus</router-link>
      <button @click="$emit('edit-post', post)" class="btn edit">Modifier</button>
      <button @click="confirmDelete" class="btn delete">Supprimer</button>
    </div>
  </div>
</template>

<script>
export default {
    props:{
        post : Object
    },
    methods: {
        confirmDelete() {
            if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
                this.$emit('delete-post', this.post.id);
            }
        }
    }
}
</script>

<style scoped>
.post {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 15px;
}

h3 {
  margin: 0 0 10px 0;
}

.tags {
  margin-bottom: 10px;
}

.tags span {
  margin-right: 8px;
  color: #666;
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 4px;
}

p {
  margin: 0 0 10px 0;
}

.actions {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  font-size: 14px;
}

.btn:first-child {
  background-color: #0066cc;
  color: white;
}

.btn.edit {
  background-color: #4CAF50;
  color: white;
}

.btn.delete {
  background-color: #f44336;
  color: white;
}

.btn:hover {
  opacity: 0.9;
}
</style>