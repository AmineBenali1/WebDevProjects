<template>
    <div class="discussion-view">
        <nav class="discussion-nav">
            <div class="nav-left">
                <router-link to="/chatroom" class="back-button">
                    <span class="back-icon">←</span>
                    <span>Retour aux discussions</span>
                </router-link>
            </div>
            <div class="nav-right">
                <router-link to="/profile" class="profile-button">
                    <span class="profile-icon">👤</span>
                    <span class="profile-text">Mon Profil</span>
                </router-link>
            </div>
        </nav>
        
        <div class="discussion-content">
            <div v-if="isLoading" class="loading">
                Chargement de la discussion...
            </div>
            
            <div v-else-if="error" class="error">
                {{ error }}
            </div>
            
            <div v-else-if="discussion" class="discussion-container">
                <div class="discussion-header">
                    <h1>{{ discussion.titre }}</h1>
                    <span class="category-tag">{{ getCategoryName(discussion.categorie) }}</span>
                </div>
                
                <div class="discussion-meta">
                    <div class="author-info">
                        <span class="author">Par {{ getUserDisplayName(discussion.auteur) }}</span>
                        <span class="date">{{ formatDate(discussion.dateDeCreation) }}</span>
                    </div>
                    <div class="discussion-actions" v-if="isAuthor">
                        <button @click="editDiscussion" class="edit-button">
                            Modifier
                        </button>
                        <button @click="deleteDiscussion" class="delete-button">
                            Supprimer
                        </button>
                    </div>
                </div>
                
                <div class="discussion-body">
                    <p>{{ discussion.contenu }}</p>
                </div>
                
                <div class="replies-section">
                    <h2>Réponses ({{ replies.length }})</h2>
                    
                    <div class="reply-form">
                        <textarea 
                            v-model="newReply" 
                            placeholder="Écrivez votre réponse..."
                            rows="4"
                        ></textarea>
                        <button 
                            @click="submitReply" 
                            :disabled="isSubmitting || !newReply.trim()"
                            class="submit-reply-button"
                        >
                            {{ isSubmitting ? 'Envoi...' : 'Répondre' }}
                        </button>
                    </div>
                    
                    <div class="replies-list">
                        <div v-for="reply in replies" :key="reply.id" class="reply-card">
                            <div class="reply-header">
                                <div class="reply-author">
                                    <span class="author-name">{{ getUserDisplayName(reply.auteur) }}</span>
                                    <span class="reply-date">{{ formatDate(reply.dateCreation) }}</span>
                                </div>
                                <div v-if="isReplyAuthor(reply)" class="reply-actions">
                                    <button @click="editReply(reply)" class="edit-button">Modifier</button>
                                    <button @click="deleteReply(reply.id)" class="delete-button">Supprimer</button>
                                </div>
                            </div>
                            <div class="reply-content">
                                <p v-if="!reply.isEditing">{{ reply.contenu }}</p>
                                <div v-else class="edit-form">
                                    <textarea 
                                        v-model="reply.editContent" 
                                        rows="4"
                                    ></textarea>
                                    <div class="edit-actions">
                                        <button @click="cancelEdit(reply)" class="cancel-button">
                                            Annuler
                                        </button>
                                        <button @click="saveEdit(reply)" class="save-button">
                                            Enregistrer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Modal pour modifier la discussion -->
        <div v-if="showEditModal" class="modal-overlay">
            <div class="modal-content">
                <h2>Modifier la discussion</h2>
                <form @submit.prevent="saveDiscussionEdit">
                    <div class="form-group">
                        <label>Titre</label>
                        <input 
                            type="text" 
                            v-model="editForm.title" 
                            placeholder="Titre de la discussion"
                            required
                        >
                    </div>
                    
                    <div class="form-group">
                        <label>Catégorie</label>
                        <select v-model="editForm.categoryId" required>
                            <option v-for="category in categories" :key="category.id" :value="category.id">
                                {{ category.name }}
                            </option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Contenu</label>
                        <textarea 
                            v-model="editForm.content" 
                            placeholder="Contenu de la discussion"
                            rows="5"
                            required
                        ></textarea>
                    </div>
                    
                    <div class="modal-buttons">
                        <button type="button" @click="showEditModal = false" class="cancel-button">
                            Annuler
                        </button>
                        <button type="submit" :disabled="isSubmitting" class="submit-button">
                            {{ isSubmitting ? 'Enregistrement...' : 'Enregistrer' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { projectAuth, projectFirestore, FieldValue } from '../Firebase/Config'

const route = useRoute()
const router = useRouter()
const discussion = ref(null)
const replies = ref([])
const categories = ref([
    { id: 'general', name: 'Général' },
    { id: 'tech', name: 'Technologie' },
    { id: 'sports', name: 'Sports' },
    { id: 'entertainment', name: 'Divertissement' },
    { id: 'other', name: 'Autre' }
])
const isLoading = ref(true)
const error = ref(null)
const newReply = ref('')
const isSubmitting = ref(false)
const showEditModal = ref(false)
const editForm = ref({
    title: '',
    categoryId: '',
    content: ''
})

// Stocker les noms d'affichage des utilisateurs
const userDisplayNames = ref({})

// Vérifier si l'utilisateur est l'auteur de la discussion
const isAuthor = computed(() => {
    if (!discussion.value || !projectAuth.currentUser) return false
    return discussion.value.auteur === projectAuth.currentUser.uid
})

// Obtenir le nom d'affichage d'un utilisateur
const getUserDisplayName = (userId) => {
    if (!userId) return 'Utilisateur inconnu'
    return userDisplayNames.value[userId] || 'Chargement...'
}

// Charger la discussion et les réponses
const loadDiscussion = async () => {
    isLoading.value = true
    error.value = null
    
    try {
        const discussionId = route.params.id
        const discussionRef = projectFirestore.collection('discussions').doc(discussionId)
        const discussionDoc = await discussionRef.get()
        
        if (!discussionDoc.exists) {
            throw new Error('Discussion non trouvée')
        }
        
        const data = discussionDoc.data()
        discussion.value = {
            id: discussionDoc.id,
            titre: data.titre,
            contenu: data.contenu,
            categorie: data.categorie,
            auteur: data.auteur,
            dateDeCreation: data.dateDeCreation?.toDate() || new Date(),
            replyCount: data.replyCount || 0
        }
        
        // Charger les réponses
        const repliesRef = projectFirestore.collection('reponses')
        const q = repliesRef
            .where('discussion', '==', discussionId)
        const querySnapshot = await q.get()
        
        replies.value = []
        const userIds = new Set()
        
        // Ajouter l'ID de l'auteur de la discussion
        if (data.auteur) {
            userIds.add(data.auteur)
        }
        
        querySnapshot.forEach(doc => {
            const replyData = doc.data()
            replies.value.push({
                id: doc.id,
                contenu: replyData.contenu,
                auteur: replyData.auteur,
                dateCreation: replyData.dateCreation?.toDate() || new Date(),
                isEditing: false,
                editContent: ''
            })
            
            // Collecter les IDs des utilisateurs
            if (replyData.auteur) {
                userIds.add(replyData.auteur)
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
        console.error('Erreur lors du chargement de la discussion:', err)
        error.value = err.message || 'Impossible de charger la discussion. Veuillez réessayer.'
    } finally {
        isLoading.value = false
    }
}

// Soumettre une nouvelle réponse
const submitReply = async () => {
    if (isSubmitting.value || !newReply.value.trim()) return
    
    isSubmitting.value = true
    
    try {
        const user = projectAuth.currentUser
        if (!user) {
            throw new Error('Vous devez être connecté pour répondre')
        }
        
        const repliesRef = projectFirestore.collection('reponses')
        const docRef = await repliesRef.add({
            discussion: discussion.value.id,
            contenu: newReply.value.trim(),
            auteur: user.uid,
            dateCreation: FieldValue.serverTimestamp()
        })
        
        // Ajouter la nouvelle réponse à la liste
        replies.value.push({
            id: docRef.id,
            contenu: newReply.value.trim(),
            auteur: user.uid,
            dateCreation: new Date(),
            isEditing: false,
            editContent: ''
        })
        
        // Mettre à jour le nom d'affichage de l'utilisateur
        userDisplayNames.value[user.uid] = user.displayName || user.email || 'Utilisateur inconnu'
        
        // Mettre à jour le compteur de réponses
        const discussionRef = projectFirestore.collection('discussions').doc(discussion.value.id)
        await discussionRef.update({
            replyCount: replies.value.length
        })
        
        // Réinitialiser le formulaire
        newReply.value = ''
    } catch (err) {
        console.error('Erreur lors de l\'envoi de la réponse:', err)
        error.value = err.message || 'Impossible d\'envoyer la réponse. Veuillez réessayer.'
    } finally {
        isSubmitting.value = false
    }
}

// Vérifier si l'utilisateur est l'auteur d'une réponse
const isReplyAuthor = (reply) => {
    if (!projectAuth.currentUser) return false
    return reply.auteur === projectAuth.currentUser.uid
}

// Modifier une réponse
const editReply = (reply) => {
    reply.isEditing = true
    reply.editContent = reply.contenu
}

// Annuler la modification d'une réponse
const cancelEdit = (reply) => {
    reply.isEditing = false
    reply.editContent = ''
}

// Sauvegarder la modification d'une réponse
const saveEdit = async (reply) => {
    if (!reply.editContent.trim()) return
    
    try {
        const replyRef = projectFirestore.collection('reponses').doc(reply.id)
        await replyRef.update({
            contenu: reply.editContent.trim()
        })
        
        reply.contenu = reply.editContent.trim()
        reply.isEditing = false
        reply.editContent = ''
    } catch (err) {
        console.error('Erreur lors de la modification de la réponse:', err)
        error.value = 'Impossible de modifier la réponse. Veuillez réessayer.'
    }
}

// Supprimer une réponse
const deleteReply = async (replyId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette réponse ?')) return
    
    try {
        await projectFirestore.collection('reponses').doc(replyId).delete()
        
        // Mettre à jour la liste des réponses
        replies.value = replies.value.filter(reply => reply.id !== replyId)
        
        // Mettre à jour le compteur de réponses
        const discussionRef = projectFirestore.collection('discussions').doc(discussion.value.id)
        await discussionRef.update({
            replyCount: replies.value.length
        })
    } catch (err) {
        console.error('Erreur lors de la suppression de la réponse:', err)
        error.value = 'Impossible de supprimer la réponse. Veuillez réessayer.'
    }
}

// Modifier la discussion
const editDiscussion = () => {
    editForm.value = {
        title: discussion.value.titre,
        categoryId: discussion.value.categorie,
        content: discussion.value.contenu
    }
    showEditModal.value = true
}

// Sauvegarder les modifications de la discussion
const saveDiscussionEdit = async () => {
    if (isSubmitting.value) return
    
    isSubmitting.value = true
    
    try {
        const discussionRef = projectFirestore.collection('discussions').doc(discussion.value.id)
        await discussionRef.update({
            titre: editForm.value.title,
            contenu: editForm.value.content,
            categorie: editForm.value.categoryId
        })
        
        // Mettre à jour la discussion locale
        discussion.value.titre = editForm.value.title
        discussion.value.contenu = editForm.value.content
        discussion.value.categorie = editForm.value.categoryId
        
        showEditModal.value = false
    } catch (err) {
        console.error('Erreur lors de la modification de la discussion:', err)
        error.value = 'Impossible de modifier la discussion. Veuillez réessayer.'
    } finally {
        isSubmitting.value = false
    }
}

// Supprimer la discussion
const deleteDiscussion = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette discussion ? Toutes les réponses seront également supprimées.')) return
    
    try {
        // Supprimer toutes les réponses
        const repliesRef = projectFirestore.collection('reponses')
        const q = repliesRef.where('discussion', '==', discussion.value.id)
        const querySnapshot = await q.get()
        
        const deletePromises = querySnapshot.docs.map(doc => doc.ref.delete())
        await Promise.all(deletePromises)
        
        // Supprimer la discussion
        await projectFirestore.collection('discussions').doc(discussion.value.id).delete()
        
        // Rediriger vers la liste des discussions
        router.push('/chatroom')
    } catch (err) {
        console.error('Erreur lors de la suppression de la discussion:', err)
        error.value = 'Impossible de supprimer la discussion. Veuillez réessayer.'
    }
}

// Obtenir le nom de la catégorie
const getCategoryName = (categoryId) => {
    const category = categories.value.find(c => c.id === categoryId)
    return category ? category.name : 'Non catégorisé'
}

// Formater la date
const formatDate = (date) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

onMounted(async () => {
    // Vérifier si l'utilisateur est connecté et existe dans la collection users
    const user = projectAuth.currentUser
    if (user) {
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
    }
    
    loadDiscussion()
})
</script>

<style scoped>
.discussion-view {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #f5f1e8;
    font-family: Arial, sans-serif;
}

.discussion-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    background-color: #e8d9c5;
    border-bottom: 1px solid #d4c4b0;
}

.nav-left, .nav-right {
    display: flex;
    align-items: center;
}

.back-button {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #5d4037;
    text-decoration: none;
    font-weight: 500;
    font-size: 0.9rem;
}

.back-button:hover {
    transform: translateX(-3px);
}

.back-icon {
    font-size: 1.1rem;
}

.profile-button {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 15px;
    background-color: #8d6e63;
    color: white;
    border-radius: 15px;
    text-decoration: none;
    font-weight: 500;
    font-size: 0.9rem;
}

.profile-button:hover {
    background-color: #6d4c41;
}

.profile-icon {
    font-size: 1rem;
}

.discussion-content {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
}

.loading, .error {
    text-align: center;
    padding: 30px;
    color: #666;
    font-size: 1rem;
}

.error {
    color: #d32f2f;
}

.discussion-container {
    max-width: 800px;
    margin: 0 auto;
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.discussion-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 15px;
}

.discussion-header h1 {
    margin: 0;
    font-size: 1.6rem;
    color: #5d4037;
    font-weight: 600;
}

.category-tag {
    background-color: #f5f1e8;
    color: #8d6e63;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 0.8rem;
    border: 1px solid #e0e0e0;
}

.discussion-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e0e0e0;
}

.author-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.author {
    font-weight: 500;
    color: #5d4037;
    font-size: 0.9rem;
}

.date {
    color: #8d6e63;
    font-size: 0.85rem;
}

.discussion-actions {
    display: flex;
    gap: 10px;
}

.edit-button, .delete-button {
    padding: 6px 12px;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    font-size: 0.85rem;
}

.edit-button {
    background-color: #8d6e63;
    color: white;
}

.delete-button {
    background-color: #d32f2f;
    color: white;
}

.edit-button:hover, .delete-button:hover {
    opacity: 0.9;
}

.discussion-body {
    margin-bottom: 20px;
    line-height: 1.5;
    color: #5d4037;
    font-size: 0.95rem;
}

.replies-section {
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px solid #e0e0e0;
}

.replies-section h2 {
    margin-bottom: 15px;
    color: #5d4037;
    font-size: 1.3rem;
    font-weight: 600;
}

.reply-form {
    margin-bottom: 20px;
    background-color: #f5f1e8;
    padding: 15px;
    border-radius: 10px;
}

.reply-form textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    font-size: 0.9rem;
    margin-bottom: 10px;
    resize: vertical;
}

.submit-reply-button {
    background-color: #8d6e63;
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 12px;
    cursor: pointer;
    font-size: 0.9rem;
}

.submit-reply-button:hover {
    background-color: #6d4c41;
}

.submit-reply-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}

.replies-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.reply-card {
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    padding: 15px;
    background-color: white;
}

.reply-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e0e0e0;
}

.reply-author {
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.author-name {
    font-weight: 500;
    color: #5d4037;
    font-size: 0.9rem;
}

.reply-date {
    color: #8d6e63;
    font-size: 0.85rem;
}

.reply-actions {
    display: flex;
    gap: 8px;
}

.reply-content {
    color: #5d4037;
    line-height: 1.5;
    font-size: 0.95rem;
}

.edit-form {
    margin-top: 10px;
}

.edit-form textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    font-size: 0.9rem;
    margin-bottom: 10px;
    resize: vertical;
}

.edit-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.cancel-button, .save-button {
    padding: 6px 12px;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    font-size: 0.85rem;
}

.cancel-button {
    background-color: #f5f1e8;
    color: #5d4037;
}

.save-button {
    background-color: #8d6e63;
    color: white;
}

.save-button:hover {
    background-color: #6d4c41;
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
    margin-bottom: 15px;
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
    margin-top: 15px;
}

.submit-button {
    background-color: #8d6e63;
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 12px;
    cursor: pointer;
    font-size: 0.9rem;
}

.submit-button:hover {
    background-color: #6d4c41;
}

.submit-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}
</style> 