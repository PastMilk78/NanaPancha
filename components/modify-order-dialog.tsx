"use client"

import { useState } from "react"
import type { Order } from "@/app/page"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Minus, Plus, Trash2 } from "lucide-react"

interface ModifyOrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: Order
  onModify?: (modifications: Partial<Order>) => void
}

export function ModifyOrderDialog({ open, onOpenChange, order, onModify }: ModifyOrderDialogProps) {
  const [products, setProducts] = useState(order.products)
  const [notes, setNotes] = useState(order.notes || "")
  const [newProduct, setNewProduct] = useState({ name: "", quantity: 1, price: 0 })

  const updateProductQuantity = (index: number, change: number) => {
    setProducts((prev) =>
      prev
        .map((product, i) => (i === index ? { ...product, quantity: Math.max(0, product.quantity + change) } : product))
        .filter((product) => product.quantity > 0),
    )
  }

  const removeProduct = (index: number) => {
    setProducts((prev) => prev.filter((_, i) => i !== index))
  }

  const addProduct = () => {
    if (newProduct.name && newProduct.price > 0) {
      setProducts((prev) => [...prev, { ...newProduct }])
      setNewProduct({ name: "", quantity: 1, price: 0 })
    }
  }

  const calculateTotal = () => {
    return products.reduce((total, product) => total + product.price * product.quantity, 0)
  }

  const handleSave = () => {
    const modifications: Partial<Order> = {
      products,
      notes,
      totalPrice: calculateTotal(),
    }
    onModify?.(modifications)
    onOpenChange(false)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modificar Orden</DialogTitle>
          <DialogDescription>Realiza cambios menores a la orden de {order.customerName}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Productos existentes */}
          <div>
            <Label className="text-base font-medium">Productos en la orden</Label>
            <div className="space-y-3 mt-2">
              {products.map((product, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600">{formatPrice(product.price)} c/u</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline" onClick={() => updateProductQuantity(index, -1)}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{product.quantity}</span>
                    <Button size="sm" variant="outline" onClick={() => updateProductQuantity(index, 1)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => removeProduct(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Agregar nuevo producto */}
          <div>
            <Label className="text-base font-medium">Agregar producto</Label>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-2">
              <Input
                placeholder="Nombre del producto"
                value={newProduct.name}
                onChange={(e) => setNewProduct((prev) => ({ ...prev, name: e.target.value }))}
                className="md:col-span-2"
              />
              <Input
                type="number"
                placeholder="Cantidad"
                min="1"
                value={newProduct.quantity}
                onChange={(e) => setNewProduct((prev) => ({ ...prev, quantity: Number.parseInt(e.target.value) || 1 }))}
              />
              <Input
                type="number"
                placeholder="Precio"
                min="0"
                value={newProduct.price}
                onChange={(e) => setNewProduct((prev) => ({ ...prev, price: Number.parseInt(e.target.value) || 0 }))}
              />
            </div>
            <Button onClick={addProduct} className="mt-2" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Agregar
            </Button>
          </div>

          {/* Notas */}
          <div>
            <Label htmlFor="notes">Notas adicionales</Label>
            <Textarea
              id="notes"
              placeholder="Agregar notas especiales para la orden..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1"
            />
          </div>

          {/* Total */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">Nuevo Total:</span>
              <span className="text-xl font-bold">{formatPrice(calculateTotal())}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Guardar Cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
