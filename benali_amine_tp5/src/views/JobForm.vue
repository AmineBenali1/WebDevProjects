<template>
  <div class="job-form">
    <h1>{{ isEditing ? 'Modifier l\'emploi' : 'Ajouter un nouvel emploi' }}</h1>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="titre">Titre</label>
        <input
          type="text"
          id="titre"
          v-model="form.titre"
          required
        >
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea
          id="description"
          v-model="form.description"
          required
          rows="4"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="salaire">Salaire</label>
        <input
          type="text"
          id="salaire"
          v-model="form.salaire"
          required
        >
      </div>

      <div class="form-group">
        <label for="dateCreation">Date de création</label>
        <input
          type="date"
          id="dateCreation"
          v-model="form['date de création']"
          required
        >
      </div>

      <div class="form-group">
        <label for="experience">Années d'expérience</label>
        <input
          type="number"
          id="experience"
          v-model="form['années d\'expérience']"
          required
          min="0"
        >
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-submit">
          {{ isEditing ? 'Mettre à jour' : 'Ajouter' }}
        </button>
        <router-link to="/" class="btn-cancel">
          Annuler
        </router-link>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'JobForm',
  data() {
    return {
      form: {
        titre: '',
        description: '',
        salaire: '',
        'date de création': '',
        'années d\'expérience': 0
      },
      isEditing: false
    }
  },
  async created() {
    if (this.$route.params.id) {
      this.isEditing = true
      const response = await fetch(`http://localhost:3000/jobs/${this.$route.params.id}`)
      this.form = await response.json()
    }
  },
  methods: {
    async handleSubmit() {
      const url = this.isEditing
        ? `http://localhost:3000/jobs/${this.$route.params.id}`
        : 'http://localhost:3000/jobs'
      
      const method = this.isEditing ? 'PATCH' : 'POST'
      
      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.form)
      })
      
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.job-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input, textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

textarea {
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn-submit, .btn-cancel {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  font-size: 16px;
}

.btn-submit {
  background-color: #42b983;
  color: white;
}

.btn-cancel {
  background-color: #6c757d;
  color: white;
}

.btn-submit:hover, .btn-cancel:hover {
  opacity: 0.9;
}
</style> 