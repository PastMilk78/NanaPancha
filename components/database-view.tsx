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
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
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
    <div className="space-y-8">
      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-black">Total Clientes</CardTitle>
            <Users className="h-6 w-6 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-red-600">{totalCustomers}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-black">Total Órdenes</CardTitle>
            <ShoppingBag className="h-6 w-6 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-yellow-600">{totalOrders}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-black to-gray-800 border-2 border-gray-600 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-white">Ingresos Totales</CardTitle>
            <DollarSign className="h-6 w-6 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-green-400">{formatPrice(totalRevenue)}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-black">Promedio por Orden</CardTitle>
            <TrendingUp className="h-6 w-6 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-red-600">{formatPrice(averageOrderValue)}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="customers" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-black/90 p-1 rounded-xl shadow-lg">
          <TabsTrigger
            value="customers"
            className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300 hover:text-white transition-all duration-200 rounded-lg py-3 font-semibold"
          >
            Clientes
          </TabsTrigger>
          <TabsTrigger
            value="orders"
            className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300 hover:text-white transition-all duration-200 rounded-lg py-3 font-semibold"
          >
            Bitácora de Pedidos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="space-y-6 mt-8">
          <div className="flex items-center space-x-3 bg-white p-4 rounded-xl shadow-md border-2 border-gray-200">
            <Search className="h-5 w-5 text-red-600" />
            <Input
              placeholder="Buscar clientes por nombre o teléfono..."
              value={customerSearch}
              onChange={(e) => setCustomerSearch(e.target.value)}
              className="border-2 border-gray-300 focus:border-red-500 text-black font-medium"
            />
          </div>

          <div className="grid gap-6">
            {filteredCustomers.map((customer) => (
              <Card
                key={customer.id}
                className="shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-200 hover:border-red-300"
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-3">
                      <h3 className="font-bold text-xl text-black">{customer.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-700">
                        <Phone className="h-4 w-4 text-red-600" />
                        <span className="font-medium">{customer.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-700">
                        <Calendar className="h-4 w-4 text-red-600" />
                        <span className="font-medium">Último pedido: {formatDate(customer.lastOrder)}</span>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="text-sm text-gray-700">
                        <div className="font-bold text-black">{customer.totalOrders} pedidos</div>
                        <div className="font-black text-red-600 text-lg">{formatPrice(customer.totalSpent)}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6 mt-8">
          <div className="flex items-center space-x-3 bg-white p-4 rounded-xl shadow-md border-2 border-gray-200">
            <Search className="h-5 w-5 text-red-600" />
            <Input
              placeholder="Buscar pedidos por cliente o producto..."
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
              className="border-2 border-gray-300 focus:border-red-500 text-black font-medium"
            />
          </div>

          <div className="grid gap-6">
            {filteredOrders.map((order) => (
              <Card
                key={order.id}
                className="shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-200 hover:border-red-300"
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-black">{order.customerName}</h3>
                      <p className="text-sm text-gray-700 font-medium">{order.customerPhone}</p>
                    </div>
                    <div className="text-right space-y-2">
                      <Badge {...getStatusBadge(order.status)} className="font-semibold">
                        {getStatusBadge(order.status).label}
                      </Badge>
                      <div className="text-sm text-gray-600 font-medium">{order.receivedAt}</div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 bg-gray-50 p-4 rounded-lg">
                    {order.products.map((product, index) => (
                      <div
                        key={index}
                        className="flex justify-between text-sm border-b border-gray-200 pb-2 last:border-b-0 last:pb-0"
                      >
                        <span className="font-medium text-black">
                          <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs mr-2 font-bold">
                            {product.quantity}
                          </span>
                          {product.name}
                        </span>
                        <span className="font-bold text-black">{formatPrice(product.price * product.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t-2 border-gray-200">
                    <Badge
                      variant={order.source === "whatsapp" ? "default" : "secondary"}
                      className={`${
                        order.source === "whatsapp"
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-yellow-500 hover:bg-yellow-600 text-black"
                      } font-semibold px-3 py-1`}
                    >
                      {order.source === "whatsapp" ? (
                        <MessageSquare className="h-3 w-3 mr-1" />
                      ) : (
                        <Phone className="h-3 w-3 mr-1" />
                      )}
                      {order.source === "whatsapp" ? "WhatsApp" : "Teléfono"}
                    </Badge>
                    <span className="font-black text-red-600 text-xl">{formatPrice(order.totalPrice)}</span>
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
