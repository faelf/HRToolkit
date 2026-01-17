export const formatters = {
  longDate(date) {
    const d = new Date(date);
    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
      weekday: "long",
    };
    return d.toLocaleDateString("en-GB", options);
  },
};
