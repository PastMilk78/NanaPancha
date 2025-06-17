"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AlertTriangle } from "lucide-react"

interface RejectOrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onReject?: (reason: string) => void
}

export function RejectOrderDialog({ open, onOpenChange, onReject }: RejectOrderDialogProps) {
  const [reason, setReason] = useState("")

  const handleReject = () => {
    if (reason.trim()) {
      onReject?.(reason)
      onOpenChange(false)
      setReason("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <DialogTitle>Rechazo Manual</DialogTitle>
          </div>
          <DialogDescription>
            Esta orden ya pasó los filtros automáticos del bot. Especifica el motivo excepcional para rechazarla
            manualmente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="rejection-reason">Motivo del rechazo manual</Label>
            <Textarea
              id="rejection-reason"
              placeholder="Ej: Problema con el proveedor, emergencia en cocina, etc..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1 min-h-[100px]"
            />
            <p className="text-xs text-gray-500 mt-1">
              Este motivo se enviará al cliente y se registrará en el sistema.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleReject} disabled={!reason.trim()}>
            Rechazar Orden
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
