"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Order } from "@/app/page"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Edit, MessageSquare, Phone, Clock, Archive, AlertTriangle, ArrowRight, ArrowLeft } from "lucide-react"
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
  const [screenSize, setScreenSize] = useState<"mobile" | "tablet" | "desktop">("desktop")

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      if (width < 768) {
        setScreenSize("mobile")
      } else if (width < 1024) {
        setScreenSize("tablet")
      } else {
        setScreenSize("desktop")
      }
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)
  }

  const getNextStatus = (): Order["status"] | null => {
    switch (order.status) {
      case "pending":
        return "cooking"
      case "cooking":
        return "ready"
      case "ready":
        return null
      default:
        return null
    }
  }

  const getPreviousStatus = (): Order["status"] | null => {
    switch (order.status) {
      case "cooking":
        return "pending"
      case "ready":
        return "cooking"
      case "pending":
        return null
      default:
        return null
    }
  }

  const getNextStatusLabel = () => {
    const next = getNextStatus()
    switch (next) {
      case "cooking":
        return "A Cocina"
      case "ready":
        return "Listo"
      default:
        return null
    }
  }

  const getPreviousStatusLabel = () => {
    const prev = getPreviousStatus()
    switch (prev) {
      case "pending":
        return "A Confirmar"
      case "cooking":
        return "A Cocina"
      default:
        return null
    }
  }

  const handleMoveNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    const nextStatus = getNextStatus()
    if (nextStatus) {
      if (nextStatus === "cooking" && order.status === "pending") {
        onAccept?.()
      } else {
        onUpdateStatus?.(nextStatus)
      }
    }
  }

  const handleMovePrevious = (e: React.MouseEvent) => {
    e.stopPropagation()
    const prevStatus = getPreviousStatus()
    if (prevStatus) {
      onUpdateStatus?.(prevStatus)
    }
  }

  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation()
    action()
  }

  const showNavigationButtons = screenSize !== "desktop"

  return (
    <>
      <Card className="border-l-4 border-l-red-500 hover:shadow-xl transition-all duration-300 select-none bg-white/95 backdrop-blur-sm hover:bg-white">
        <CardHeader className="pb-4 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h3 className="font-bold text-xl text-black tracking-tight">{order.customerName}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <Phone className="h-4 w-4 text-red-600" />
                <span className="font-medium">{order.customerPhone}</span>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-3">
              <Badge
                variant={order.source === "whatsapp" ? "default" : "secondary"}
                className={`${
                  order.source === "whatsapp"
                    ? "bg-red-600 hover:bg-red-700 text-white shadow-md"
                    : "bg-yellow-500 hover:bg-yellow-600 text-black shadow-md"
                } font-semibold px-3 py-1`}
              >
                {order.source === "whatsapp" ? (
                  <MessageSquare className="h-3 w-3 mr-1" />
                ) : (
                  <Phone className="h-3 w-3 mr-1" />
                )}
                {order.source === "whatsapp" ? "WhatsApp" : "Teléfono"}
              </Badge>
              <div className="flex items-center text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                <Clock className="h-4 w-4 mr-1 text-red-600" />
                <span className="font-medium">{order.receivedAt}</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 p-6">
          <div>
            <h4 className="font-bold mb-3 text-black text-lg">Productos:</h4>
            <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
              {order.products.map((product, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center text-sm border-b border-gray-200 pb-2 last:border-b-0 last:pb-0"
                >
                  <span className="font-medium text-black">
                    <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs mr-2 font-bold">
                      {product.quantity}
                    </span>
                    {product.name}
                  </span>
                  <span className="font-bold text-black text-base">
                    {formatPrice(product.price * product.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {order.notes && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
              <p className="text-sm text-black">
                <strong className="text-yellow-700">Notas:</strong> {order.notes}
              </p>
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t-2 border-gray-200">
            <span className="text-2xl font-black text-black">Total:</span>
            <span className="text-2xl font-black text-red-600">{formatPrice(order.totalPrice)}</span>
          </div>

          {/* Botones de navegación - móvil y tablet */}
          {showNavigationButtons && (
            <div className="flex gap-3 pt-4">
              {getPreviousStatus() && (
                <Button
                  onClick={handleMovePrevious}
                  size="lg"
                  variant="outline"
                  className="flex-1 border-2 border-gray-400 hover:border-black hover:bg-gray-100 text-black font-semibold"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {getPreviousStatusLabel()}
                </Button>
              )}

              {getNextStatus() && (
                <Button
                  onClick={handleMoveNext}
                  size="lg"
                  className="bg-red-600 hover:bg-red-700 text-white flex-1 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
                >
                  {getNextStatusLabel()}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}

              {order.status === "ready" && (
                <Button
                  onClick={(e) => handleButtonClick(e, () => onArchiveOrder?.())}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white flex-1 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
                >
                  <Archive className="h-4 w-4 mr-2" />
                  Archivar
                </Button>
              )}
            </div>
          )}

          {/* Botones de acción tradicionales */}
          <div
            className={`flex flex-wrap gap-3 pt-4 ${showNavigationButtons ? "border-t-2 border-gray-200 mt-6" : ""}`}
          >
            {showAcceptReject && (
              <>
                <Button
                  onClick={(e) => handleButtonClick(e, () => onAccept?.())}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white flex-1 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Aceptar
                </Button>
                <Button
                  onClick={(e) => handleButtonClick(e, () => setShowRejectDialog(true))}
                  size="lg"
                  variant="outline"
                  className={`${
                    showNavigationButtons ? "w-full mt-2" : "flex-1"
                  } border-2 border-yellow-500 text-yellow-700 hover:bg-yellow-50 hover:border-yellow-600 font-semibold`}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Rechazo Manual
                </Button>
              </>
            )}

            {showModify && (
              <Button
                onClick={(e) => handleButtonClick(e, () => setShowModifyDialog(true))}
                size="lg"
                variant="outline"
                className={`${showNavigationButtons ? "w-full" : "flex-1"} border-2 border-gray-400 hover:border-black hover:bg-gray-100 text-black font-semibold`}
              >
                <Edit className="h-4 w-4 mr-2" />
                Modificar
              </Button>
            )}

            {showMarkReady && !showNavigationButtons && (
              <Button
                onClick={(e) => handleButtonClick(e, () => onUpdateStatus?.("ready"))}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white flex-1 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
              >
                <Check className="h-4 w-4 mr-2" />
                Marcar Listo
              </Button>
            )}

            {showArchive && !showNavigationButtons && (
              <Button
                onClick={(e) => handleButtonClick(e, () => onArchiveOrder?.())}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white flex-1 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
              >
                <Archive className="h-4 w-4 mr-2" />
                Archivar
              </Button>
            )}
          </div>

          {/* Botones de navegación adicionales en desktop */}
          {screenSize === "desktop" && (
            <div className="flex gap-2 pt-4 border-t border-gray-200 opacity-80 hover:opacity-100 transition-opacity">
              <span className="text-xs text-gray-600 flex items-center mr-3 font-medium">Navegación rápida:</span>
              {getPreviousStatus() && (
                <Button
                  onClick={handleMovePrevious}
                  size="sm"
                  variant="ghost"
                  className="h-8 px-3 hover:bg-gray-100 text-black font-medium"
                >
                  <ArrowLeft className="h-3 w-3 mr-1" />
                  {getPreviousStatusLabel()}
                </Button>
              )}
              {getNextStatus() && (
                <Button
                  onClick={handleMoveNext}
                  size="sm"
                  variant="ghost"
                  className="h-8 px-3 hover:bg-red-50 text-red-600 font-medium"
                >
                  {getNextStatusLabel()}
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <RejectOrderDialog open={showRejectDialog} onOpenChange={setShowRejectDialog} onReject={onReject} />

      <ModifyOrderDialog open={showModifyDialog} onOpenChange={setShowModifyDialog} order={order} onModify={onModify} />
    </>
  )
}
