<template>
    <form @submit.prevent="handleSignUP">
      <input type="text" required placeholder="Display name" v-model="displayName">
      <input type="email" required placeholder="Your email" v-model="email">
      <input type="password" required placeholder="Your password" v-model="password">
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Signing up...' : 'Sign up' }}
      </button>
      <div class="error" v-if="error">{{ error }}</div>
    </form>
    
  </template>
  
  <script setup>
  import useSignup from '@/composables/useSignup';
  import { ref } from 'vue';
  
  const emit = defineEmits(['signup']);
  
  const displayName = ref('')
  const email = ref('')
  const password = ref('')
  const isLoading = ref(false)
  
  
  const {error, signup} = useSignup()
  
  const handleSignUP = async () => {
      if (isLoading.value) return
      
      isLoading.value = true
      try {
          console.log('Starting signup process...')
          await signup(email.value, password.value, displayName.value)
          if (!error.value) {
              console.log('Signup successful')
              emit('signup')
          } else {
              console.error('Signup failed:', error.value)
          }
      } catch (err) {
          console.error('Signup error:', err)
      } finally {
          isLoading.value = false
      }
  }
  
  
  </script>
  
  <style scoped>
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
  </style>