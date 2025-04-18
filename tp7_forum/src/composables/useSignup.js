import { projectAuth, projectFirestore, FieldValue } from "../Firebase/Config"
import { ref } from "vue"

const error = ref(null)

const signup = async (email, password, displayName) => {
    error.value = null
    try {
        console.log('Creating user with email:', email)
        const response = await projectAuth.createUserWithEmailAndPassword(email, password)

        if (!response) {
            throw new Error('Could not signup')
        }
        
        console.log('User created:', response.user)
        
        // Update the display name
        await response.user.updateProfile({ displayName: displayName })
        console.log('Display name updated')
        
        // Créer l'entrée utilisateur dans Firestore
        const userRef = projectFirestore.collection('users').doc(response.user.uid)
        await userRef.set({
            displayName: displayName,
            email: email,
            createdAt: FieldValue.serverTimestamp()
        })
        console.log('User document created in Firestore')
        
        error.value = null
        return response
    } catch (err) {
        console.error('Signup error:', err.code, err.message)
        switch (err.code) {
            case 'auth/email-already-in-use':
                error.value = 'Email is already registered'
                break
            case 'auth/invalid-email':
                error.value = 'Invalid email format'
                break
            case 'auth/operation-not-allowed':
                error.value = 'Email/password accounts are not enabled'
                break
            case 'auth/weak-password':
                error.value = 'Password is too weak'
                break
            default:
                error.value = err.message
        }
        throw err
    }
}

const useSignup = () => {
    return { error, signup }
}

export default useSignup 