import React from 'react'
import { WifiOff, RefreshCw } from 'lucide-react'
import { useOnlineStatus } from '@/hooks/use-online-status'
import { Button } from '@/components/ui/button'

export function OfflineBanner() {
  const isOnline = useOnlineStatus()

  if (isOnline) {
    return null
  }

  return (
    <div
      role="status"
      aria-live="assertive"
      className="bg-destructive text-destructive-foreground px-4 py-2.5 text-sm font-medium shadow-md transition-all duration-300 z-50 flex items-center justify-between gap-3 border-b border-destructive-foreground/20"
    >
      <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
        <div className="flex items-center gap-2.5">
          <WifiOff className="w-4 h-4 shrink-0 animate-pulse" aria-hidden="true" />
          <span>Voce esta offline. Verifique sua conexao.</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.reload()}
          className="h-8 min-h-[32px] px-3 bg-white/10 hover:bg-white/20 text-white border-white/30 text-xs gap-1.5 focus-visible:ring-2 focus-visible:ring-white shrink-0"
          aria-label="Tentar reconectar"
        >
          <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Reconectar</span>
        </Button>
      </div>
    </div>
  )
}
