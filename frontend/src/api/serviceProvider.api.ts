import axios from "./axios"; // your axios instance

export const applyServiceProviderApi = (formData: FormData) => {
  return axios.post("/provider/apply", formData);
};

export const getMyServiceProviderApplicationApi = () =>
  axios.get("/provider/my-application");
