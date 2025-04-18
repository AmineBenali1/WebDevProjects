<template>
    <div class="user-profile">
        <h2>Profil Utilisateur</h2>
        
        <div v-if="isLoading" class="loading">
            Chargement...
        </div>
        
        <div v-else-if="error" class="error">
            {{ error }}
        </div>
        
        <form v-else @submit.prevent="handleUpdateProfile" class="profile-form">
            <div class="form-group">
                <label>Nom d'affichage</label>
                <input 
                    type="text" 
                    v-model="displayName" 
                    placeholder="Votre nom d'affichage"
                    required
                >
            </div>
            
            <div class="form-group">
                <label>Email</label>
                <input 
                    type="email" 
                    v-model="email" 
                    placeholder="Votre email"
                    required
                    disabled
                >
                <small>L'email ne peut pas être modifié</small>
            </div>
            
            <div class="form-group">
                <label>Nouveau mot de passe (optionnel)</label>
                <input 
                    type="password" 
                    v-model="newPassword" 
                    placeholder="Laissez vide pour ne pas changer"
                >
            </div>
            
            <div class="form-group">
                <label>Confirmer le mot de passe</label>
                <input 
                    type="password" 
                    v-model="confirmPassword" 
                    placeholder="Confirmez le nouveau mot de passe"
                >
            </div>
            
            <div class="buttons">
                <button type="submit" :disabled="isUpdating">
                    {{ isUpdating ? 'Mise à jour...' : 'Mettre à jour le profil' }}
                </button>
                <button type="button" @click="handleLogout" class="logout-button">
                    Se déconnecter
                </button>
            </div>
            
            <div v-if="updateError" class="error">
                {{ updateError }}
            </div>
            
            <div v-if="updateSuccess" class="success">
                {{ updateSuccess }}
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { projectAuth, projectFirestore, FieldValue } from '../Firebase/Config'
import { useRouter } from 'vue-router'

const router = useRouter()
const displayName = ref('')
const email = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const error = ref(null)
const updateError = ref(null)
const updateSuccess = ref(null)
const isLoading = ref(true)
const isUpdating = ref(false)

// Charger les informations de l'utilisateur
const loadUserProfile = async () => {
    try {
        const user = projectAuth.currentUser
        if (user) {
            displayName.value = user.displayName || ''
            email.value = user.email || ''
        } else {
            error.value = 'Aucun utilisateur connecté'
        }
    } catch (err) {
        console.error('Erreur lors du chargement du profil:', err)
        error.value = 'Erreur lors du chargement du profil'
    } finally {
        isLoading.value = false
    }
}

// Mettre à jour le profil
const handleUpdateProfile = async () => {
    if (isUpdating.value) return
    
    updateError.value = null
    updateSuccess.value = null
    
    // Vérifier si les mots de passe correspondent
    if (newPassword.value && newPassword.value !== confirmPassword.value) {
        updateError.value = 'Les mots de passe ne correspondent pas'
        return
    }
    
    isUpdating.value = true
    
    try {
        const user = projectAuth.currentUser
        if (!user) {
            throw new Error('Aucun utilisateur connecté')
        }
        
        // Mettre à jour le nom d'affichage
        await user.updateProfile({
            displayName: displayName.value
        })
        
        // Mettre à jour l'entrée utilisateur dans Firestore
        const userRef = projectFirestore.collection('users').doc(user.uid)
        await userRef.update({
            displayName: displayName.value,
            updatedAt: FieldValue.serverTimestamp()
        })
        
        // Mettre à jour le mot de passe si fourni
        if (newPassword.value) {
            await user.updatePassword(newPassword.value)
        }
        
        updateSuccess.value = 'Profil mis à jour avec succès'
        newPassword.value = ''
        confirmPassword.value = ''
    } catch (err) {
        console.error('Erreur lors de la mise à jour du profil:', err)
        switch (err.code) {
            case 'auth/requires-recent-login':
                updateError.value = 'Veuillez vous reconnecter pour effectuer cette action'
                break
            case 'auth/weak-password':
                updateError.value = 'Le mot de passe est trop faible'
                break
            default:
                updateError.value = 'Erreur lors de la mise à jour du profil'
        }
    } finally {
        isUpdating.value = false
    }
}

// Déconnexion
const handleLogout = async () => {
    try {
        await projectAuth.signOut()
        router.push('/')
    } catch (err) {
        console.error('Erreur lors de la déconnexion:', err)
        updateError.value = 'Erreur lors de la déconnexion'
    }
}

// Charger le profil au montage du composant
onMounted(() => {
    loadUserProfile()
})
</script>

<style scoped>
.user-profile {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
}

.profile-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

label {
    font-weight: bold;
    color: #333;
}

input {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
}

input:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
}

small {
    color: #666;
    font-size: 12px;
}

.buttons {
    display: flex;
    gap: 10px;
    margin-top: 10px;
}

button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    flex: 1;
}

button[type="submit"] {
    background-color: #4CAF50;
    color: white;
}

.logout-button {
    background-color: #f44336;
    color: white;
}

button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}

.error {
    color: #f44336;
    margin-top: 10px;
    text-align: center;
}

.success {
    color: #4CAF50;
    margin-top: 10px;
    text-align: center;
}

.loading {
    text-align: center;
    color: #666;
    margin: 20px 0;
}
</style> 