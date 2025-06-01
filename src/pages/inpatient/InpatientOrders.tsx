import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface InpatientOrdersProps {
  patientId?: string;
  unitId?: string;
}

const InpatientOrders: React.FC<InpatientOrdersProps> = ({ patientId, unitId }) => {
  // Mock data for demonstration
  const orders = [
    {
      id: '1',
      type: 'Medication',
      description: 'Carboplatin 450mg IV',
      status: 'pending',
      priority: 'high',
      orderTime: '2025-06-01T08:00:00Z',
      scheduledTime: '2025-06-01T10:00:00Z'
    },
    {
      id: '2',
      type: 'Lab',
      description: 'CBC with differential',
      status: 'completed',
      priority: 'routine',
      orderTime: '2025-06-01T06:00:00Z',
      scheduledTime: '2025-06-01T09:00:00Z'
    },
    {
      id: '3',
      type: 'Imaging',
      description: 'CT Chest with contrast',
      status: 'in-progress',
      priority: 'urgent',
      orderTime: '2025-06-01T07:30:00Z',
      scheduledTime: '2025-06-01T11:00:00Z'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'pending':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'urgent':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'routine':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Inpatient Orders
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and track patient orders across all inpatient units
          </p>
        </div>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          New Order
        </Button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(order.status)}
                  {order.type} Order
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className={getPriorityColor(order.priority)}>
                    {order.priority}
                  </Badge>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-lg font-medium">{order.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div>
                    <span className="font-medium">Ordered:</span>{' '}
                    {new Date(order.orderTime).toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">Scheduled:</span>{' '}
                    {new Date(order.scheduledTime).toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {orders.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No orders found
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-center">
              There are currently no orders for the selected criteria.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InpatientOrders;
