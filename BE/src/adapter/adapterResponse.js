const adaptForecastResponse = ({
  aiResponse,
  lastMonthExpense,
}) => {

  const predictedExpense =
    Number(
      aiResponse.forecast_next_month || 0
    );

  let changePercentage = 0;

  if (lastMonthExpense > 0) {
    changePercentage =
      (
        (
          predictedExpense -
          lastMonthExpense
        ) /
        lastMonthExpense
      ) * 100;
  }

  return {
    forecast_month: new Date()
      .toISOString()
      .slice(0, 7),

    predicted_expense:
      predictedExpense,

    last_month_expense:
      lastMonthExpense,

    change_percentage:
      Number(
        changePercentage.toFixed(2)
      ),

    trend_direction:
      predictedExpense >=
      lastMonthExpense
        ? "up"
        : "down",

    confidence: {
      lower: Number(
        aiResponse.confidence_lower || 0
      ),

      upper: Number(
        aiResponse.confidence_upper || 0
      ),
    },
  };
};

export default {
  adaptForecastResponse,
};