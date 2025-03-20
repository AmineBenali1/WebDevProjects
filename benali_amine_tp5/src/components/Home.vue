<template>
  <div class="home">
    <h2>Emplois disponibles</h2>
    <div class="jobs-grid">
      <div v-for="job in filteredJobs" :key="job.id" class="job-card">
        <h3>{{ job.titre }}</h3>
        <router-link :to="{ name: 'JobDetails', params: { id: job.id }}" class="view-details">
          Voir les détails
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  props: {
    jobs: {
      type: Array,
      required: true
    },
    searchQuery: {
      type: String,
      required: true
    }
  },
  computed: {
    filteredJobs() {
      if (!this.searchQuery) {
        return this.jobs;
      }
      return this.jobs.filter(job => 
        job.titre.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }
}
</script>

<style scoped>
.home {
  padding: 20px;
}

.jobs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
}

.job-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.job-card:hover {
  transform: translateY(-5px);
}

.job-card h3 {
  margin: 0 0 10px 0;
  color: #2c3e50;
}

.description {
  color: #666;
  margin-bottom: 15px;
  line-height: 1.4;
}

.salary {
  font-weight: bold;
  color: #42b983;
  margin-bottom: 10px;
}

.date {
  color: #999;
  font-size: 0.9em;
  margin-bottom: 15px;
}

.view-details {
  display: inline-block;
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.view-details:hover {
  background-color: #3aa876;
}
</style>