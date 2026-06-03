import forecastRepo from "../repositories/forecastRepository.js";
import forecastHelper from "../helper/forecastHelper.js";
import forecastService from "../service/forecastService.js";
import forecastAdapter from "../adapter/adapterResponse.js";

const getForecast = async (
  req,
  res
) => {
  try {
    const userId = req.user.id;
    const transactions =
      await forecastRepo.getExpenseHistory(
        userId
      );

    if (transactions.length < 3) {
      return res.status(200).json({
        success: true,
        message:
          "Not enough data for forecasting",
        data: {
          forecast_month: new Date()
            .toISOString()
            .slice(0, 7),
          predicted_expense: 0,
          last_month_expense: 0,
          change_percentage: 0,
        },
      });
    }

    const features =
      forecastHelper.generateForecastFeatures(
        transactions
      );
    const aiResponse =
      await forecastService.predictForecast(
        features
      );
    const lastMonthExpense =
      await forecastRepo.getLastMonthExpense(
        userId
      );
    const forecast =
      forecastAdapter.adaptForecastResponse({
        aiResponse,
        lastMonthExpense,
      });
    return res.status(200).json({
      success: true,
      message:
        "Forecast retrieved successfully",
      data: forecast,
    });
  } catch (error) {
    console.error(
      "Forecast error:",
      error.message
    );
    return res.status(500).json({
      success: false,
      message:
        "Failed to get forecast",
      data: null,
    });
  }
};

export default {
  getForecast,
};