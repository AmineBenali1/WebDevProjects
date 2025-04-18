<template>
    <div class="reset-password">
        <form @submit.prevent="handleResetPassword">
            <input type="email" required placeholder="Votre email" v-model="email">
            <button type="submit" :disabled="isLoading">
                {{ isLoading ? 'Envoi en cours...' : 'Réinitialiser le mot de passe' }}
            </button>
            <div class="error" v-if="error">{{ error }}</div>
            <div class="success" v-if="success">{{ success }}</div>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { projectAuth } from '../Firebase/Config'

const email = ref('')
const error = ref(null)
const success = ref(null)
const isLoading = ref(false)

const handleResetPassword = async () => {
    if (isLoading.value) return
    
    isLoading.value = true
    error.value = null
    success.value = null
    
    try {
        await projectAuth.sendPasswordResetEmail(email.value)
        success.value = 'Un email de réinitialisation a été envoyé à votre adresse email'
        email.value = ''
    } catch (err) {
        console.error('Reset password error:', err)
        switch (err.code) {
            case 'auth/user-not-found':
                error.value = 'Aucun compte associé à cet email'
                break
            case 'auth/invalid-email':
                error.value = 'Format d\'email invalide'
                break
            default:
                error.value = 'Une erreur est survenue. Veuillez réessayer'
        }
    } finally {
        isLoading.value = false
    }
}
</script>

<style scoped>
.reset-password {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
}

form {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

input {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

button {
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}

.error {
    color: red;
    margin-top: 10px;
    text-align: center;
}

.success {
    color: green;
    margin-top: 10px;
    text-align: center;
}
</style> 