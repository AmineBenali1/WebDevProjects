<template>
  <div class="tag-view">
    <h1>Articles avec le tag : {{ tag }}</h1>
    <PostList :posts="filteredPosts" @delete-post="handleDeletePost" />
  </div>
</template>

<script>
import PostList from '../components/PostList.vue';
import { posts, deletePost } from '../store/posts';

export default {
  name: 'TagView',
  components: {
    PostList
  },
  data() {
    return {
      tag: this.$route.params.tag,
      posts: [...posts]
    }
  },
  computed: {
    filteredPosts() {
      return this.posts.filter(post => 
        post.tags.includes(this.tag)
      );
    }
  },
  methods: {
    handleDeletePost(postId) {
      deletePost(postId);
      this.posts = [...posts];
    }
  },
  watch: {
    '$route'(to) {
      this.tag = to.params.tag;
    }
  }
}
</script>

<style scoped>
.tag-view {
  padding: 20px;
}

h1 {
  margin-bottom: 20px;
  color: #2c3e50;
}
</style> 