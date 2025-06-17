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
  const [isDesktop, setIsDesktop] = useState(false)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: order.id,
  })

  useEffect(() => {
    const checkDevice = () => {
      const isLargeScreen = window.innerWidth >= 1024
      const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches
      setIsDesktop(isLargeScreen && !hasCoarsePointer)
    }

    checkDevice()
    window.addEventListener("resize", checkDevice)
    return () => window.removeEventListener("resize", checkDevice)
  }, [])

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${isDragging ? "opacity-50 z-50" : ""} ${
        isDragging ? "" : "cursor-grab active:cursor-grabbing"
      } touch-manipulation`}
      {...attributes}
      {...listeners}
    >
      {/* Indicador visual de que es arrastrable */}
      <div
        className={`absolute right-2 top-2 z-10 transition-opacity pointer-events-none ${
          isDesktop ? "opacity-0 group-hover:opacity-100" : "opacity-60"
        } p-1 rounded bg-white/80 shadow-sm`}
      >
        <GripVertical className="h-4 w-4 text-gray-400" />
      </div>

      {/* Indicador adicional en móvil */}
      {!isDesktop && (
        <div className="absolute left-2 top-2 z-10 opacity-40 pointer-events-none">
          <div className="flex flex-col space-y-0.5">
            <div className="w-3 h-0.5 bg-gray-400 rounded"></div>
            <div className="w-3 h-0.5 bg-gray-400 rounded"></div>
            <div className="w-3 h-0.5 bg-gray-400 rounded"></div>
          </div>
        </div>
      )}

      <OrderCard order={order} {...props} />
    </div>
  )
}
