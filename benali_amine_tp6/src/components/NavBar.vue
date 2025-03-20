<template>
    <nav class="navbar">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/add" class="nav-link">Ajouter un article</router-link>
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
    display: flex;
    gap: 20px;
    background-color: #f0f0f0;
}

.nav-link {
    color: #333;
    text-decoration: none;
}

.nav-link:hover {
    color: #666;
}
</style>
