const generateForecastFeatures = (
  transactions
) => {
  const amounts = transactions.map((t) =>
    Number(t.total_harga)
  );
  const lag_1 = amounts[0] || 0;
  const lag_2 = amounts[1] || 0;
  const lag_3 = amounts[2] || 0;
  const recent7 = amounts.slice(0, 7);
  const rolling_mean_7 =
    recent7.length > 0
      ? recent7.reduce((a, b) => a + b, 0) /
        recent7.length
      : 0;
  const recent30 = amounts.slice(0, 30);
  const rolling_mean_30 =
    recent30.length > 0
      ? recent30.reduce((a, b) => a + b, 0) /
        recent30.length
      : 0;
  const now = new Date();
  return {
    lag_1,
    lag_2,
    lag_3,
    rolling_mean_7,
    rolling_mean_30,
    transaction_count:
      transactions.length,
    day_of_week:
      now.getDay(),
    month:
      now.getMonth() + 1,
    is_weekend:
      [0, 6].includes(now.getDay())
        ? 1
        : 0,
    mtd_progress:
      now.getDate() / 30,
  };
};
export default {
  generateForecastFeatures,
};