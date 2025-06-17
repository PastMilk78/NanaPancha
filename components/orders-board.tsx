"use client"

import { useState } from "react"
import type { Order } from "@/app/page"
import { OrderCard } from "./order-card"
import { Clock, ChefHat, Truck } from "lucide-react"
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { DroppableColumn } from "./droppable-column"
import { DraggableOrderCard } from "./draggable-order-card"

interface OrdersBoardProps {
  orders: Order[]
  onAcceptOrder: (orderId: string) => void
  onRejectOrder: (orderId: string, reason: string) => void
  onModifyOrder: (orderId: string, modifications: Partial<Order>) => void
  onUpdateStatus: (orderId: string, status: Order["status"]) => void
  onArchiveOrder: (orderId: string) => void
}

export function OrdersBoard({
  orders,
  onAcceptOrder,
  onRejectOrder,
  onModifyOrder,
  onUpdateStatus,
  onArchiveOrder,
}: OrdersBoardProps) {
  const [activeOrder, setActiveOrder] = useState<Order | null>(null)

  const pendingOrders = orders.filter((order) => order.status === "pending")
  const cookingOrders = orders.filter((order) => order.status === "cooking")
  const readyOrders = orders.filter((order) => order.status === "ready")

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100, // Reducido de 200 a 100ms
        tolerance: 5, // Reducido de 8 a 5px para mayor sensibilidad
      },
    }),
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const order = orders.find((o) => o.id === active.id)
    setActiveOrder(order || null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveOrder(null)

    if (!over) return

    const orderId = active.id as string
    const newStatus = over.id as Order["status"]
    const currentOrder = orders.find((o) => o.id === orderId)

    if (!currentOrder || currentOrder.status === newStatus) return

    // Validar transiciones válidas
    const validTransitions: Record<Order["status"], Order["status"][]> = {
      pending: ["cooking"],
      cooking: ["pending", "ready"],
      ready: ["cooking"],
    }

    if (validTransitions[currentOrder.status]?.includes(newStatus)) {
      if (newStatus === "cooking" && currentOrder.status === "pending") {
        onAcceptOrder(orderId)
      } else {
        onUpdateStatus(orderId, newStatus)
      }
    }
  }

  const columns = [
    {
      id: "pending" as const,
      title: "Por Confirmar",
      icon: Clock,
      orders: pendingOrders,
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      titleColor: "text-orange-800",
      badgeColor: "bg-orange-200 text-orange-800",
    },
    {
      id: "cooking" as const,
      title: "En Cocina",
      icon: ChefHat,
      orders: cookingOrders,
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
      titleColor: "text-yellow-800",
      badgeColor: "bg-yellow-200 text-yellow-800",
    },
    {
      id: "ready" as const,
      title: "Para Entrega",
      icon: Truck,
      orders: readyOrders,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      titleColor: "text-green-800",
      badgeColor: "bg-green-200 text-green-800",
    },
  ]

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {columns.map((column) => (
          <DroppableColumn key={column.id} id={column.id} className="bg-white rounded-lg shadow-sm border">
            <div className={`p-4 border-b ${column.bgColor}`}>
              <div className="flex items-center space-x-2">
                <column.icon className={`h-5 w-5 ${column.iconColor}`} />
                <h2 className={`text-lg font-semibold ${column.titleColor}`}>{column.title}</h2>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${column.badgeColor}`}>
                  {column.orders.length}
                </span>
              </div>
            </div>
            <div className="p-4 space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
              <SortableContext items={column.orders.map((o) => o.id)} strategy={verticalListSortingStrategy}>
                {column.orders.map((order) => (
                  <DraggableOrderCard
                    key={order.id}
                    order={order}
                    onAccept={() => onAcceptOrder(order.id)}
                    onReject={(reason) => onRejectOrder(order.id, reason)}
                    onModify={(modifications) => onModifyOrder(order.id, modifications)}
                    onUpdateStatus={(status) => onUpdateStatus(order.id, status)}
                    onArchiveOrder={() => onArchiveOrder(order.id)}
                    showAcceptReject={column.id === "pending"}
                    showModify={column.id === "cooking"}
                    showMarkReady={column.id === "cooking"}
                    showArchive={column.id === "ready"}
                  />
                ))}
              </SortableContext>
              {column.orders.length === 0 && (
                <p className="text-gray-500 text-center py-8">
                  {column.id === "pending" && "No hay órdenes pendientes"}
                  {column.id === "cooking" && "No hay órdenes en cocina"}
                  {column.id === "ready" && "No hay órdenes listas"}
                </p>
              )}
            </div>
          </DroppableColumn>
        ))}
      </div>

      <DragOverlay>
        {activeOrder ? (
          <div className="rotate-3 opacity-90">
            <OrderCard
              order={activeOrder}
              showAcceptReject={false}
              showModify={false}
              showMarkReady={false}
              showArchive={false}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
