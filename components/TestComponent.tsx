'use client'

export default function TestComponent() {
  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">
          🧪 Componente de Prueba
        </h1>
        <p className="text-gray-700">
          Si puedes ver este componente, significa que el sistema básico está funcionando.
        </p>
        <div className="mt-4 p-4 bg-green-100 rounded border border-green-300">
          <p className="text-green-800 font-medium">✅ Sistema funcionando correctamente</p>
        </div>
      </div>
    </div>
  )
}







