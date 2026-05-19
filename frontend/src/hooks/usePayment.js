import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { paymentApi } from "@/api/payment.api";
import toast from "react-hot-toast";

/**
 * Loads Razorpay checkout script dynamically and opens the payment modal.
 * On success, verifies the payment with our backend.
 */
export const useRazorpayCheckout = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async ({ entityType, entityId, entityModel, amount, name, description }) => {
            // 1. Load Razorpay script if not already loaded
            if (!window.Razorpay) {
                await new Promise((resolve, reject) => {
                    const script = document.createElement("script");
                    script.src = "https://checkout.razorpay.com/v1/checkout.js";
                    script.onload = resolve;
                    script.onerror = () => reject(new Error("Failed to load Razorpay"));
                    document.head.appendChild(script);
                });
            }

            // 2. Create order on our backend
            const orderRes = await paymentApi.createOrder({ entityType, entityId, entityModel, amount });
            const { orderId, amount: amountPaise, currency, keyId } = orderRes.data;

            // 3. Open Razorpay modal
            return new Promise((resolve, reject) => {
                const options = {
                    key: keyId,
                    amount: amountPaise,
                    currency,
                    name: "Legal Olympiad",
                    description,
                    order_id: orderId,
                    prefill: {
                        name: name,
                    },
                    theme: { color: "#4338CA" },
                    modal: {
                        ondismiss: () => reject(new Error("Payment cancelled")),
                    },
                    handler: async (response) => {
                        try {
                            // 4. Verify with our backend
                            const verifyRes = await paymentApi.verifyPayment({
                                razorpayOrderId: response.razorpay_order_id,
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpaySignature: response.razorpay_signature,
                            });
                            resolve(verifyRes.data);
                        } catch (err) {
                            reject(err);
                        }
                    },
                };

                new window.Razorpay(options).open();
            });
        },

        onSuccess: (_, variables) => {
            toast.success("Payment successful! 🎉");
            // Invalidate relevant queries
            qc.invalidateQueries({ queryKey: ["competitions"] });
            qc.invalidateQueries({ queryKey: ["courses"] });
            qc.invalidateQueries({ queryKey: ["payments"] });
        },

        onError: (err) => {
            if (err.message !== "Payment cancelled") {
                toast.error(err.message || "Payment failed");
            }
        },
    });
};

export const useMyPayments = () =>
    useQuery({
        queryKey: ["payments", "mine"],
        queryFn: () => paymentApi.getMyPayments().then((r) => r.data),
    });