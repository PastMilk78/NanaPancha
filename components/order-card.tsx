"use client"

import { useState } from "react"
import type { Order } from "@/app/page"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X, Edit, MessageSquare, Phone, Clock, Instagram, Archive } from "lucide-react"
import { RejectOrderDialog } from "./reject-order-dialog"
import { ModifyOrderDialog } from "./modify-order-dialog"

interface OrderCardProps {
  order: Order
  onAccept?: () => void
  onReject?: (reason: string) => void
  onModify?: (modifications: Partial<Order>) => void
  onUpdateStatus?: (status: Order["status"]) => void
  onArchiveOrder?: () => void
  showAcceptReject?: boolean
  showModify?: boolean
  showMarkReady?: boolean
  showDelivered?: boolean
  showArchive?: boolean
}

export function OrderCard({
  order,
  onAccept,
  onReject,
  onModify,
  onUpdateStatus,
  onArchiveOrder,
  showAcceptReject,
  showModify,
  showMarkReady,
  showDelivered,
  showArchive,
}: OrderCardProps) {
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [showModifyDialog, setShowModifyDialog] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <>
      <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{order.customerName}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                <Phone className="h-4 w-4" />
                <span>{order.customerPhone}</span>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <Badge variant={order.source === "whatsapp" ? "default" : "secondary"}>
                {order.source === "whatsapp" ? (
                  <MessageSquare className="h-3 w-3 mr-1" />
                ) : (
                  <Instagram className="h-3 w-3 mr-1" />
                )}
                {order.source === "whatsapp" ? "WhatsApp" : "Instagram"}
              </Badge>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                {order.receivedAt}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Productos:</h4>
            <div className="space-y-1">
              {order.products.map((product, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>
                    {product.quantity}x {product.name}
                  </span>
                  <span className="font-medium">{formatPrice(product.price * product.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          {order.notes && (
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-700">
                <strong>Notas:</strong> {order.notes}
              </p>
            </div>
          )}

          <div className="flex justify-between items-center pt-2 border-t">
            <span className="text-lg font-bold">Total: {formatPrice(order.totalPrice)}</span>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-wrap gap-2 pt-2">
            {showAcceptReject && (
              <>
                <Button onClick={onAccept} size="sm" className="bg-green-600 hover:bg-green-700 flex-1">
                  <Check className="h-4 w-4 mr-1" />
                  Aceptar
                </Button>
                <Button onClick={() => setShowRejectDialog(true)} size="sm" variant="destructive" className="flex-1">
                  <X className="h-4 w-4 mr-1" />
                  Rechazar
                </Button>
              </>
            )}

            {showModify && (
              <Button onClick={() => setShowModifyDialog(true)} size="sm" variant="outline" className="flex-1">
                <Edit className="h-4 w-4 mr-1" />
                Modificar
              </Button>
            )}

            {showMarkReady && (
              <Button
                onClick={() => onUpdateStatus?.("ready")}
                size="sm"
                className="bg-green-600 hover:bg-green-700 flex-1"
              >
                <Check className="h-4 w-4 mr-1" />
                Marcar Listo
              </Button>
            )}

            {showArchive && (
              <Button onClick={onArchiveOrder} size="sm" className="bg-green-600 hover:bg-green-700 flex-1">
                <Archive className="h-4 w-4 mr-1" />
                Archivar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <RejectOrderDialog open={showRejectDialog} onOpenChange={setShowRejectDialog} onReject={onReject} />

      <ModifyOrderDialog open={showModifyDialog} onOpenChange={setShowModifyDialog} order={order} onModify={onModify} />
    </>
  )
}
