"use client"

import type React from "react"

import { useDroppable } from "@dnd-kit/core"
import { cn } from "@/lib/utils"

interface DroppableColumnProps {
  id: string
  children: React.ReactNode
  className?: string
}

export function DroppableColumn({ id, children, className }: DroppableColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        className,
        isOver && "ring-2 ring-blue-500 ring-opacity-50 bg-blue-50/50 transition-all duration-200",
      )}
    >
      {children}
    </div>
  )
}
