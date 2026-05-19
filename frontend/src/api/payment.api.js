import api from "./axiosInstance";

export const paymentApi = {
    createOrder: (data) => api.post("/payments/order", data),
    verifyPayment: (data) => api.post("/payments/verify", data),
    getMyPayments: () => api.get("/payments/my-payments"),
    refund: (paymentId) => api.post(`/payments/${paymentId}/refund`),
};