<template>
  <div id="app">
    <nav class="navbar">
      <router-link to="/" class="nav-brand">Gestion des Emplois</router-link>
      <router-link to="/add-job" class="nav-link">Ajouter un emploi</router-link>
    </nav>
    <main class="main-content">
      <router-view/>
    </main>
  </div>
</template>

<style>
#app {
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.navbar {
  background-color: #2c3e50;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  color: white;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.main-content {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
