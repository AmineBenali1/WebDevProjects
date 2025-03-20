<template>
  <div class="tag-cloud">
    <h3>Tags</h3>
    <div class="tags">
      <router-link v-for="tag in Tags" :to="'/tag/' + tag" class="tag">
        {{ tag }}
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TagCloud',
  props: {
    posts: {
      type: Array,
      required: true
    }
  },
  computed: {
    Tags() {
      const Tags = new Set()
      this.posts.forEach(post => {
        post.tags.forEach(tag => Tags.add(tag))
      })
      return Array.from(Tags)
    }
  }
}
</script>

<style scoped>
.tag-cloud {
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-left: 20px;
  flex: 0.2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.tag {
  background-color: #e9ecef;
  padding: 6px 12px;
  border-radius: 4px;
  color: #495057;
  text-decoration: none;
  font-size: 0.9em;
  transition: all 0.2s;
}

.tag:hover {
  background-color: #dee2e6;
  color: #212529;
  transform: translateY(-1px);
}

h3 {
  margin: 0 0 15px 0;
  color: #212529;
  font-size: 1.2em;
  border-bottom: 2px solid #dee2e6;
  padding-bottom: 8px;
}
</style>
