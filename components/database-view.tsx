"use client"

import { useState } from "react"
import type { Order, Customer } from "@/app/page"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Users, ShoppingBag, Search, Phone, Calendar, DollarSign, TrendingUp, MessageSquare } from "lucide-react"

interface DatabaseViewProps {
  customers: Customer[]
  orders: Order[]
}

export function DatabaseView({ customers, orders }: DatabaseViewProps) {
  const [customerSearch, setCustomerSearch] = useState("")
  const [orderSearch, setOrderSearch] = useState("")

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(customerSearch.toLowerCase()) || customer.phone.includes(customerSearch),
  )

  const filteredOrders = orders.filter(
    (order) =>
      order.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.customerPhone.includes(orderSearch) ||
      order.products.some((product) => product.name.toLowerCase().includes(orderSearch.toLowerCase())),
  )

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CO")
  }

  const getStatusBadge = (status: Order["status"]) => {
    const statusConfig = {
      pending: { label: "Pendiente", variant: "secondary" as const },
      cooking: { label: "En Cocina", variant: "default" as const },
      ready: { label: "Listo", variant: "outline" as const },
      delivered: { label: "Entregado", variant: "outline" as const },
    }
    return statusConfig[status]
  }

  // Estadísticas generales
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0)
  const totalCustomers = customers.length
  const totalOrders = orders.length
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  return (
    <div className="space-y-6">
      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Órdenes</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(totalRevenue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio por Orden</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(averageOrderValue)}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="customers" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="customers">Clientes</TabsTrigger>
          <TabsTrigger value="orders">Bitácora de Pedidos</TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="space-y-4">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar clientes por nombre o teléfono..."
              value={customerSearch}
              onChange={(e) => setCustomerSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="grid gap-4">
            {filteredCustomers.map((customer) => (
              <Card key={customer.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">{customer.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{customer.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>Último pedido: {formatDate(customer.lastOrder)}</span>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="text-sm text-gray-600">
                        <div>{customer.totalOrders} pedidos</div>
                        <div className="font-semibold text-green-600">{formatPrice(customer.totalSpent)}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar pedidos por cliente o producto..."
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="grid gap-4">
            {filteredOrders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold">{order.customerName}</h3>
                      <p className="text-sm text-gray-600">{order.customerPhone}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge {...getStatusBadge(order.status)}>{getStatusBadge(order.status).label}</Badge>
                      <div className="text-sm text-gray-600">{order.receivedAt}</div>
                    </div>
                  </div>

                  <div className="space-y-1 mb-3">
                    {order.products.map((product, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>
                          {product.quantity}x {product.name}
                        </span>
                        <span>{formatPrice(product.price * product.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <Badge variant={order.source === "whatsapp" ? "default" : "secondary"}>
                      {order.source === "whatsapp" ? (
                        <MessageSquare className="h-3 w-3 mr-1" />
                      ) : (
                        <Phone className="h-3 w-3 mr-1" />
                      )}
                      {order.source === "whatsapp" ? "WhatsApp" : "Teléfono"}
                    </Badge>
                    <span className="font-semibold">{formatPrice(order.totalPrice)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
