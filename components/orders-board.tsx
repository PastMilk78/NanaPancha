"use client"

import type { Order } from "@/app/page"
import { OrderCard } from "./order-card"
import { Clock, ChefHat, Truck } from "lucide-react"

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
  const pendingOrders = orders.filter((order) => order.status === "pending")
  const cookingOrders = orders.filter((order) => order.status === "cooking")
  const readyOrders = orders.filter((order) => order.status === "ready")

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Por Confirmar */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b bg-orange-50">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-orange-800">Por Confirmar</h2>
            <span className="bg-orange-200 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
              {pendingOrders.length}
            </span>
          </div>
        </div>
        <div className="p-4 space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
          {pendingOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onAccept={() => onAcceptOrder(order.id)}
              onReject={(reason) => onRejectOrder(order.id, reason)}
              onModify={(modifications) => onModifyOrder(order.id, modifications)}
              onUpdateStatus={(status) => onUpdateStatus(order.id, status)}
              showAcceptReject
            />
          ))}
          {pendingOrders.length === 0 && <p className="text-gray-500 text-center py-8">No hay órdenes pendientes</p>}
        </div>
      </div>

      {/* En Cocina */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b bg-yellow-50">
          <div className="flex items-center space-x-2">
            <ChefHat className="h-5 w-5 text-yellow-600" />
            <h2 className="text-lg font-semibold text-yellow-800">En Cocina</h2>
            <span className="bg-yellow-200 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
              {cookingOrders.length}
            </span>
          </div>
        </div>
        <div className="p-4 space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
          {cookingOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onModify={(modifications) => onModifyOrder(order.id, modifications)}
              onUpdateStatus={(status) => onUpdateStatus(order.id, status)}
              showModify
              showMarkReady
            />
          ))}
          {cookingOrders.length === 0 && <p className="text-gray-500 text-center py-8">No hay órdenes en cocina</p>}
        </div>
      </div>

      {/* Para Entrega */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b bg-green-50">
          <div className="flex items-center space-x-2">
            <Truck className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-semibold text-green-800">Para Entrega</h2>
            <span className="bg-green-200 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
              {readyOrders.length}
            </span>
          </div>
        </div>
        <div className="p-4 space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
          {readyOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onUpdateStatus={(status) => onUpdateStatus(order.id, status)}
              onArchiveOrder={() => onArchiveOrder(order.id)}
              showArchive
            />
          ))}
          {readyOrders.length === 0 && <p className="text-gray-500 text-center py-8">No hay órdenes listas</p>}
        </div>
      </div>
    </div>
  )
}
