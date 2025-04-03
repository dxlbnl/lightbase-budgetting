import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	webServer: {
		command: 'pnpm tsx src/db/seed.ts && pnpm run build && pnpm run preview',
		port: 4173
	},
	testDir: 'tests',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/,
	use: { ...devices['Desktop Firefox'] },
	projects: [
		{
			name: 'setup',
			testMatch: /.*\.setup\.ts/,
			teardown: 'teardown'
		},
		{
			name: 'teardown',
			testMatch: /.*\.teardown\.ts/,
			use: { storageState: './playwright/.auth/user.json' }
		},
		{ name: 'tests', dependencies: ['setup'], use: { storageState: './playwright/.auth/user.json' } }
	]
});
