<template>
    <div class="chatroom">
        <nav class="chatroom-nav">
            <div class="nav-left">
                <h1>Forum de Discussion</h1>
            </div>
            <div class="nav-right">
                <button @click="showNewDiscussionModal = true" class="new-discussion-button">
                    <span class="button-icon">+</span>
                    <span class="button-text">Nouvelle Discussion</span>
                </button>
                <router-link to="/profile" class="profile-button">
                    <span class="profile-icon">👤</span>
                    <span class="profile-text">Mon Profil</span>
                </router-link>
            </div>
        </nav>
        
        <div class="chatroom-content">
            <div class="search-filter-bar">
                <div class="search-box">
                    <input 
                        type="text" 
                        v-model="searchQuery" 
                        placeholder="Rechercher des discussions..." 
                        @input="filterDiscussions"
                    >
                </div>
                <div class="filter-options">
                    <select v-model="selectedCategory" @change="filterDiscussions">
                        <option value="">Toutes les catégories</option>
                        <option v-for="category in categories" :key="category.id" :value="category.id">
                            {{ category.name }}
                        </option>
                    </select>
                    <select v-model="sortBy" @change="filterDiscussions">
                        <option value="date">Plus récentes</option>
                        <option value="popularity">Plus populaires</option>
                    </select>
                </div>
            </div>
            
            <div v-if="isLoading" class="loading">
                Chargement des discussions...
            </div>
            
            <div v-else-if="error" class="error">
                {{ error }}
            </div>
            
            <div v-else-if="filteredDiscussions.length === 0" class="no-discussions">
                <p>Aucune discussion trouvée.</p>
                <button @click="showNewDiscussionModal = true" class="create-discussion-button">
                    Créer une nouvelle discussion
                </button>
            </div>
            
            <div v-else class="discussions-list">
                <div v-for="discussion in filteredDiscussions" :key="discussion.id" class="discussion-card">
                    <router-link :to="{ name: 'discussion', params: { id: discussion.id }}" class="discussion-link">
                        <div class="discussion-header">
                            <h3>{{ discussion.titre }}</h3>
                            <span class="category-tag">{{ getCategoryName(discussion.categorie) }}</span>
                        </div>
                        <div class="discussion-preview">
                            {{ truncateText(discussion.contenu, 150) }}
                        </div>
                        <div class="discussion-footer">
                            <div class="discussion-meta">
                                <span class="author">Par {{ getUserDisplayName(discussion.auteur) }}</span>
                                <span class="date">{{ formatDate(discussion.dateDeCreation) }}</span>
                                <span class="replies">{{ discussion.replyCount }} réponses</span>
                            </div>
                        </div>
                    </router-link>
                </div>
            </div>
        </div>
        
        <!-- Modal pour créer une nouvelle discussion -->
        <div v-if="showNewDiscussionModal" class="modal-overlay">
            <div class="modal-content">
                <h2>Nouvelle Discussion</h2>
                <form @submit.prevent="createDiscussion">
                    <div class="form-group">
                        <label>Titre</label>
                        <input 
                            type="text" 
                            v-model="newDiscussion.title" 
                            placeholder="Titre de la discussion"
                            required
                        >
                    </div>
                    
                    <div class="form-group">
                        <label>Catégorie</label>
                        <select v-model="newDiscussion.categoryId" required>
                            <option value="" disabled selected>Sélectionnez une catégorie</option>
                            <option v-for="category in categories" :key="category.id" :value="category.id">
                                {{ category.name }}
                            </option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Contenu</label>
                        <textarea 
                            v-model="newDiscussion.content" 
                            placeholder="Contenu de la discussion"
                            rows="5"
                            required
                        ></textarea>
                    </div>
                    
                    <div class="modal-buttons">
                        <button type="button" @click="showNewDiscussionModal = false" class="cancel-button">
                            Annuler
                        </button>
                        <button type="submit" :disabled="isSubmitting" class="submit-button">
                            {{ isSubmitting ? 'Création...' : 'Créer la discussion' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { projectAuth, projectFirestore, FieldValue } from '../Firebase/Config'
import { useRouter } from 'vue-router'

const router = useRouter()
const discussions = ref([])
const categories = ref([
    { id: 'general', name: 'Général' },
    { id: 'tech', name: 'Technologie' },
    { id: 'sports', name: 'Sports' },
    { id: 'entertainment', name: 'Divertissement' },
    { id: 'other', name: 'Autre' }
])
const isLoading = ref(true)
const error = ref(null)
const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('date')
const showNewDiscussionModal = ref(false)
const isSubmitting = ref(false)

const newDiscussion = ref({
    title: '',
    categoryId: '',
    content: ''
})

// Filtrer les discussions en fonction de la recherche et des filtres
const filteredDiscussions = computed(() => {
    let result = [...discussions.value]
    
    // Filtrer par recherche
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(discussion => 
            discussion.titre.toLowerCase().includes(query) || 
            discussion.contenu.toLowerCase().includes(query)
        )
    }
    
    // Filtrer par catégorie
    if (selectedCategory.value) {
        result = result.filter(discussion => discussion.categorie === selectedCategory.value)
    }
    
    // Trier les discussions
    if (sortBy.value === 'date') {
        result.sort((a, b) => b.dateDeCreation - a.dateDeCreation)
    } else if (sortBy.value === 'popularity') {
        result.sort((a, b) => b.replyCount - a.replyCount)
    }
    
    return result
})

// Charger les discussions depuis Firestore
const loadDiscussions = async () => {
    isLoading.value = true
    error.value = null
    
    try {
        const discussionsRef = projectFirestore.collection('discussions')
        const querySnapshot = await discussionsRef.get()
        
        discussions.value = []
        const userIds = new Set()
        
        querySnapshot.forEach(doc => {
            const data = doc.data()
            discussions.value.push({
                id: doc.id,
                titre: data.titre,
                contenu: data.contenu,
                categorie: data.categorie,
                auteur: data.auteur,
                dateDeCreation: data.dateDeCreation?.toDate() || new Date(),
                replyCount: data.replyCount || 0
            })
            
            // Collecter les IDs des utilisateurs
            if (data.auteur) {
                userIds.add(data.auteur)
            }
        })
        
        // Récupérer les informations des utilisateurs
        if (userIds.size > 0) {
            const usersRef = projectFirestore.collection('users')
            const userDocs = await Promise.all(
                Array.from(userIds).map(id => usersRef.doc(id).get())
            )
            
            userDocs.forEach(doc => {
                if (doc.exists) {
                    const userData = doc.data()
                    userDisplayNames.value[doc.id] = userData.displayName || userData.email || 'Utilisateur inconnu'
                } else {
                    userDisplayNames.value[doc.id] = 'Utilisateur inconnu'
                }
            })
        }
    } catch (err) {
        console.error('Erreur lors du chargement des discussions:', err)
        error.value = 'Impossible de charger les discussions. Veuillez réessayer.'
    } finally {
        isLoading.value = false
    }
}

// Stocker les noms d'affichage des utilisateurs
const userDisplayNames = ref({})

// Obtenir le nom d'affichage d'un utilisateur
const getUserDisplayName = (userId) => {
    if (!userId) return 'Utilisateur inconnu'
    return userDisplayNames.value[userId] || 'Chargement...'
}

// Créer une nouvelle discussion
const createDiscussion = async () => {
    if (isSubmitting.value) return
    
    isSubmitting.value = true
    
    try {
        const user = projectAuth.currentUser
        if (!user) {
            throw new Error('Vous devez être connecté pour créer une discussion')
        }
        
        // Vérifier si l'utilisateur existe dans la collection users
        const userRef = projectFirestore.collection('users').doc(user.uid)
        const userDoc = await userRef.get()
        
        if (!userDoc.exists) {
            // Créer l'utilisateur s'il n'existe pas
            await userRef.set({
                displayName: user.displayName || '',
                email: user.email || '',
                createdAt: FieldValue.serverTimestamp()
            })
        }
        
        const discussionsRef = projectFirestore.collection('discussions')
        const docRef = await discussionsRef.add({
            titre: newDiscussion.value.title,
            contenu: newDiscussion.value.content,
            categorie: newDiscussion.value.categoryId,
            auteur: user.uid,
            dateDeCreation: FieldValue.serverTimestamp(),
            replyCount: 0
        })
        
        // Ajouter la nouvelle discussion à la liste
        discussions.value.unshift({
            id: docRef.id,
            titre: newDiscussion.value.title,
            contenu: newDiscussion.value.content,
            categorie: newDiscussion.value.categoryId,
            auteur: user.uid,
            dateDeCreation: new Date(),
            replyCount: 0
        })
        
        // Mettre à jour le nom d'affichage de l'utilisateur
        userDisplayNames.value[user.uid] = user.displayName || user.email || 'Utilisateur inconnu'
        
        // Réinitialiser le formulaire et fermer la modale
        newDiscussion.value = {
            title: '',
            categoryId: '',
            content: ''
        }
        showNewDiscussionModal.value = false
    } catch (err) {
        console.error('Erreur lors de la création de la discussion:', err)
        error.value = err.message || 'Impossible de créer la discussion. Veuillez réessayer.'
    } finally {
        isSubmitting.value = false
    }
}

// Voir une discussion
const viewDiscussion = (discussionId) => {
    router.push(`/discussion/${discussionId}`)
}

// Obtenir le nom de la catégorie
const getCategoryName = (categoryId) => {
    const category = categories.value.find(c => c.id === categoryId)
    return category ? category.name : 'Non catégorisé'
}

// Tronquer le texte
const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
}

