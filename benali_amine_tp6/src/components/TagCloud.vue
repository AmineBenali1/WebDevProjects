<template>
  <div class="card">
    <h3>Mots-clés</h3>
    <div class="tags">
      <router-link 
        v-for="tag in uniqueTags" 
        :key="tag" 
        :to="{ name: 'tag', params: { tag }}"
        class="tag"
        :class="{ active: isActiveTag(tag) }"
      >
        {{ tag }}
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TagCloud',
  data() {
    return {
      posts: []
    }
  },
  computed: {
    uniqueTags() {
      const tags = new Set()
      this.posts.forEach(post => {
        post.tags.forEach(tag => tags.add(tag))
      })
      return Array.from(tags)
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
    },
    isActiveTag(tag) {
      return this.$route.params.tag === tag
    }
  }
}
</script>

<style scoped>
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  text-decoration: none;
  color: inherit;
}

.tag.active {
  background-color: #42b983;
  color: white;
}
</style> 