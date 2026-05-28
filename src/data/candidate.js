export const CandidateScheme = {
  PersonalInformation: {
    FirstName: {
      input: "text",
      id: "first-name",
      label: "First Name",
      helper: "Please enter as shown on the passport",
    },
    LastName: {
      input: "text",
      id: "last-name",
      label: "Last Name",
      helper: "Please enter as shown on the passport",
    },
  },
  EmploymentInformation: {
    JobTitle: {
      input: "text",
      id: "job-title",
      label: "Job Title",
    },
    Department: {
      input: "text",
      id: "department",
      label: "Department",
    },
    HiringManager: {
      input: "text",
      id: "hiring-manager",
      label: "Hiring Manager",
    },
    StartDate: {
      input: "date-input",
      id: "start-date",
      label: "Start Date",
    },
  },
  OnboardingProgress: {
    RightToWork: {
      input: "select-dropdown",
      id: "right-to-work",
      label: "Right to work",
      options: ["British / Irish", "Skilled Worker Visa", "Visa", "Indefinite Leave to Remain"],
    },
    RightToWorkExpiryDate: {
      input: "date-input",
      id: "rwt-expiry-date",
      label: "Right to work Expiry Date",
    },
    RightToWorkNote: {
      input: "text",
      id: "rtw-note",
      label: "Right to work note",
    },
    DBSIssueDate: {
      input: "date-input",
      id: "dbs-issue-date",
      label: "DBS Issued Date",
    },
    DBSCertificateNumber: {
      input: "text",
      id: "dbs-certificate-number",
      label: "DBS Certificate Number",
    },
    DBSLevel: {
      input: "select-dropdown",
      id: "dbs-level",
      label: "DBS Level",
      options: ["Basic", "Standard", "Enhanced"],
    },
    DBSNote: {
      input: "text",
      id: "dbs-note",
      label: "DBS Note",
    },
    OccupationalHealth: {
      input: "date-input",
      id: "oh",
      label: "Occupational Health",
    },
    References: {
      input: "text",
      id: "references",
      label: "References",
    },
    OnboardingStatus: {
      input: "select-dropdown",
      id: "onboarding-status",
      label: "Onboarding Status",
      options: ["Onboarding", "Completed", "Ready"],
    },
  },
  PostChecks: {
    ADP: {
      input: "checkbox-item",
      id: "adp",
      label: "ADP Setup",
    },
    LearnSpace: {
      input: "checkbox-item",
      id: "learn-space",
      label: "Learn Space Setup",
    },
    NameBadge: {
      input: "checkbox-item",
      id: "name-badge",
      label: "Name Badge",
    },
  },
};
