export const formatCurrency = (amount: number) => {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  } catch (error) {
    return '₹0';
  }
};

export const formatNumber = (num: number) => {
  try {
    return new Intl.NumberFormat('en-IN').format(num || 0);
  } catch (error) {
    return '0';
  }
};

export const getStatusColor = (status: string) => {
  if (!status) return 'bg-gray-100 text-gray-800';
  
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusIcon = (status: string) => {
  if (!status) return '❓';
  
  switch (status.toLowerCase()) {
    case 'completed':
      return '✅';
    case 'processing':
      return '⏳';
    case 'pending':
      return '⏸️';
    case 'failed':
      return '❌';
    default:
      return '❓';
  }
};

export const getMonthName = (monthString: string) => {
  try {
    if (!monthString || !monthString.includes('-')) return 'Unknown';
    
    const [year, month] = monthString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  } catch (error) {
    return 'Unknown';
  }
};

export const getPercentageChange = (current: number, previous: number) => {
  try {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  } catch (error) {
    return 0;
  }
};

export const getTrendIcon = (percentage: number) => {
  if (percentage > 0) return '↗️';
  if (percentage < 0) return '↘️';
  return '→';
};

export const getTrendColor = (percentage: number) => {
  if (percentage > 0) return 'text-green-600';
  if (percentage < 0) return 'text-red-600';
  return 'text-gray-600';
}; 