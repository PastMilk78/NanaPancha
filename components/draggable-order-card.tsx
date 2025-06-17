"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { Order } from "@/app/page"
import { OrderCard } from "./order-card"
import { GripVertical } from "lucide-react"
import { useEffect, useState } from "react"

interface DraggableOrderCardProps {
  order: Order
  onAccept?: () => void
  onReject?: (reason: string) => void
  onModify?: (modifications: Partial<Order>) => void
  onUpdateStatus?: (status: Order["status"]) => void
  onArchiveOrder?: () => void
  showAcceptReject?: boolean
  showModify?: boolean
  showMarkReady?: boolean
  showArchive?: boolean
}

export function DraggableOrderCard({ order, ...props }: DraggableOrderCardProps) {
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: order.id,
  })

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0)
  }, [])

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${isDragging ? "opacity-50 z-50" : ""}`}
      {...attributes}
      {...listeners}
    >
      {/* Indicador de arrastre - siempre visible en touch, hover en desktop */}
      <div
        className={`absolute right-2 top-2 z-10 p-2 rounded-lg bg-white/90 shadow-sm border transition-opacity ${
          isTouchDevice ? "opacity-70" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        <GripVertical className="h-4 w-4 text-gray-500" />
      </div>

      {/* Indicador adicional para touch en la esquina superior izquierda */}
      {isTouchDevice && (
        <div className="absolute left-2 top-2 z-10 opacity-50">
          <div className="flex flex-col space-y-0.5">
            <div className="w-3 h-0.5 bg-gray-400 rounded"></div>
            <div className="w-3 h-0.5 bg-gray-400 rounded"></div>
            <div className="w-3 h-0.5 bg-gray-400 rounded"></div>
          </div>
        </div>
      )}

      <div
        className={`${isDragging ? "" : "cursor-grab active:cursor-grabbing"} ${isTouchDevice ? "touch-manipulation" : ""}`}
      >
        <OrderCard order={order} {...props} />
      </div>
    </div>
  )
}