// Formater la date
const formatDate = (date) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
}

// Filtrer les discussions
const filterDiscussions = () => {
    // Le filtrage est géré par le computed property
}

onMounted(() => {
    // Vérifier si l'utilisateur est connecté
    const user = projectAuth.currentUser
    if (user) {
        console.log('Utilisateur connecté:', user.displayName || user.email)
    }
    
    // Charger les discussions
    loadDiscussions()
})
</script>

<style scoped>
.chatroom {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #f5f1e8;
    font-family: Arial, sans-serif;
}

.chatroom-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    background-color: #e8d9c5;
    border-bottom: 1px solid #d4c4b0;
}

.nav-left h1 {
    margin: 0;
    font-size: 1.4rem;
    color: #5d4037;
    font-weight: 600;
}

.nav-right {
    display: flex;
    align-items: center;
    gap: 10px;
}

.profile-button, .new-discussion-button {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 15px;
    border-radius: 15px;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s ease;
    border: none;
    cursor: pointer;
    font-size: 0.9rem;
}

.profile-button {
    background-color: #8d6e63;
    color: white;
}

.new-discussion-button {
    background-color: #6d4c41;
    color: white;
}

.profile-button:hover, .new-discussion-button:hover {
    transform: translateY(-1px);
}

.chatroom-content {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
}

