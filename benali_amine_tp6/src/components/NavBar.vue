<template>
  <nav class="navbar">
    <router-link to="/" class="nav-link">Accueil</router-link>
    <router-link to="/create" class="nav-link">Nouvel Article</router-link>
  </nav>
</template>

<script>
export default {
  name: 'NavBar'
}
</script>

<style scoped>
.navbar {
  padding: 1rem;
  background-color: #f8f9fa;
  margin-bottom: 2rem;
}

.nav-link {
  margin-right: 1rem;
  text-decoration: none;
  color: #2c3e50;
  font-weight: bold;
}

.nav-link:hover {
  color: #42b983;
}

.router-link-active {
  color: #42b983;
}
</style> 