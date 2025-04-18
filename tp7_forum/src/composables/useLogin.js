import { projectAuth } from "../Firebase/Config"
import { ref } from "vue"

const error = ref(null)

const login = async (email, password) => {
    error.value = null
    try {
        console.log('Starting login process...')
        console.log('Email:', email)
        console.log('Auth instance:', projectAuth)
        
        if (!projectAuth) {
            throw new Error('Firebase Auth is not initialized')
        }

        const response = await projectAuth.signInWithEmailAndPassword(email, password)
        console.log('Login response:', response)
        error.value = null
        return response
    } catch (err) {
        console.error('Login error details:', {
            code: err.code,
            message: err.message,
            fullError: err
        })
        
        switch (err.code) {
            case 'auth/invalid-credential':
            case 'auth/wrong-password':
            case 'auth/user-not-found':
                error.value = 'Invalid email or password'
                break
            case 'auth/invalid-email':
                error.value = 'Invalid email format'
                break
            case 'auth/user-disabled':
                error.value = 'This account has been disabled'
                break
            case 'auth/too-many-requests':
                error.value = 'Too many failed login attempts. Please try again later'
                break
            default:
                error.value = 'An error occurred during login. Please try again'
        }
        throw err
    }
}

const useLogin = () => {
    return { error, login }
}

export default useLogin 