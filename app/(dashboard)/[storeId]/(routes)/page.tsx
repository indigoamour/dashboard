import { getAnalytics } from "@/actions/get-analytics";
import { AnalyticsCard } from "@/components/dashboard/analytics-card";
import { LowStockAlert } from "@/components/dashboard/low-stock-alert";
import { OrderStatus } from "@/components/dashboard/order-status";
import { QuickStats } from "@/components/dashboard/quick-stats";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { TopProducts } from "@/components/dashboard/top-products";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatNumber } from "@/lib/analytics-utils";
import {
  BarChart3,
  CreditCard,
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  Warehouse,
} from "lucide-react";

const DashboardPage = async ({ params }: { params: { storeId: string } }) => {
  let analytics;
  
  try {
    analytics = await getAnalytics(params.storeId);
  } catch (error) {
    console.error('Error loading dashboard:', error);
    // Provide fallback data
    analytics = {
      totalRevenue: 0,
      salesCount: 0,
      stockCount: 0,
      totalInventoryValue: 0,
      orderStatusDistribution: {},
      topProducts: [],
      topCategories: [],
      monthlyRevenue: {},
      lowStockProducts: [],
      averageOrderValue: 0,
      totalOrders: 0,
      paidOrders: 0,
    };
  }

  const conversionRate = analytics.totalOrders > 0 ? (analytics.paidOrders / analytics.totalOrders) * 100 : 0;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-6 p-8 pt-6">
        <Heading title="Dashboard" description="Overview of your store performance" />
        <Separator />
        
        {/* Quick Stats Overview */}
        <QuickStats
          totalRevenue={analytics.totalRevenue}
          salesCount={analytics.salesCount}
          averageOrderValue={analytics.averageOrderValue}
          conversionRate={conversionRate}
          lowStockCount={analytics.lowStockProducts?.length || 0}
          topProductName={analytics.topProducts?.length > 0 ? analytics.topProducts[0]?.name || '' : ''}
        />
        
        {/* Key Metrics Cards */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <AnalyticsCard
            title="Total Revenue"
            value={formatCurrency(analytics.totalRevenue || 0)}
            icon={DollarSign}
            description="All time revenue from paid orders"
          />
          
          <AnalyticsCard
            title="Total Sales"
            value={formatNumber(analytics.salesCount || 0)}
            icon={CreditCard}
            description="Number of completed orders"
          />
          
          <AnalyticsCard
            title="Products in Stock"
            value={formatNumber(analytics.stockCount || 0)}
            icon={Package}
            description="Active products available"
          />
          
          <AnalyticsCard
            title="Average Order Value"
            value={formatCurrency(analytics.averageOrderValue || 0)}
            icon={ShoppingCart}
            description="Average amount per order"
          />
        </div>

        {/* Additional Metrics */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <AnalyticsCard
            title="Total Orders"
            value={formatNumber(analytics.totalOrders || 0)}
            icon={BarChart3}
            description="All orders (paid & pending)"
          />
          
          <AnalyticsCard
            title="Paid Orders"
            value={formatNumber(analytics.paidOrders || 0)}
            icon={TrendingUp}
            description="Successfully paid orders"
          />
          
          <AnalyticsCard
            title="Inventory Value"
            value={formatCurrency(analytics.totalInventoryValue || 0)}
            icon={Warehouse}
            description="Total value of current stock"
          />
          
          <AnalyticsCard
            title="Conversion Rate"
            value={`${conversionRate.toFixed(1)}%`}
            icon={Users}
            description="Orders converted to sales"
          />
        </div>

        {/* Charts and Analytics */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <RevenueChart monthlyRevenue={analytics.monthlyRevenue || {}} />
          <OrderStatus 
            orderStatusDistribution={analytics.orderStatusDistribution || {}}
            totalOrders={analytics.totalOrders || 0}
          />
        </div>

        {/* Top Products and Low Stock */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <TopProducts products={analytics.topProducts || []} />
          <LowStockAlert products={analytics.lowStockProducts || []} />
        </div>

        {/* Top Categories */}
        <div className="grid gap-4 grid-cols-1">
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Categories by Revenue
            </h3>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {(analytics.topCategories || []).map((category, index) => (
                <div key={category.name} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600 rounded-full font-semibold">
                      #{index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{category.name || 'Unknown Category'}</h4>
                      <p className="text-xs text-muted-foreground">
                        {formatNumber(category.productCount || 0)} products
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm">
                      {formatCurrency(category.revenue || 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">Revenue</div>
                  </div>
                </div>
              ))}
              {(!analytics.topCategories || analytics.topCategories.length === 0) && (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground">No category data available yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
