"use client";

import Button from "@/components/ui/button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";

declare global {
  interface Window { Razorpay: any; }
}

// Your backend URL - replace with your actual backend URL
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

const Summary = () => {
  const router = useRouter();
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  const totalPrice = items.reduce((total, item) => {
    return total + Number(item.price);
  }, 0);

  const handlePayment = async () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsLoading(true);

    try {
      // Format order items to match backend expectations
      const orderItems = items.map(item => ({
        product: {
          id: item.id,
          price: Number(item.price)
        },
        quantity: 1
      }));

      // TODO: Replace these with actual user data from your auth system
      const customerData = {
        customerName: "John Doe", // Replace with actual customer name
        customerEmail: "john@example.com", // Replace with actual customer email
        phone: "9999999999", // Replace with actual customer phone
        address: "Customer Address" // Replace with actual customer address
      };

      const res = await fetch(`${BACKEND_URL}/api/checkout`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          storeId: "your-store-id", // TODO: Replace with your actual store ID
          orderItems,
          ...customerData
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Backend error response:", errorText);
        throw new Error(errorText || "Failed to create order");
      }

      const data = await res.json();
      console.log("Backend response:", data);

      // Initialize Razorpay with backend response
      const options = {
        key: data.key,
        amount: data.amount * 100, // amount in paise
        currency: data.currency,
        name: data.name,
        description: data.description,
        order_id: data.razorpayOrderId,
        handler: async (response: any) => {
          try {
            console.log("Payment response:", response);

            const verifyRes = await fetch(`${BACKEND_URL}/api/orders/${data.orderId}/confirm`, {
              method: "POST",
              headers: { 
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            if (!verifyRes.ok) {
              const errorText = await verifyRes.text();
              console.error("Verification error response:", errorText);
              throw new Error(errorText || "Payment verification failed");
            }

            toast.success("Payment successful!");
            removeAll(); // Clear the cart
            router.push("/orders"); // Redirect to orders page
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error(error instanceof Error ? error.message : "Payment verification failed");
          }
        },
        prefill: data.prefill,
        theme: {
          color: "#EE6470"
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Checkout error details:", error);
      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch")) {
          toast.error("Cannot connect to the server. Please check your internet connection or try again later.");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
      <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-base font-medium text-gray-900">Order Total</div>
          <Currency value={totalPrice} />
        </div>
      </div>
      <Button 
        onClick={handlePayment}
        disabled={items.length === 0 || isLoading}
        className={`w-full mt-6 ${(items.length === 0 || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isLoading ? 'Processing...' : items.length === 0 ? 'Cart is Empty' : 'Pay Now'}
      </Button>
    </div>
  );
};

export default Summary; 