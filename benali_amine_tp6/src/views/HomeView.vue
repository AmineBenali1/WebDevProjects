<template>
  <div class="home">
    <div class="content">
      <div class="main-content">
        <PostList />
      </div>
      <div class="sidebar">
        <TagCloud />
      </div>
    </div>
  </div>
</template>

<script>
import PostList from '../components/PostList.vue'
import TagCloud from '../components/TagCloud.vue'

export default {
  name: 'HomeView',
  components: {
    PostList,
    TagCloud
  }
}
</script>

<style scoped>
.home {
  padding: 1rem;
}

.content {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  gap: 2rem;
}

.main-content {
  flex: 1;
  min-width: 0;
}

.sidebar {
  width: 300px;
  flex-shrink: 0;
}
</style>
