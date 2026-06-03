import api from "./api";

export const getForecast = async () => {
  const response = await api.get(
    "/ai/forecast"
  );

  return response.data;
};