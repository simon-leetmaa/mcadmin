'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, Package, ExternalLink, User, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Mod {
  filename: string
  size: number
  modified: string
  sizeFormatted: string
  modId?: string
  displayName?: string
  version?: string
  authors?: string
  description?: string
  displayURL?: string
  license?: string
}

interface ModsData {
  count: number
  mods: Mod[]
}

export default function ModsPage() {
  const { data: session } = useSession()
  const [modsData, setModsData] = useState<ModsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMods = async () => {
    if (!session) return

    setLoading(true)
    try {
      const response = await fetch('/api/mods')
      if (response.ok) {
        const data = await response.json()
        setModsData(data)
        setError(null)
      } else {
        throw new Error('Failed to fetch mods')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMods()
  }, [session])

  if (!session) {
    return (
      <div className="container mx-auto p-8">
        <div className="max-w-4xl">
          <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">
            You need to be signed in to view this page.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-4">Server Mods</h1>
            <p className="text-muted-foreground">
              View all mods currently installed on your Minecraft server.
            </p>
          </div>
          <Button onClick={fetchMods} disabled={loading} variant="outline" size="sm">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {loading && !modsData ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <RefreshCw className="w-6 h-6 animate-spin mr-2" />
              Loading mods...
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-destructive mb-4">Error: {error}</p>
              <Button onClick={fetchMods} variant="outline">
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : modsData ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Installed Mods
                  <Badge variant="secondary" className="ml-2">
                    {modsData.count} mods
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Total of {modsData.count} mods installed on the server
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {modsData.mods.map((mod, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-base">
                              {mod.displayName || mod.filename}
                            </h3>
                            {mod.version && (
                              <Badge variant="secondary" className="text-xs">
                                v{mod.version}
                              </Badge>
                            )}
                            {mod.license && (
                              <Badge variant="outline" className="text-xs">
                                {mod.license}
                              </Badge>
                            )}
                          </div>
                          {mod.authors && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                              <User className="w-3 h-3" />
                              <span>by {mod.authors}</span>
                            </div>
                          )}
                          {mod.description && (
                            <p className="text-sm text-muted-foreground mb-2">
                              {mod.description}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant="outline">{mod.sizeFormatted}</Badge>
                          {mod.displayURL && (
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                              className="h-6 px-2"
                            >
                              <a
                                href={mod.displayURL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span className="text-xs">View</span>
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-2">
                        <div className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          <span>{mod.filename}</span>
                        </div>
                        <span>
                          Modified: {new Date(mod.modified).toLocaleDateString()} at{' '}
                          {new Date(mod.modified).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </div>
    </div>
  )
}