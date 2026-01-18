import axios from "./axios";

export const getMyOrdersApi = () => {
  return axios.get("/order/my");
};

export const cancelOrderApi = (orderId: string) => {
  return axios.get(`/order/${orderId}/cancel`);
};

export const returnOrderApi = (orderId: string) => {
  return axios.get(`/order/${orderId}/return`);
};


export const placeOrderApi = (data: {
  items: { product: string; quantity: number }[];
  address?: any;
  phone?: string;
}) => {
  return axios.post("/order", data);
};