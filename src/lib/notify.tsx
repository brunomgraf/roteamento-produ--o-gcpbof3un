import React from 'react'
import { toast as sonnerToast } from 'sonner'
import { CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

export interface AppToastOptions {
  description?: React.ReactNode
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

/**
 * Toast helper configured for application requirements:
 * - Sonner for user feedback
 * - Success: green left border, CheckCircle icon
 * - Error: red left border, AlertCircle icon, Portuguese message
 * - Duration: 4000ms (4 seconds)
 * - Dismissible
 * - role="status"
 */
export const notify = {
  success: (title: string, options?: AppToastOptions) => {
    return sonnerToast.success(title, {
      description: options?.description,
      duration: options?.duration ?? 4000,
      dismissible: true,
      icon: (
        <CheckCircle
          className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0"
          aria-hidden="true"
        />
      ),
      className: 'border-l-4 border-l-emerald-500 bg-card text-foreground border-border shadow-md',
      action: options?.action,
    })
  },

  error: (title: string, options?: AppToastOptions) => {
    return sonnerToast.error(title, {
      description: options?.description,
      duration: options?.duration ?? 4000,
      dismissible: true,
      icon: (
        <AlertCircle
          className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0"
          aria-hidden="true"
        />
      ),
      className: 'border-l-4 border-l-red-500 bg-card text-foreground border-border shadow-md',
      action: options?.action,
    })
  },

  info: (title: string, options?: AppToastOptions) => {
    return sonnerToast.info(title, {
      description: options?.description,
      duration: options?.duration ?? 4000,
      dismissible: true,
      icon: (
        <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" aria-hidden="true" />
      ),
      className: 'border-l-4 border-l-blue-500 bg-card text-foreground border-border shadow-md',
      action: options?.action,
    })
  },

  warning: (title: string, options?: AppToastOptions) => {
    return sonnerToast.warning(title, {
      description: options?.description,
      duration: options?.duration ?? 4000,
      dismissible: true,
      icon: (
        <AlertTriangle
          className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0"
          aria-hidden="true"
        />
      ),
      className: 'border-l-4 border-l-amber-500 bg-card text-foreground border-border shadow-md',
      action: options?.action,
    })
  },

  dismiss: (toastId?: string | number) => {
    sonnerToast.dismiss(toastId)
  },
}

export default notify
