import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/lib/analytics-utils";
import { TrendingUp } from "lucide-react";

interface TopProduct {
  id: string;
  name: string;
  category: string;
  totalSold: number;
  revenue: number;
  price: number;
  availableQuantity: number;
}

interface TopProductsProps {
  products: TopProduct[];
}

export const TopProducts = ({ products }: TopProductsProps) => {
  if (!products || products.length === 0) {
    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Top Selling Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No sales data available yet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Top Selling Products
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product, index) => (
            <div key={product.id || index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold">
                  #{index + 1}
                </div>
                <div>
                  <h4 className="font-medium text-sm">{product.name || 'Unknown Product'}</h4>
                  <p className="text-xs text-muted-foreground">{product.category || 'Uncategorized'}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-sm">{formatNumber(product.totalSold || 0)} sold</div>
                <div className="text-xs text-muted-foreground">
                  {formatCurrency(product.revenue || 0)} revenue
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatNumber(product.availableQuantity || 0)} in stock
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}; 