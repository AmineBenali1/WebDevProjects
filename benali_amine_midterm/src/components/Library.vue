<template>
  <div class="library">
    <div class="filters">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Rechercher par titre ou auteur..."
      >
      <select v-model="statusFilter">
        <option value="all">Tous les statuts</option>
        <option value="available">Disponible</option>
        <option value="borrowed">Emprunté</option>
      </select>
    </div>

    <div class="books">
      <div v-for="book in filteredBooks" 
           :key="book.id" 
           class="book"
           @click="goToBookDetails(book.id)">
        <img :src="require(`@/assets/${book.image}`)" :alt="book.title">
        <div class="info">
          <h3>{{ book.title }}</h3>
          <p>{{ book.author }}</p>
          <p>Année: {{ book.year }}</p>
          <p>Catégorie: {{ book.category }}</p>
          <span :class="['status', book.status]">
            {{ book.status === 'available' ? 'Disponible' : 'Emprunté' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Library',
  data() {
    return {
      books: [],
      searchQuery: '',
      statusFilter: 'all'
    }
  },
  computed: {
    filteredBooks() {
      return this.books.filter(book => {
        const matchesSearch = 
          book.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(this.searchQuery.toLowerCase());
        
        const matchesStatus = 
          this.statusFilter === 'all' || 
          book.status === this.statusFilter;
        
        return matchesSearch && matchesStatus;
      });
    }
  },
  methods: {
    async fetchBooks() {
      try {
        const response = await fetch('http://localhost:3000/books');
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des livres');
        }
        this.books = await response.json();
      } catch (error) {
        console.error('Erreur lors du chargement des livres:', error);
      }
    },
    goToBookDetails(bookId) {
      this.$router.push(`/book/${bookId}`);
    },
  },
  mounted() {
    this.fetchBooks();
  }
}
</script>

<style scoped>
.library {
  padding: 20px;
}

.filters {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.filters input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
}

.filters select {
  padding: 8px;
  border: 1px solid #ddd;
}

.books {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.book {
  border: 1px solid #ddd;
  cursor: pointer;
}

.book img {
  width: 50%;
  height: 200px;
  padding-top: 5px;
  
}

.status.available {
  color: #1e7e34;
}
.status.borrowed {
  color: #d93025;
}
</style> 