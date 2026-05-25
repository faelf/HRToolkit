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
  setMinMaxDates() {
    const dateInputs = document.querySelectorAll(".date-input");

    const today = new Date();

    const minDate = new Date(today);
    minDate.setFullYear(today.getFullYear() - 60);

    const maxDate = new Date(today);
    maxDate.setFullYear(today.getFullYear() + 1);

    const min = minDate.toISOString().split("T")[0];
    const max = maxDate.toISOString().split("T")[0];

    dateInputs.forEach((input) => {
      input.min = min;
      input.max = max;
    });
  },
};
