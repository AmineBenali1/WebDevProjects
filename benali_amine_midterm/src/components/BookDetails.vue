<template>
  <div class="details">
    <div v-if="book" class="container">
      <div class="content">
        <img :src="require(`@/assets/${book.image}`)" :alt="book.title">
        <div class="info">
          <h1>{{ book.title }}</h1>
          <p class="author"><strong>Auteur:</strong> {{ book.author }}</p>
          <p><strong>Année:</strong> {{ book.year }}</p>
          <p><strong>Catégorie:</strong> {{ book.category }}</p>
          <p><strong>Statut:</strong> 
            <span :class="['status', book.status]">
              {{ book.status === 'available' ? 'Disponible' : 'Emprunté' }}
            </span>
          </p>
          <div class="summary">
            <h2>Résumé</h2>
            <p>{{ book.summary }}</p>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    <div v-else class="loading">
      Chargement...
    </div>
  </div>
</template>

<script>
export default {
  name: 'BookDetails',
  data() {
    return {
      book: null,
      error: null
    }
  },
  methods: {
    async fetchBookDetails() {
      const bookId = this.$route.params.id;
      
      if (!bookId) {
        this.error = 'ID du livre non spécifié';
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/books/${bookId}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Livre non trouvé');
          }
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        
        if (!data) {
          throw new Error('Données du livre non disponibles');
        }
        this.book = data;
        this.error = null;
      } catch (error) {
        this.error = error.message || 'Erreur lors du chargement du livre';
        this.book = null;
      }
    },
  },
  watch: {
    '$route.params.id': {
      handler: 'fetchBookDetails',
      immediate: true
    }
  },
  mounted() {
    this.fetchBookDetails();
  }
}
</script>

<style scoped>
.details {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.back {
  display: inline-block;
  margin-bottom: 20px;
  color: #42b983;
  text-decoration: none;
  font-weight: bold;
}

.content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 30px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.content img {
  width: 100%;
  max-height: 500px;
  object-fit: cover;
  border-radius: 8px;
}

.info {
  text-align: left;
}

.status.available {
  color: #1e7e34;
}

.status.borrowed {
  color: #d93025;
}

.summary {
  margin-top: 30px;
}

.loading, .error {
  text-align: center;
  padding: 40px;
  font-size: 1.2em;
  color: #666;
}

.error {
  color: #d93025;
}
</style> 