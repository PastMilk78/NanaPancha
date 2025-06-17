"use client"

import { useState, useEffect } from "react"
import { OrdersBoard } from "@/components/orders-board"
import { DatabaseView } from "@/components/database-view"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Database, RefreshCw, ChefHat } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export interface Order {
  id: string
  customerName: string
  customerPhone: string
  products: Array<{
    name: string
    quantity: number
    price: number
    notes?: string
  }>
  totalPrice: number
  receivedAt: string
  status: "pending" | "cooking" | "ready" | "delivered"
  source: "whatsapp" | "telefono"
  notes?: string
}

export interface Customer {
  id: string
  name: string
  phone: string
  totalOrders: number
  lastOrder: string
  totalSpent: number
}

// Datos de ejemplo actualizados
const mockOrders: Order[] = [
  {
    id: "1",
    customerName: "María González",
    customerPhone: "+57 300 123 4567",
    products: [
      { name: "Hamburguesa Clásica", quantity: 2, price: 15000 },
      { name: "Papas Fritas", quantity: 1, price: 8000 },
      { name: "Coca Cola", quantity: 2, price: 5000 },
    ],
    totalPrice: 43000,
    receivedAt: "14:30",
    status: "pending",
    source: "whatsapp",
  },
  {
    id: "2",
    customerName: "Carlos Rodríguez",
    customerPhone: "+57 301 987 6543",
    products: [
      { name: "Pizza Margherita", quantity: 1, price: 25000 },
      { name: "Cerveza", quantity: 2, price: 8000 },
    ],
    totalPrice: 41000,
    receivedAt: "14:45",
    status: "cooking",
    source: "telefono",
  },
  {
    id: "3",
    customerName: "Ana Martínez",
    customerPhone: "+57 302 456 7890",
    products: [
      { name: "Ensalada César", quantity: 1, price: 18000 },
      { name: "Agua", quantity: 1, price: 3000 },
    ],
    totalPrice: 21000,
    receivedAt: "13:15",
    status: "ready",
    source: "whatsapp",
  },
  {
    id: "4",
    customerName: "Luis Pérez",
    customerPhone: "+57 304 555 1234",
    products: [{ name: "Combo Familiar", quantity: 1, price: 45000 }],
    totalPrice: 45000,
    receivedAt: "15:20",
    status: "pending",
    source: "telefono",
  },
]

const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "María González",
    phone: "+57 300 123 4567",
    totalOrders: 15,
    lastOrder: "2024-01-15",
    totalSpent: 450000,
  },
  {
    id: "2",
    name: "Carlos Rodríguez",
    phone: "+57 301 987 6543",
    totalOrders: 8,
    lastOrder: "2024-01-14",
    totalSpent: 280000,
  },
  {
    id: "3",
    name: "Ana Martínez",
    phone: "+57 302 456 7890",
    totalOrders: 12,
    lastOrder: "2024-01-13",
    totalSpent: 320000,
  },
]

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [customers] = useState<Customer[]>(mockCustomers)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()
  const [archivedOrders, setArchivedOrders] = useState<Order[]>([])

  // Simulación de actualización en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      // Aquí harías fetch al backend real
      // fetchOrders()
    }, 30000) // Actualizar cada 30 segundos

    return () => clearInterval(interval)
  }, [])

  const refreshOrders = async () => {
    setIsRefreshing(true)
    try {
      // Simulación de llamada al backend
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // const response = await fetch('/api/orders')
      // const newOrders = await response.json()
      // setOrders(newOrders)

      toast({
        title: "Órdenes actualizadas",
        description: "Los datos se han sincronizado correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron actualizar las órdenes",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: Order["status"]) => {
    try {
      // Llamada al backend
      // await fetch(`/api/orders/${orderId}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: newStatus })
      // })

      setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))

      toast({
        title: "Estado actualizado",
        description: `Orden movida a ${newStatus === "cooking" ? "En Cocina" : newStatus === "ready" ? "Para Entrega" : "Por Confirmar"}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de la orden",
        variant: "destructive",
      })
    }
  }

  const acceptOrder = async (orderId: string) => {
    await updateOrderStatus(orderId, "cooking")
  }

  const rejectOrder = async (orderId: string, reason: string) => {
    try {
      // await fetch(`/api/orders/${orderId}/reject`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ reason })
      // })

      setOrders((prev) => prev.filter((order) => order.id !== orderId))

      toast({
        title: "Orden rechazada",
        description: `Motivo: ${reason}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo rechazar la orden",
        variant: "destructive",
      })
    }
  }

  const modifyOrder = async (orderId: string, modifications: Partial<Order>) => {
    try {
      // await fetch(`/api/orders/${orderId}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(modifications)
      // })

      setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, ...modifications } : order)))

      toast({
        title: "Orden modificada",
        description: "Los cambios se han guardado correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo modificar la orden",
        variant: "destructive",
      })
    }
  }

  const archiveOrder = async (orderId: string) => {
    try {
      // await fetch(`/api/orders/${orderId}/archive`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' }
      // })

      const orderToArchive = orders.find((order) => order.id === orderId)
      if (orderToArchive) {
        setArchivedOrders((prev) => [...prev, { ...orderToArchive, status: "delivered" as Order["status"] }])
        setOrders((prev) => prev.filter((order) => order.id !== orderId))

        toast({
          title: "Orden archivada",
          description: "La orden ha sido marcada como entregada y archivada",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo archivar la orden",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <img
                src="/images/nanapancha-logo.png"
                alt="NanaPancha Logo"
                className="h-16 w-16 object-contain rounded-lg shadow-sm"
              />
              <h1 className="text-2xl font-bold text-gray-900">Panel de Órdenes</h1>
            </div>
            <Button onClick={refreshOrders} disabled={isRefreshing} variant="outline" size="sm">
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Actualizar
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="orders" className="flex items-center space-x-2">
              <ChefHat className="h-4 w-4" />
              <span>Gestión de Órdenes</span>
            </TabsTrigger>
            <TabsTrigger value="database" className="flex items-center space-x-2">
              <Database className="h-4 w-4" />
              <span>Base de Datos</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <OrdersBoard
              orders={orders}
              onAcceptOrder={acceptOrder}
              onRejectOrder={rejectOrder}
              onModifyOrder={modifyOrder}
              onUpdateStatus={updateOrderStatus}
              onArchiveOrder={archiveOrder}
            />
          </TabsContent>

          <TabsContent value="database">
            <DatabaseView customers={customers} orders={[...orders, ...archivedOrders]} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
