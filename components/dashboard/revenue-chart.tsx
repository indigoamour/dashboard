import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, getMonthName } from "@/lib/analytics-utils";

interface RevenueChartProps {
  monthlyRevenue: Record<string, number>;
}

export const RevenueChart = ({ monthlyRevenue }: RevenueChartProps) => {
  const months = Object.keys(monthlyRevenue || {}).sort();
  const maxRevenue = Math.max(...Object.values(monthlyRevenue || {}), 1);

  if (!monthlyRevenue || months.length === 0) {
    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Revenue Trend (Last 6 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No revenue data available for the last 6 months.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Revenue Trend (Last 6 Months)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {months.map((month) => {
            const revenue = monthlyRevenue[month] || 0;
            const percentage = (revenue / maxRevenue) * 100;
            
            return (
              <div key={month} className="flex items-center space-x-4">
                <div className="w-24 text-sm text-muted-foreground">
                  {getMonthName(month)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-20 text-right">
                      {formatCurrency(revenue)}
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