<template>
    <PostList v-if="$route.path === '/'" :posts="posts" @delete-post="handleDeletePost" />
    <router-view v-else :posts="posts" @add-post="handleAddPost" />
</template>
  
<script>
  import PostList from '../components/PostList.vue';
  import { posts, addPost, deletePost } from '../store/posts';
  
  export default {
    name: 'Home',
    components: {
      PostList
    },
    data() {
      return {
        posts: [...posts]
      }
    },
    methods: {
      handleAddPost(newPost) {
        addPost(newPost);
        this.posts = [...posts];
      },
      handleDeletePost(postId) {
        deletePost(postId);
        this.posts = [...posts];
      }
    }
  }
</script>
