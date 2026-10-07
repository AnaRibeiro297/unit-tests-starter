import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  workers: 1,
  reporter: "html",
  use: {
    baseURL: "http://localhost:5173",
  },
<<<<<<< HEAD
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
=======
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
>>>>>>> 7bfe146d27f03444e63b5fbe0d4cd1c55fb41f36
  webServer: [
    {
      command: "npm run api:e2e",
      cwd: "..",
      url: "http://localhost:3000/produtos",
<<<<<<< HEAD
      reuseExistingServer: false,
=======
      reuseExistingServer: true,
>>>>>>> 7bfe146d27f03444e63b5fbe0d4cd1c55fb41f36
    },
    {
      command: "npm run dev",
      url: "http://localhost:5173",
<<<<<<< HEAD
      reuseExistingServer: false,
    },
  ],
});
=======
      reuseExistingServer: true,
    },
  ],
});
>>>>>>> 7bfe146d27f03444e63b5fbe0d4cd1c55fb41f36
