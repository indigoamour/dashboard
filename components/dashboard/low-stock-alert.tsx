import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/analytics-utils";
import { AlertTriangle } from "lucide-react";

interface LowStockProduct {
  id: string;
  name: string;
  category: string;
  availableQuantity: number;
  price: number;
}

interface LowStockAlertProps {
  products: LowStockProduct[];
}

export const LowStockAlert = ({ products }: LowStockAlertProps) => {
  if (products.length === 0) {
    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-green-600" />
            Stock Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-green-600 text-2xl mb-2">✅</div>
            <p className="text-muted-foreground">All products have sufficient stock!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          Low Stock Alert
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="flex items-center justify-between p-3 border border-red-200 bg-red-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-8 h-8 bg-red-100 text-red-600 rounded-full">
                  ⚠️
                </div>
                <div>
                  <h4 className="font-medium text-sm">{product.name}</h4>
                  <p className="text-xs text-muted-foreground">{product.category}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-sm text-red-600">
                  {formatNumber(product.availableQuantity)} left
                </div>
                <div className="text-xs text-muted-foreground">
                  Needs restocking
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}; 