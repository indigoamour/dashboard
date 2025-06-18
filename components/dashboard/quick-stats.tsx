import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/lib/analytics-utils";
import { Activity, Target, Zap } from "lucide-react";

interface QuickStatsProps {
  totalRevenue: number;
  salesCount: number;
  averageOrderValue: number;
  conversionRate: number;
  lowStockCount: number;
  topProductName: string;
}

export const QuickStats = ({
  totalRevenue = 0,
  salesCount = 0,
  averageOrderValue = 0,
  conversionRate = 0,
  lowStockCount = 0,
  topProductName = '',
}: QuickStatsProps) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border p-6">
      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <Activity className="h-5 w-5" />
        Quick Insights
      </h3>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {formatCurrency(totalRevenue)}
          </div>
          <div className="text-sm text-muted-foreground">Total Revenue</div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {formatNumber(salesCount)}
          </div>
          <div className="text-sm text-muted-foreground">Total Sales</div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {formatCurrency(averageOrderValue)}
          </div>
          <div className="text-sm text-muted-foreground">Average Order Value</div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-orange-600 mb-2">
            {conversionRate.toFixed(1)}%
          </div>
          <div className="text-sm text-muted-foreground">Conversion Rate</div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-red-600 mb-2">
            {lowStockCount}
          </div>
          <div className="text-sm text-muted-foreground">Products Need Restocking</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-indigo-600 mb-2 truncate">
            {topProductName || 'N/A'}
          </div>
          <div className="text-sm text-muted-foreground">Best Selling Product</div>
        </div>
      </div>
    </div>
  );
}; 