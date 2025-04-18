<template>
  <div class="welcome container">
    <div v-if="showLogin">
      <h2>Login</h2>
      <LoginForm @login="enterChat" />
      <p>No account yet? <span @click="showLogin = false">Signup</span> instead.</p>
    </div>
    <div v-else>
      <h2>Sign up</h2>
      <SignupForm @signup="enterChat" />
      <p>Already registered? <span @click="showLogin = true">Login</span> instead.</p>
    </div>
  </div>
</template>

<script>
import SignupForm from '../components/SignupForm.vue'
import LoginForm from '../components/LoginForm.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { projectAuth, projectFirestore, FieldValue } from '../Firebase/Config'

export default {
  components: { SignupForm, LoginForm },
  setup() {
    const showLogin = ref(true)
    const router = useRouter()

    const enterChat = async () => {
      try {
        // Attendre que l'état d'authentification soit prêt
        await new Promise((resolve) => {
          const unsubscribe = projectAuth.onAuthStateChanged(async (user) => {
            unsubscribe()
            
            if (user) {
              // Créer ou mettre à jour l'entrée utilisateur dans Firestore
              const userRef = projectFirestore.collection('users').doc(user.uid)
              const userDoc = await userRef.get()
              
              if (!userDoc.exists) {
                // Créer l'utilisateur s'il n'existe pas
                await userRef.set({
                  displayName: user.displayName || '',
                  email: user.email || '',
                  createdAt: FieldValue.serverTimestamp()
                })
                console.log('Utilisateur créé dans Firestore:', user.uid)
              } else {
                // Mettre à jour les informations de l'utilisateur
                await userRef.update({
                  displayName: user.displayName || userDoc.data().displayName || '',
                  email: user.email || userDoc.data().email || '',
                  lastLogin: FieldValue.serverTimestamp()
                })
                console.log('Utilisateur mis à jour dans Firestore:', user.uid)
              }
            }
            
            resolve(user)
          })
        })
        
        // Naviguer vers le chatroom
        await router.push({ name: 'Chatroom' })
      } catch (error) {
        console.error('Erreur de navigation:', error)
      }
    }

    return { showLogin, enterChat }
  }
}
</script>

<style>
  .welcome {
    text-align: center;
    padding: 20px 0;
  }
  /* form styles */
  .welcome form {
    width: 300px;
    margin: 20px auto;
  }
  .welcome label {
    display: block;
    margin: 20px 0 10px;
  }
  .welcome input {
    width: 100%;
    padding: 10px;
    border-radius: 20px;
    border: 1px solid #eee;
    outline: none;
    color: #999;
    margin: 10px auto;
  }
  .welcome span{
    font-weight: bold;
    text-decoration: underline;
    cursor: pointer;
  }
  .welcome button {
    margin: 20px auto;
  }
</style>