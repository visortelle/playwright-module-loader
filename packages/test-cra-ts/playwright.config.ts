import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  projects: [
    {
      name: 'Chrome Stable',
      use: {
        browserName: 'chromium',
        channel: 'chrome',
      },
      testDir: './src',
      testMatch: '*.spec.ts'
    }
  ],
};
export default config;
