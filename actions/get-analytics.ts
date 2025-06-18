import prismadb from "@/lib/prismadb";

export const getAnalytics = async (storeId: string) => {
  try {
    // Get all orders with items and products
    const orders = await prismadb.order.findMany({
      where: {
        storeId,
      },
      include: {
        orderItems: {
          include: {
            product: {
              include: {
                category: true,
                size: true,
                color: true,
              },
            },
          },
        },
      },
    });

    // Get all products with their order items
    const products = await prismadb.product.findMany({
      where: {
        storeId,
        isArchived: false,
      },
      include: {
        category: true,
        size: true,
        color: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    // Get all categories with their products and order items
    const categories = await prismadb.category.findMany({
      where: {
        storeId,
      },
      include: {
        products: {
          include: {
            orderItems: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    // Calculate total revenue
    const totalRevenue = orders
      .filter((order) => order.isPaid)
      .reduce((total, order) => {
        const orderTotal = order.orderItems.reduce((orderSum, item) => {
          const price = item.product?.price || 0;
          return orderSum + price * item.quantity;
        }, 0);
        return total + orderTotal;
      }, 0);

    // Calculate sales count
    const salesCount = orders.filter((order) => order.isPaid).length;

    // Calculate stock count
    const stockCount = products.length;

    // Calculate total inventory value
    const totalInventoryValue = products.reduce((total, product) => {
      const price = product.price || 0;
      const quantity = product.availableQuantity || 0;
      return total + price * quantity;
    }, 0);

    // Get order status distribution
    const orderStatusDistribution = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Get top selling products
    const productSales = products.map((product) => {
      const totalSold = product.orderItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
      const revenue = product.orderItems.reduce((sum, item) => {
        const itemPrice = item.product?.price || product.price || 0;
        return sum + itemPrice * (item.quantity || 0);
      }, 0);
      return {
        id: product.id,
        name: product.name,
        category: product.category?.name || 'Uncategorized',
        totalSold,
        revenue,
        price: product.price || 0,
        availableQuantity: product.availableQuantity || 0,
      };
    }).sort((a, b) => b.totalSold - a.totalSold);

    // Get top categories by revenue
    const categoryRevenue = categories.map((category) => {
      const revenue = category.products.reduce((sum, product) => {
        return sum + product.orderItems.reduce((itemSum, item) => {
          const itemPrice = item.product?.price || product.price || 0;
          return itemSum + itemPrice * (item.quantity || 0);
        }, 0);
      }, 0);
      return {
        name: category.name,
        revenue,
        productCount: category.products.length,
      };
    }).sort((a, b) => b.revenue - a.revenue);

    // Get revenue by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = orders
      .filter((order) => order.isPaid && order.createdAt >= sixMonthsAgo)
      .reduce((acc, order) => {
        const month = order.createdAt.toISOString().slice(0, 7); // YYYY-MM format
        const orderTotal = order.orderItems.reduce((sum, item) => {
          const price = item.product?.price || 0;
          return sum + price * item.quantity;
        }, 0);
        acc[month] = (acc[month] || 0) + orderTotal;
        return acc;
      }, {} as Record<string, number>);

    // Get low stock products (less than 10 items)
    const lowStockProducts = products
      .filter((product) => (product.availableQuantity || 0) < 10)
      .map(product => ({
        id: product.id,
        name: product.name,
        category: product.category?.name || 'Uncategorized',
        availableQuantity: product.availableQuantity || 0,
        price: product.price || 0,
      }));

    // Get average order value
    const paidOrders = orders.filter((order) => order.isPaid);
    const averageOrderValue = paidOrders.length > 0 
      ? paidOrders.reduce((total, order) => {
          const orderTotal = order.orderItems.reduce((sum, item) => {
            const price = item.product?.price || 0;
            return sum + price * item.quantity;
          }, 0);
          return total + orderTotal;
        }, 0) / paidOrders.length
      : 0;

    return {
      totalRevenue,
      salesCount,
      stockCount,
      totalInventoryValue,
      orderStatusDistribution,
      topProducts: productSales.slice(0, 5),
      topCategories: categoryRevenue.slice(0, 5),
      monthlyRevenue,
      lowStockProducts: lowStockProducts.slice(0, 5),
      averageOrderValue,
      totalOrders: orders.length,
      paidOrders: paidOrders.length,
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    // Return default values if there's an error
    return {
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
}; 