<template>
  <div class="job-form">
    <h2>Modifier l'emploi</h2>
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
          v-model="form.dateCreation" 
          required
        >
      </div>

      <div class="form-group">
        <label for="experience">Années d'expérience</label>
        <input 
          type="number" 
          id="experience" 
          v-model="form.experience" 
          min="0"
        >
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-submit">
          Modifier
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
  name: 'EditJob',
  props: {
    jobs: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      form: {
        titre: '',
        description: '',
        salaire: '',
        dateCreation: '',
        experience: ''
      }
    }
  },
  created() {
    const id = parseInt(this.$route.params.id)
    const job = this.jobs.find(job => job.id === id)
    if (job) {
      this.form = {
        titre: job.titre,
        description: job.description,
        salaire: job.salaire,
        dateCreation: job["date de création"],
        experience: job["années d'expérience"] || ''
      }
    }
  },
  methods: {
    handleSubmit() {
      const id = parseInt(this.$route.params.id)
      const updatedJob = {
        id: id,
        titre: this.form.titre,
        description: this.form.description,
        salaire: this.form.salaire,
        "date de création": this.form.dateCreation,
        "années d'expérience": this.form.experience
      }
      this.$emit('update-job', updatedJob)
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
  height: 100px;
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn-submit, .btn-cancel {
  padding: 10px 20px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}

.btn-submit {
  background-color: #42b983;
  color: white;
  border: none;
}

.btn-cancel {
  background-color: #6c757d;
  color: white;
  text-decoration: none;
}

.btn-submit:hover {
  background-color: #3aa876;
}

.btn-cancel:hover {
  background-color: #5a6268;
}
</style>
