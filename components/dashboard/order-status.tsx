import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStatusColor, getStatusIcon, formatNumber } from "@/lib/analytics-utils";
import { Package } from "lucide-react";

interface OrderStatusProps {
  orderStatusDistribution: Record<string, number>;
  totalOrders: number;
}

export const OrderStatus = ({ orderStatusDistribution, totalOrders }: OrderStatusProps) => {
  const statuses = Object.entries(orderStatusDistribution || {}).sort((a, b) => b[1] - a[1]);

  if (!orderStatusDistribution || statuses.length === 0) {
    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Status Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No order data available yet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Order Status Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {statuses.map(([status, count]) => {
            const percentage = totalOrders > 0 ? (count / totalOrders) * 100 : 0;
            
            return (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getStatusIcon(status)}</span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium capitalize">{status || 'Unknown'}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                        {formatNumber(count || 0)}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {percentage.toFixed(1)}% of total orders
                    </div>
                  </div>
                </div>
                <div className="flex-1 max-w-32 ml-4">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        status === 'completed' ? 'bg-green-500' :
                        status === 'processing' ? 'bg-blue-500' :
                        status === 'pending' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}; 