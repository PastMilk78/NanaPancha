import ProtectedRoute from '@/components/ProtectedRoute'
import SecurityDashboard from '@/components/SecurityDashboard'

export default function SecurityPage() {
  return (
    <ProtectedRoute requiredRoles={['admin']}>
      <SecurityDashboard />
    </ProtectedRoute>
  )
}







