import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/analytics-utils";
import { BarChart3 } from "lucide-react";

interface SalesData {
  month: string;
  sales: number;
}

interface SalesChartProps {
  salesData: SalesData[];
}

export const SalesChart = ({ salesData }: SalesChartProps) => {
  const maxSales = Math.max(...salesData.map(d => d.sales), 1);

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Sales Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {salesData.map((data) => {
            const percentage = (data.sales / maxSales) * 100;
            
            return (
              <div key={data.month} className="flex items-center space-x-4">
                <div className="w-24 text-sm text-muted-foreground">
                  {data.month}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-16 text-right">
                      {formatNumber(data.sales)}
                    </span>
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