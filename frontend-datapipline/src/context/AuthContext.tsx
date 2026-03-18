import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import axios from "axios"

interface User {
  id: string
  name: string
  email: string
  avatarUrl?: string
  role?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

 useEffect(() => {
  const checkUser = async () => {
    const token = localStorage.getItem("token")
    
    if (!token) {
      setLoading(false) // Pas de token ? On arrête le chargement direct
      return
    }

    try {
      const res = await axios.get("http://localhost:3000/api/auth/me", { 
        headers: { Authorization: `Bearer ${token}` } 
      })
      setUser(res.data.user)
    } catch (error) {
      console.error("Token invalide ou erreur serveur")
      localStorage.removeItem("token")
      setUser(null)
    } finally {
      setLoading(false) // QUOI QU'IL ARRIVE, on finit le chargement ici
    }
  }

  checkUser()
}, [])

  const login = async (email: string, password: string) => {
    const response = await axios.post("http://localhost:3000/api/auth/login", { email, password })
    const { token, user: userData } = response.data
    localStorage.setItem("token", token)
    setUser(userData)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("token")
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}