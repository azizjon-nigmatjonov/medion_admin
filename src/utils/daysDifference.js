const daysDifference = (startDate, endDate) => {
  return Math.round(
    new Date(new Date(endDate) - new Date(startDate)).getTime() /
      (1000 * 3600 * 24)
  );
};

export default daysDifference;
