<template>
  <div class="post-detail">
    <div v-if="post" class="container">
      <div class="post-content">
        <h1>{{ post.title }}</h1>
        <div class="tags">
          <router-link v-for="tag in post.tags" :key="tag" :to="'/tag/' + encodeURIComponent(tag)" class="tag">
            {{ tag }}
          </router-link>
        </div>
        <p class="text">{{ post.text }}</p>
      </div>
      <TagCloud :posts="allPosts" />
    </div>
    <div v-else class="not-found">
      <h2>Article non trouvé</h2>
      <router-link to="/" class="back-link">Retour à l'accueil</router-link>
    </div>
  </div>
</template>

<script>
import TagCloud from '../components/TagCloud.vue';
import { posts } from '../store/posts';

export default {
  name: 'PostDetailView',
  components: {
    TagCloud
  },
  data() {
    return {
      allPosts: posts
    }
  },
  computed: {
    post() {
      const title = this.$route.params.title;
      return this.allPosts.find(post => 
        post.title.toLowerCase().replace(/\s+/g, '-') === title.toLowerCase()
      );
    }
  }
}
</script>

<style scoped>
.post-detail {
  padding: 20px;
}

.container {
  display: flex;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.post-content {
  flex: 0.8;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #2c3e50;
  margin-bottom: 20px;
}

.tags {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.tag {
  display: inline-block;
  padding: 5px 10px;
  background: #e9ecef;
  color: #495057;
  text-decoration: none;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.2s ease;
}

.tag:hover {
  background: #dee2e6;
  color: #212529;
}

.text {
  line-height: 1.6;
  color: #2c3e50;
}

.not-found {
  text-align: center;
  padding: 40px;
}

.back-link {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.back-link:hover {
  opacity: 0.9;
}
</style>