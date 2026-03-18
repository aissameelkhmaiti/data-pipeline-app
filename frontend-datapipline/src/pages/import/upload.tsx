import React, { useState, useRef, useEffect } from "react"
import { 
  UploadCloud, 
  RefreshCcw, 
  FileSpreadsheet, 
  Globe,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Button } from "../../components/ui/button"
import { Progress } from "../../components/ui/progress"

import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

export default function PipelinePage() {
  const [isUploading, setIsUploading] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [messageAffeched, setMessageAffeched] = useState(false)
  const [logs, setLogs] = useState<any[]>([])

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Charger les 3 derniers fichiers pipeline
  const fetchLogs = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/pipeline/logs")
      const data = await response.json()
      // On prend les 3 premiers logs pour l'affichage réduit
      setLogs(data.data.slice(0, 3))
    } catch (error) {
      console.error("Erreur récupération logs", error)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setUploadProgress(0)
      setError(null)
    }
  }

  const handleFileUpload = async () => {
    if (!selectedFile) return
    setIsUploading(true)
    setUploadProgress(20)

    const formData = new FormData()
    formData.append("file", selectedFile)

    try {
      setUploadProgress(50)
      const response = await fetch("http://localhost:3000/api/movies/import", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setUploadProgress(100)
        setMessage(data.message)
        setError(null)
        setMessageAffeched(true)
        toast.success("Importation réussie")
        setSelectedFile(null)
        fetchLogs()
      } else {
        throw new Error(data.message || "Erreur lors de l'import")
      }
    } catch (err: any) {
      toast.error("Échec", { description: err.message })
      setError(err.message)
      setMessage(null)
      setMessageAffeched(true)
    } finally {
      setTimeout(() => {
        setIsUploading(false)
        setUploadProgress(0)
        setTimeout(() => setMessageAffeched(false), 5000)
      }, 800)
    }
  }

  const handleApiSync = async () => {
    setIsSyncing(true)
    try {
      const response = await fetch("http://localhost:3000/api/movies/sync-external", {
        method: "POST"
      })
      if (response.ok) {
        toast.success("Synchronisation API terminée")
        fetchLogs()
      } else {
        throw new Error("Erreur de synchronisation")
      }
    } catch (error) {
      toast.error("Erreur API externe")
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-6"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Data Pipeline</h1>
        <p className="text-muted-foreground">
          Centralisez l'importation de vos catalogues de films.
        </p>
      </div>

      <Tabs defaultValue="file" className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="file" className="gap-2">
            <FileSpreadsheet className="h-4 w-4"/> Fichiers
          </TabsTrigger>
          <TabsTrigger value="api" className="gap-2">
            <Globe className="h-4 w-4"/> API Externe
          </TabsTrigger>
        </TabsList>

        <TabsContent value="file">
          <Card>
            <CardHeader>
              <CardTitle>Importation CSV / JSON</CardTitle>
              <CardDescription>
                Envoyez vos fichiers pour alimenter la base PostgreSQL
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <AnimatePresence>
                {messageAffeched && (message || error) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`flex items-center justify-center p-4 rounded-lg mb-4 ${
                      error ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
                    }`}
                  >
                    {error ? <AlertCircle className="mr-2 h-5 w-5"/> : <CheckCircle2 className="mr-2 h-5 w-5"/>}
                    {error || message}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="border-2 border-dashed rounded-xl p-12 flex flex-col items-center">
                <UploadCloud className="h-12 w-12 mb-4 text-muted-foreground"/>
                <p className="text-lg font-medium">
                  {selectedFile ? selectedFile.name : "Sélectionnez un fichier"}
                </p>
                <p className="text-sm text-muted-foreground">Formats acceptés : .csv, .json</p>

                <input 
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".csv,.json"
                  onChange={handleFileSelect}
                />

                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {selectedFile ? "Changer de fichier" : "Parcourir"}
                </Button>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Traitement...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress}/>
                </div>
              )}

              <div className="flex justify-end gap-3">
                <Button
                  onClick={handleFileUpload}
                  disabled={!selectedFile || isUploading}
                >
                  {isUploading && <Loader2 className="animate-spin h-4 w-4 mr-2"/>}
                  {isUploading ? "Importation..." : "Démarrer l'import"}
                </Button>
              </div>

              {/* LISTE DES 3 DERNIERS FICHIERS AVEC ICONE DYNAMIQUE */}
              {logs.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm font-semibold mb-3">Derniers fichiers importés</p>
                  <div className="space-y-3">
                    {logs.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-center justify-between border rounded-lg p-3 bg-muted/30"
                      >
                        <div className="flex items-center gap-3">
                          <FileSpreadsheet className="h-4 w-4 text-blue-500"/>
                          <div>
                            <p className="text-sm font-medium">{log.source_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {log.status === "success" 
                                ? `${log.rows_processed} lignes` 
                                : "Échec de l'import"}
                            </p>
                          </div>
                        </div>

                        {/* Condition de l'icône de statut */}
                        {log.status === "success" ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>Synchronisation TMDB</CardTitle>
              <CardDescription>
                Récupération des métadonnées depuis l'API
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col items-center py-10 gap-4">
              <Globe className="h-12 w-12 text-blue-500"/>
              <Button onClick={handleApiSync} disabled={isSyncing}>
                {isSyncing ? (
                  <Loader2 className="animate-spin mr-2 h-4 w-4"/>
                ) : (
                  <RefreshCcw className="mr-2 h-4 w-4"/>
                )}
                Synchroniser maintenant
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}