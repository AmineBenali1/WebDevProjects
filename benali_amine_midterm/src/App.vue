<template>
  <nav>
    <router-link to="/" >Bibliothèque</router-link> 
  </nav>
  <router-view/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
  background-color: lightgray;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
}

</style>
