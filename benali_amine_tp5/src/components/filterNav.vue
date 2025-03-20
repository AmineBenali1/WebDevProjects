<template>
  <div class="filter-container">
    <input 
      type="text" 
      :value="searchQuery"
      @input="$emit('update:searchQuery', $event.target.value)"
      placeholder="Rechercher un emploi..."
      class="search-input"
    >
  </div>
</template>

<script>
export default {
  name: 'filterNav',
  props: {
    searchQuery: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.filter-container {
  padding: 20px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.search-input {
  width: 100%;
  max-width: 500px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.search-input:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.2);
}
</style>