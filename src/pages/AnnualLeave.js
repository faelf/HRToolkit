import AnnualLeaveHTML from "../html/annualleave.html?raw";

export const AnnualLeavePage = {
  title: "HR Toolkit - Annual Leave",
  html: AnnualLeaveHTML,
  setup() {
    const DomElements = {
      Form: document.querySelector("#pro-rated"),
      Results: document.querySelector("#results"),
      StartDate: document.querySelector("#start-date"),
      EndDate: document.querySelector("#end-date"),
      AnnualEntitlement: document.querySelector("#annual-entitlement"),
    };

    function showresults(event, elements) {
      event.preventDefault();
      console.log(elements.Form);
    }

    DomElements.Form.addEventListener("submit", function (event) {
      showresults(event, DomElements);
    });
  },
};
