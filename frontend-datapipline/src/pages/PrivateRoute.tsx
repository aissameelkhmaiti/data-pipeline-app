import React from 'react'
import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Spinner } from "../components/ui/spinner"

export function PrivateRoute({ children }: { children: React.ReactElement }) {
  const { user, loading } = useAuth()
  
  // 1. On attend que l'API réponde (loading passe de true à false)
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    )
  }

  // 2. Une fois le chargement fini, si on n'a toujours pas d'user, on redirige
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // 3. Si loading est false et user existe, on affiche la page
  return children
}