// Import pages
import { DashboardPage } from "./HomePage.js";
import { ProbationPage } from "./ProbationPage.js";
import { MaternityPage } from "./MaternityPage.js";
import { AnnualLeavePage } from "./AnnualLeave.js";
import { SalaryPage } from "./Salary.js";
import { OnboardingPage } from "./Onboarding.js";
import { CandidateDetails } from "./CandidateDetails.js";
import { SettingsPage } from "./Settings.js";

// Combine all pages into the pageContent object
export const pageContent = {
  home: DashboardPage,
  probation: ProbationPage,
  maternity: MaternityPage,
  annualLeave: AnnualLeavePage,
  salary: SalaryPage,
  onboarding: OnboardingPage,
  candidatedetails: CandidateDetails,
  settings: SettingsPage,
};
