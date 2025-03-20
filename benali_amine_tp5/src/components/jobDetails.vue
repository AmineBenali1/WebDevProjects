<template>
  <div class="job-details">
    <div v-if="job" class="details-card">
      <h2>{{ job.titre }}</h2>
      <div class="details-content">
        <p><strong>Description:</strong> {{ job.description }}</p>
        <p><strong>Salaire:</strong> {{ job.salaire }}</p>
        <p><strong>Date de création:</strong> {{ job["date de création"] }}</p>
        <p><strong>Années d'expérience:</strong> {{ job["années d'expérience"] }} ans</p>
      </div>
      <div class="actions">
        <router-link :to="{ name: 'EditJob', params: { id: job.id }}" class="btn-edit">
          Modifier
        </router-link>
        <button @click="confirmDelete" class="btn-delete">
          Supprimer
        </button>
      </div>
    </div>
    <div v-else class="not-found">
      <p>Emploi non trouvé</p>
      <router-link to="/" class="btn-back">Retour à la liste</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'JobDetails',
  props: {
    jobs: {
      type: Array,
      required: true
    }
  },
  computed: {
    job() {
      const id = parseInt(this.$route.params.id)
      return this.jobs.find(job => job.id === id)
    }
  },
  methods: {
    confirmDelete() {
      if (confirm('Êtes-vous sûr de vouloir supprimer cet emploi ?')) {
        this.$emit('delete-job', this.job.id)
        this.$router.push('/')
      }
    }
  }
}
</script>

<style scoped>
.job-details {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.details-card {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.details-content {
  margin: 20px 0;
}

.details-content p {
  margin: 10px 0;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn-edit, .btn-delete {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.btn-edit {
  background-color: #42b983;
  color: white;
  text-decoration: none;
  border: none;
}

.btn-delete {
  background-color: #dc3545;
  color: white;
  border: none;
}

.btn-edit:hover {
  background-color: #3aa876;
}

.btn-delete:hover {
  background-color: #c82333;
}

.not-found {
  text-align: center;
  padding: 40px;
}

.btn-back {
  display: inline-block;
  margin-top: 20px;
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}
</style>