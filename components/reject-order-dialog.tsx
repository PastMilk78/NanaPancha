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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface RejectOrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onReject?: (reason: string) => void
}

const commonReasons = [
  "Producto no disponible",
  "Ingredientes agotados",
  "Fuera del horario de servicio",
  "Zona de entrega no disponible",
  "Problema con el pago",
  "Otro motivo",
]

export function RejectOrderDialog({ open, onOpenChange, onReject }: RejectOrderDialogProps) {
  const [selectedReason, setSelectedReason] = useState("")
  const [customReason, setCustomReason] = useState("")

  const handleReject = () => {
    const reason = selectedReason === "Otro motivo" ? customReason : selectedReason
    if (reason.trim()) {
      onReject?.(reason)
      onOpenChange(false)
      setSelectedReason("")
      setCustomReason("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rechazar Orden</DialogTitle>
          <DialogDescription>
            Selecciona el motivo por el cual rechazas esta orden. El cliente recibirá una notificación automática.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Motivo del rechazo</Label>
            <RadioGroup value={selectedReason} onValueChange={setSelectedReason} className="mt-2">
              {commonReasons.map((reason) => (
                <div key={reason} className="flex items-center space-x-2">
                  <RadioGroupItem value={reason} id={reason} />
                  <Label htmlFor={reason} className="text-sm cursor-pointer">
                    {reason}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {selectedReason === "Otro motivo" && (
            <div>
              <Label htmlFor="custom-reason">Especifica el motivo</Label>
              <Textarea
                id="custom-reason"
                placeholder="Escribe el motivo específico..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                className="mt-1"
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={!selectedReason || (selectedReason === "Otro motivo" && !customReason.trim())}
          >
            Rechazar Orden
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
