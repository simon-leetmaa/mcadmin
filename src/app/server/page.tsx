'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, Play, Square, RotateCcw, Terminal, Users } from 'lucide-react'

interface ServerStatus {
  status: 'online' | 'offline' | 'starting' | 'stopping'
  players?: {
    online: number
    max: number
    list: string[]
  }
  uptime?: string
  memory?: {
    used: string
    max: string
  }
  version?: string
}

interface ServerLog {
  timestamp: string
  level: string
  message: string
}

export default function ServerPage() {
  const { data: session } = useSession()
  const [status, setStatus] = useState<ServerStatus | null>(null)
  const [logs, setLogs] = useState<ServerLog[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const isAdmin = session?.user?.role === 'ADMIN'
  const canView = session?.user?.role === 'ADMIN' || session?.user?.role === 'MODERATOR'

  // Helper function to format uptime from start timestamp to readable duration
  const formatUptime = (startTime: string): string => {
    try {
      const start = new Date(startTime)
      const now = new Date()
      const diffMs = now.getTime() - start.getTime()

      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

      if (days > 0) {
        return `${days}d ${hours}h ${minutes}m`
      } else if (hours > 0) {
        return `${hours}h ${minutes}m`
      } else {
        return `${minutes}m`
      }
    } catch {
      return startTime // Fallback to original if parsing fails
    }
  }

  const fetchStatus = useCallback(async () => {
    if (!canView) return

    try {
      const response = await fetch('/api/server/status')
      if (response.ok) {
        const data = await response.json()
        setStatus(data)
        setError(null)
      } else if (response.status === 403) {
        setError('Unauthorized - Admin or Moderator access required')
      } else {
        setError('Failed to fetch server status')
      }
    } catch {
      setError('Connection error - Check if MC server API is running')
    } finally {
      setLoading(false)
    }
  }, [canView])

  const fetchLogs = useCallback(async () => {
    if (!canView) return

    try {
      const response = await fetch('/api/server/logs?lines=20')
      if (response.ok) {
        const data = await response.json()
        // Handle different possible response formats
        if (Array.isArray(data)) {
          setLogs(data)
        } else if (data.logs && Array.isArray(data.logs)) {
          setLogs(data.logs)
        } else {
          console.log('Unexpected logs format:', data)
          setLogs([])
        }
      }
    } catch {
      console.error('Failed to fetch logs')
      setLogs([])
    }
  }, [canView])

  const handleServerAction = async (action: 'start' | 'stop' | 'restart') => {
    if (!isAdmin) return

    setActionLoading(action)
    try {
      const response = await fetch('/api/server/control', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      })

      if (response.ok) {
        // Refresh status after action
        setTimeout(fetchStatus, 2000)
      } else {
        setError(`Failed to ${action} server`)
      }
    } catch {
      setError(`Error executing ${action}`)
    } finally {
      setActionLoading(null)
    }
  }

  useEffect(() => {
    fetchStatus()
    fetchLogs()

    // Refresh every 30 seconds
    const interval = setInterval(() => {
      fetchStatus()
      fetchLogs()
    }, 30000)

    return () => clearInterval(interval)
  }, [fetchStatus, fetchLogs])

  if (!session) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Server Management</h1>
          <p className="text-muted-foreground">Please sign in to access server management.</p>
        </div>
      </div>
    )
  }

  if (!canView) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">
            You need Admin or Moderator permissions to access server management.
          </p>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'offline': return 'bg-red-500'
      case 'starting': return 'bg-yellow-500'
      case 'stopping': return 'bg-orange-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Online'
      case 'offline': return 'Offline'
      case 'starting': return 'Starting...'
      case 'stopping': return 'Stopping...'
      default: return 'Unknown'
    }
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Server Management</h1>
          <p className="text-muted-foreground">Monitor and control your Minecraft server</p>
        </div>
        <Button onClick={fetchStatus} disabled={loading} size="sm" variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Server Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${status ? getStatusColor(status.status) : 'bg-gray-500'}`} />
              Server Status
            </CardTitle>
            <CardDescription>Current server information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : status ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Status:</span>
                  <Badge variant={status.status === 'online' ? 'default' : 'secondary'}>
                    {getStatusText(status.status)}
                  </Badge>
                </div>

                {status.players && (
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Players:</span>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{status.players.online}/{status.players.max}</span>
                    </div>
                  </div>
                )}

                {status.uptime && (
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Uptime:</span>
                    <span>{formatUptime(status.uptime)}</span>
                  </div>
                )}

                {status.memory && (
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Memory:</span>
                    <span>{status.memory.used} / {status.memory.max}</span>
                  </div>
                )}

                {status.version && (
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Version:</span>
                    <span>{status.version}</span>
                  </div>
                )}

                {isAdmin && (
                  <div className="pt-4 space-y-2">
                    <h4 className="font-medium">Server Controls</h4>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleServerAction('start')}
                        disabled={!!actionLoading || status.status === 'online'}
                        size="sm"
                        className="flex-1"
                      >
                        {actionLoading === 'start' ? (
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Play className="h-4 w-4 mr-2" />
                        )}
                        Start
                      </Button>
                      <Button
                        onClick={() => handleServerAction('stop')}
                        disabled={!!actionLoading || status.status === 'offline'}
                        size="sm"
                        variant="destructive"
                        className="flex-1"
                      >
                        {actionLoading === 'stop' ? (
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Square className="h-4 w-4 mr-2" />
                        )}
                        Stop
                      </Button>
                      <Button
                        onClick={() => handleServerAction('restart')}
                        disabled={!!actionLoading}
                        size="sm"
                        variant="outline"
                        className="flex-1"
                      >
                        {actionLoading === 'restart' ? (
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <RotateCcw className="h-4 w-4 mr-2" />
                        )}
                        Restart
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                Unable to connect to server
              </div>
            )}
          </CardContent>
        </Card>

        {/* Server Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              Server Logs
            </CardTitle>
            <CardDescription>Recent server activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-black text-green-400 p-4 rounded-md h-80 overflow-y-auto font-mono text-sm">
              {Array.isArray(logs) && logs.length > 0 ? (
                logs.map((log, index) => (
                  <div key={index} className="mb-1">
                    <span className="text-gray-500">[{log?.timestamp || 'N/A'}]</span>
                    <span className={`ml-2 ${
                      log?.level === 'ERROR' ? 'text-red-400' :
                      log?.level === 'WARN' ? 'text-yellow-400' :
                      'text-green-400'
                    }`}>
                      [{log?.level || 'INFO'}]
                    </span>
                    <span className="ml-2">{log?.message || 'No message'}</span>
                  </div>
                ))
              ) : (
                <div className="text-gray-500">
                  {logs === null ? 'Loading logs...' : 'No logs available'}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}