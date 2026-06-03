import { getForecastingResult } from "../service/forecastService.js";

export const forecastingController = async (req, res) => {
  try {
    const userId = req.user.id;
    const forecasting = await getForecastingResult(userId);
    return res.status(200).json({
      success: true,
      data: forecasting,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Forecasting failed",
    });
  }
};