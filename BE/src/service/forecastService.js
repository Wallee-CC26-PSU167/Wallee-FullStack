import redisClient from "../config/redis.js";

const runForecastingModel = async (userId) => {
  console.log("RUN AI FORECASTING");
  // simulasi delay AI
  await new Promise((resolve) => setTimeout(resolve, 3000));
  // nanti ini diganti response asli dari service AI
  return {
    user_id: userId,
    forecast_month: "2026-06",
    predicted_expense: 3150000,
    last_month_expense: 2900000,
    change_percentage: 8.62,
  };
};

export const getForecastingResult = async (userId) => {
  try {
    const cacheKey = `forecast:${userId}`;
    // cek cache redis
    const cachedForecast = await redisClient.get(cacheKey);
    // jika cache ada
    if (cachedForecast) {
      console.log("FORECAST FROM REDIS");

      return JSON.parse(cachedForecast);
    }
    // generate forecasting dari AI
    const forecastingResult = await runForecastingModel(userId);
    // simpan ke redis selama 1 hari
    await redisClient.set(
      cacheKey,
      JSON.stringify(forecastingResult),
      {
        EX: 86400,
      }
    );
    console.log("FORECAST FROM AI");
    return forecastingResult;
  } catch (error) {
    throw error;
  }
};