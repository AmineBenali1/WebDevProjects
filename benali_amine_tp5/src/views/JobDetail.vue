<template>
  <div class="job-detail">
    <div v-if="job" class="job-content">
      <h1>{{ job.titre }}</h1>
      <div class="job-info">
        <p><strong>Description:</strong> {{ job.description }}</p>
        <p><strong>Salaire:</strong> {{ job.salaire }}</p>
        <p><strong>Date de création:</strong> {{ job['date de création'] }}</p>
        <p><strong>Années d'expérience:</strong> {{ job['années d\'expérience'] }} ans</p>
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
  </div>
</template>

<script>
export default {
  name: 'JobDetail',
  data() {
    return {
      job: null
    }
  },
  async created() {
    const response = await fetch(`http://localhost:3000/jobs/${this.$route.params.id}`)
    this.job = await response.json()
  },
  methods: {
    async confirmDelete() {
      if (confirm('Êtes-vous sûr de vouloir supprimer cet emploi ?')) {
        await fetch(`http://localhost:3000/jobs/${this.job.id}`, {
          method: 'DELETE'
        })
        this.$router.push('/')
      }
    }
  }
}
</script>

<style scoped>
.job-detail {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.job-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.job-info {
  margin: 20px 0;
}

.job-info p {
  margin: 10px 0;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn-edit, .btn-delete {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
}

.btn-edit {
  background-color: #42b983;
  color: white;
}

.btn-delete {
  background-color: #dc3545;
  color: white;
}
</style> 