export const AnnualLeavePage = {
  title: "HR Toolkit - Annual Leave",
  html: /* html */ `
  <section>
    <header class="section-header">
      <h2>Annual Leave</h2>
    </header>
    <article class="section-body">
      <p>Coming Soon ...</p>
    </article>
  </section>

  <section>
    <header class="section-header">
      <h3>Pro Rated Entitlement</h3>
    </header>

    <article class="section-body">
      <div>
        <h4>Calculator</h4>
        <form id="pro-rated">

          <div class="input-item">
            <label for="start-date">Start Date</label>
              <input type="date" id="start-date">
            <div class="input-helper">
              Enter your employment start date
            </div>
          </div>

          <div class="input-item">
            <label for="end-date">End Date</label>
              <input type="date" id="end-date">
            <div class="input-helper">
              Last day of holiday calendar
            </div>
          </div>

          <div class="input-item">
            <label for="annual-entitlement">Annual Entitlement</label>
              <input type="number" id="annual-entitlement" placeholder="202.5">
            <div class="input-helper">
              Enter your annual entitlement in hours
            </div>
          </div>

          <div class="form-btns mb-2">
            <button type="submit" class="btn green">Calculate</button>
            <button type="reset" class="btn yellow">Reset</button>
          </div>
        </form>
      </div>

      <div>
        <h4>Results</h4>
        <div id="results">
          <p>Results will show here.</p>
        </div>
      </div>
    </article>
  </section>
  `,

  setup() {
    const DomElements = {
      Form: document.querySelector("#pro-rated"),
      Results: document.querySelector("#results"),
      StartDate: document.querySelector("#start-date"),
      EndDate: document.querySelector("#end-date"),
      AnnualEntitlement: document.querySelector("#annual-entitlement"),
    };

    function showresults(submit, DomElements) {
      submit.preventDefault();
      console.log(DomElements.Form);
    }

    proratedform.addEventListener("submit", showresults(DomElements));
  },
};
