import axios from "axios";

const predictForecast = async (payload) => {
    console.log("isi payload : ", payload);
  const response = await axios.post(
    process.env.AI_FORECAST_URL,
    payload
  );

  return response.data;
};

export default {
  predictForecast,
};