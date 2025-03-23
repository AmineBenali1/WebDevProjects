<template>
  <div class="home">
    <h1>Offres d'emploi disponibles</h1>
    <div class="jobs-list">
      <div v-for="job in jobs" :key="job.id" class="job-card">
        <h2>{{ job.titre }}</h2>
        <p>{{ job.description }}</p>
        <p><strong>Salaire:</strong> {{ job.salaire }}</p>
        <p><strong>Expérience:</strong> {{ job['années d\'expérience'] }} ans</p>
        <router-link :to="{ name: 'JobDetail', params: { id: job.id }}" class="btn-details">
          Voir les détails
        </router-link>
      </div>
    </div>
    <router-link to="/add-job" class="btn-add">
      Ajouter un nouvel emploi
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      jobs: []
    }
  },
  async created() {
    const response = await fetch('http://localhost:3000/jobs')
    this.jobs = await response.json()
  }
}
</script>

<style scoped>
.home {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.jobs-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.job-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.job-card h2 {
  margin: 0 0 10px 0;
  color: #2c3e50;
}

.btn-details, .btn-add {
  display: inline-block;
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  margin-top: 10px;
}

.btn-add {
  background-color: #2c3e50;
  margin-top: 20px;
}

.btn-details:hover, .btn-add:hover {
  opacity: 0.9;
}
</style> 