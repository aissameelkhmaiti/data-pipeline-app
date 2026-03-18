"use client"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { cn } from "../lib/utils"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "../components/ui/field"
import { Input } from "../components/ui/input"
import { motion } from "framer-motion"
import { useAuth } from "../context/AuthContext"
import { toast } from "sonner"
// Import des icônes
import { Mail, Eye, EyeOff } from "lucide-react"

export default function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false) // État pour l'œil
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 } 
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await login(email, password)
      navigate("/dashboard")
      toast.success("Connexion réussie")
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4", className)} {...props}>
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="w-full max-w-4xl">
        <Card className="overflow-hidden shadow-2xl rounded-2xl">
          <CardContent className="grid md:grid-cols-2 p-0"> {/* Ajout de p-0 pour l'overflow image */}

            <form onSubmit={handleSubmit} className="p-8 flex flex-col justify-center">
              <FieldGroup>
                <motion.div variants={itemVariants} className="flex flex-col items-center gap-2 text-center mb-6">
                  <h1 className="text-3xl font-bold tracking-tight">Data Pipeline Dashboard</h1>
                  <p className="text-muted-foreground text-sm">Login to your account</p>
                </motion.div>

                {error && <motion.p variants={itemVariants} className="text-red-500 text-center mb-4 text-sm">{error}</motion.p>}

                {/* Email avec Icône */}
                <motion.div variants={itemVariants}>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-10 focus-visible:ring-primary"
                      />
                    </div>
                  </Field>
                </motion.div>

                {/* Password avec Toggle Visibilité */}
                <motion.div variants={itemVariants} className="mt-4">
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <a href="#" className="ml-auto text-sm text-primary underline-offset-2 hover:underline">Forgot your password?</a>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"} // Type dynamique
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </Field>
                </motion.div>

                <motion.div variants={itemVariants} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button type="submit" className="w-full mt-6 font-semibold" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </motion.div>

              </FieldGroup>
            </form>

            {/* Image Section */}
            <div className="relative hidden md:block overflow-hidden">
              <motion.img
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                src="https://goodmove.ma/wp-content/uploads/2025/07/International-Union-of-Cinemas-Calls-for-Open-Standards-in-the-Cinema-Industry.jpg"
                alt="Cinema backdrop"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}