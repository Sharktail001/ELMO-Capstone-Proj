// src/app/explore/components/ErrorAlert.tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

interface ErrorAlertProps {
  message: string
}

export default function ErrorAlert({ message }: ErrorAlertProps) {
  return (
    <Alert variant="destructive" className="mb-8 max-w-4xl mx-auto">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}