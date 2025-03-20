<template>
  <div class="container">
    <div class="posts">
      <SinglePost 
        v-for="post in posts" 
        :key="post.id" 
        :post="post"
        @edit-post="handleEditPost"
        @delete-post="$emit('delete-post', $event)"
      />
    </div>
    <TagCloud :posts="posts" />
  </div>
</template>

<script>
import SinglePost from './SinglePost.vue';
import TagCloud from './TagCloud.vue';

export default {
    components: {
      SinglePost,
      TagCloud
    },
    props: {
      posts: {
        type: Array,
        required: true
      }
    },
    methods: {
      handleEditPost(post) {
        this.$router.push(`/edit/${post.id}`);
      }
    }
}
</script>

<style scoped>
.container {
  display: flex;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.posts {
  flex: 0.8;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.posts > * {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>