.search-filter-bar {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    gap: 15px;
    background-color: white;
    padding: 15px;
    border-radius: 10px;
}

.search-box input {
    width: 100%;
    padding: 8px 15px;
    border: 1px solid #e0e0e0;
    border-radius: 15px;
    font-size: 0.9rem;
}

.filter-options select {
    padding: 8px 15px;
    border: 1px solid #e0e0e0;
    border-radius: 15px;
    font-size: 0.9rem;
    background-color: white;
    cursor: pointer;
}

.discussions-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 15px;
}

.discussion-card {
    background: white;
    border-radius: 10px;
    padding: 15px;
    margin-bottom: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    border: 1px solid #e0e0e0;
}

.discussion-card:hover {
    transform: translateY(-2px);
}

.discussion-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.discussion-header h3 {
    margin: 0;
    color: #5d4037;
    font-size: 1.1rem;
    font-weight: 600;
}

.category-tag {
    background: #f5f1e8;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 0.8rem;
    color: #8d6e63;
    border: 1px solid #e0e0e0;
}

.discussion-preview {
    color: #666;
    margin-bottom: 15px;
    line-height: 1.4;
    font-size: 0.9rem;
}

.discussion-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.85rem;
    color: #666;
    padding-top: 10px;
    border-top: 1px solid #e0e0e0;
}

.discussion-meta {
    display: flex;
    gap: 15px;
}

.author {
    font-weight: 500;
    color: #5d4037;
}

.date, .replies {
    color: #8d6e63;
}

.loading, .error, .no-discussions {
    text-align: center;
    padding: 30px;
    color: #666;
    font-size: 1rem;
}

.error {
    color: #d32f2f;
}

.create-discussion-button {
    background-color: #6d4c41;
    color: white;
    border: none;
    padding: 8px 20px;
    border-radius: 15px;
    cursor: pointer;
    margin-top: 15px;
    font-size: 0.9rem;
}

.create-discussion-button:hover {
    background-color: #5d4037;
}

.modal-overlay {
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
    border-radius: 10px;
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
}

.modal-content h2 {
    margin-top: 0;
    margin-bottom: 20px;
    color: #5d4037;
    font-size: 1.4rem;
    font-weight: 600;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
    color: #5d4037;
    font-size: 0.9rem;
}

.form-group input, .form-group select, .form-group textarea {
    width: 100%;
    padding: 8px 15px;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    font-size: 0.9rem;
}

.modal-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}

.cancel-button, .submit-button {
    padding: 8px 15px;
    border: none;
    border-radius: 15px;
    cursor: pointer;
    font-size: 0.9rem;
}

.cancel-button {
    background-color: #f5f1e8;
    color: #5d4037;
}

.submit-button {
    background-color: #8d6e63;
    color: white;
}

.submit-button:hover {
    background-color: #6d4c41;
}

.submit-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}

.discussion-link {
    text-decoration: none;
    color: inherit;
    display: block;
    transition: all 0.2s ease;
}

.discussion-link:hover {
    transform: translateY(-2px);
}
</style>


