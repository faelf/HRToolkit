// Import pages
import { HomePage } from "./HomePage.js";
import { ProbationPage } from "./ProbationPage.js";
import { MaternityPage } from "./MaternityPage.js";
import { AnnualLeavePage } from "./AnnualLeave.js";
import { SalaryPage } from "./Salary.js";

// Combine all pages into the pageContent object
export const pageContent = {
  home: HomePage,
  probation: ProbationPage,
  maternity: MaternityPage,
  annualLeave: AnnualLeavePage,
  salary: SalaryPage,
};
