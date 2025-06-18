"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayButtonProps {
  orderId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
}

export const RazorpayButton = ({
  orderId,
  razorpayOrderId,
  amount,
  currency,
}: RazorpayButtonProps) => {
  const router = useRouter();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: amount * 100,
      currency: currency,
      name: "Your Store Name",
      description: "Order Payment",
      order_id: razorpayOrderId,
      handler: async (response: any) => {
        try {
          const res = await fetch(`/api/orders/${orderId}/confirm`, {
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

          if (!res.ok) {
            throw new Error("Payment verification failed");
          }

          toast.success("Payment successful!");
          router.refresh();
          router.push("/orders");
        } catch (error) {
          console.error("Payment verification failed:", error);
          toast.error("Payment verification failed");
        }
      },
      prefill: {
        name: "Customer Name",
        email: "customer@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  return (
    <button
      onClick={handlePayment}
      className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-black/90 transition"
    >
      Pay Now
    </button>
  );
}; 