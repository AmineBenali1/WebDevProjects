<template>
    <div class="welcome container">
        <form @submit.prevent="handleLogin">
            <input type="email" required placeholder="Your email" v-model="email">
            <input type="password" required placeholder="Your password" v-model="password">
            <button type="submit" :disabled="isLoading">
                {{ isLoading ? 'Logging in...' : 'Login' }}
            </button>
            <div class="error" v-if="error">{{ error }}</div>
            <div class="forgot-password">
                <a href="#" @click.prevent="showResetPassword = true">Mot de passe oublié ?</a>
            </div>
        </form>

        <div v-if="showResetPassword" class="reset-password-modal">
            <div class="modal-content">
                <h3>Réinitialisation du mot de passe</h3>
                <ResetPasswordForm />
                <button class="close-button" @click="showResetPassword = false">Fermer</button>
            </div>
        </div>
    </div>
</template>
  
<script setup>
import useLogin from '@/composables/useLogin';
import { ref } from 'vue';
import ResetPasswordForm from './ResetPasswordForm.vue';
  
const email = ref('')
const password = ref('')
const isLoading = ref(false)
const showResetPassword = ref(false)
const { error, login } = useLogin()

const emit = defineEmits(['login']);

const handleLogin = async () => {
    if (isLoading.value) return
    
    isLoading.value = true
    try {
        console.log('Form submitted with email:', email.value)
        const response = await login(email.value, password.value)
        console.log('Login response in component:', response)
        
        if (!error.value) {
            console.log("User logged in successfully")
            emit('login')
        } else {
            console.error("Login failed with error:", error.value)
        }
    } catch (err) {
        console.error("Login error in component:", err)
    } finally {
        isLoading.value = false
    }
}
</script>
  
<style scoped>
.welcome {
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

.forgot-password {
    text-align: center;
    margin-top: 10px;
}

.forgot-password a {
    color: #4CAF50;
    text-decoration: none;
}

.forgot-password a:hover {
    text-decoration: underline;
}

.reset-password-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 400px;
    width: 90%;
}

.close-button {
    margin-top: 15px;
    background-color: #666;
}

.close-button:hover {
    background-color: #555;
}
</style>