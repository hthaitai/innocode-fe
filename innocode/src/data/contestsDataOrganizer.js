export const contestsDataOrganizer = [
  {
    contest_id: 1,
    year: 2025,
    name: "Python Code Challenge",
    description:
      "Solve algorithmic problems using Python in a competitive environment.",
    status: "draft",
    created_at: "2025-10-01T09:00:00Z",

    rounds: [
      {
        round_id: 101,
        name: "Qualification",
        start: "2025-10-10T09:00:00Z",
        end: "2025-10-10T12:00:00Z",

        problems: [
          {
            problem_id: 1001,
            language: "python3",
            type: "manual",
            penalty_rate: 0.5,
            created_at: "2025-10-05T08:00:00Z",

            test_cases: [
              {
                test_case_id: 5001,
                description: "Basic input check",
                type: "public",
                weight: 1,
                time_limit_ms: 1000,
                memory_kb: 256000,
              },
              {
                test_case_id: 5002,
                description: "Large input edge case",
                type: "hidden",
                weight: 1.5,
                time_limit_ms: 2000,
                memory_kb: 512000,
              },
            ],
          },
          {
            problem_id: 1002,
            language: "python3",
            type: "auto",
            penalty_rate: 0.3,
            created_at: "2025-10-05T08:10:00Z",

            test_cases: [
              {
                test_case_id: 5003,
                description: "Check correct sorting",
                type: "public",
                weight: 1,
                time_limit_ms: 1500,
                memory_kb: 256000,
              },
            ],
          },
        ],
      },
      {
        round_id: 102,
        name: "Final",
        start: "2025-10-15T09:00:00Z",
        end: "2025-10-15T12:00:00Z",
        problems: [],
      },
    ],
  },

  {
    contest_id: 2,
    year: 2025,
    name: "Web Development Sprint",
    description: "Build and deploy a web application in 48 hours.",
    status: "published",
    created_at: "2025-09-25T14:30:00Z",

    rounds: [
      {
        round_id: 201,
        name: "Main Sprint",
        start: "2025-09-28T08:00:00Z",
        end: "2025-09-30T08:00:00Z",

        problems: [
          {
            problem_id: 2001,
            language: "javascript",
            type: "manual",
            penalty_rate: 0.2,
            created_at: "2025-09-25T15:00:00Z",

            test_cases: [
              {
                test_case_id: 6001,
                description: "Basic component rendering",
                type: "public",
                weight: 1,
                time_limit_ms: 2000,
                memory_kb: 256000,
              },
              {
                test_case_id: 6002,
                description: "Responsive layout check",
                type: "hidden",
                weight: 2,
                time_limit_ms: 3000,
                memory_kb: 512000,
              },
            ],
          },
        ],
      },
    ],
  },

  {
    contest_id: 3,
    year: 2024,
    name: "Data Science Hackathon",
    description:
      "Analyze datasets and create predictive models to solve real-world problems.",
    status: "finalized",
    created_at: "2024-12-10T11:15:00Z",

    rounds: [
      {
        round_id: 301,
        name: "Modeling Round",
        start: "2024-12-12T09:00:00Z",
        end: "2024-12-13T18:00:00Z",

        problems: [
          {
            problem_id: 3001,
            language: "python3",
            type: "auto",
            penalty_rate: 0.1,
            created_at: "2024-12-10T13:00:00Z",

            test_cases: [
              {
                test_case_id: 7001,
                description: "Train/test dataset validation",
                type: "public",
                weight: 1,
                time_limit_ms: 5000,
                memory_kb: 1024000,
              },
              {
                test_case_id: 7002,
                description: "Hidden scoring dataset",
                type: "hidden",
                weight: 2,
                time_limit_ms: 7000,
                memory_kb: 2048000,
              },
            ],
          },
        ],
      },
    ],
  },
];
