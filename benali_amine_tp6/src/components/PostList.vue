<template>
  <div class="posts-container">
    <div v-if="currentTag" class="tag-filter">
      <h3>Articles avec le mot-clé "{{ currentTag }}"</h3>
      <router-link to="/" class="clear-filter">Effacer le filtre</router-link>
    </div>
    <SinglePost v-for="post in filteredPosts" :key="post.id" :post="post" />
  </div>
</template>

<script>
import SinglePost from './SinglePost.vue'

export default {
  name: 'PostList',
  components: { SinglePost },
  data() {
    return {
      posts: []
    }
  },
  computed: {
    currentTag() {
      return this.$route.params.tag
    },
    filteredPosts() {
      if (!this.currentTag) return this.posts
      return this.posts.filter(post => post.tags.includes(this.currentTag))
    }
  },
  mounted() {
    this.fetchPosts()
  },
  methods: {
    fetchPosts() {
      fetch('http://localhost:3000/posts')
        .then(response => response.json())
        .then(data => {
          this.posts = data
        })
    }
  }
}
</script>

<style scoped>
.posts-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.tag-filter {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.clear-filter {
  color: #6c757d;
  text-decoration: none;
  font-size: 0.875rem;
}

.clear-filter:hover {
  color: #42b983;
  text-decoration: underline;
}
</style> 