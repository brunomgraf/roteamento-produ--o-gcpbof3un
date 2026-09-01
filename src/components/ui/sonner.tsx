/* Toaster Component - Custom Sonner configuration with desktop bottom-right / mobile top, duration 4s, dismissible, a11y role="status" */
import './sonner.css'
import { useTheme } from 'next-themes'
import { Toaster as Sonner } from 'sonner'
import { useIsMobile } from '@/hooks/use-mobile'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()
  const isMobile = useIsMobile()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      position={isMobile ? 'top-center' : 'bottom-right'}
      duration={4000}
      closeButton
      className="toaster group"
      toastOptions={{
        duration: 4000,
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl font-medium focus-visible:ring-2 focus-visible:ring-ring',
          description: 'group-[.toast]:text-muted-foreground font-normal text-xs',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground font-semibold min-h-[44px] focus-visible:ring-2 focus-visible:ring-ring',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground min-h-[44px] focus-visible:ring-2 focus-visible:ring-ring',
          closeButton:
            'group-[.toast]:bg-background group-[.toast]:text-foreground group-[.toast]:border-border hover:group-[.toast]:bg-muted focus-visible:ring-2 focus-visible:ring-ring',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
