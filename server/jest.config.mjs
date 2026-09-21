// Jest Configuration file for ES Modules (Native ESM support)
// Hindi Comment: Jest configuration file jisme ES modules aur node environment setup kiya gaya hai

export default {
  // Test environment ko node set kiya backend testing ke liye
  testEnvironment: 'node',

  // ES Modules ko bina kisi babel transform ke natively run karne ke liye transform empty object rakha hai
  transform: {},

  // Test files matching pattern - 'tests' directory ke andar sabhi .test.js files run hongi
  testMatch: ['**/tests/**/*.test.js'],

  // Verbose output taaki har individual test case ka result clearly terminal pe dikhe
  verbose: true,

  // Database setup aur in-memory server startup ke liye timeout 30 seconds set kiya
  testTimeout: 30000,

  // Code coverage collect karne ki configuration
  collectCoverageFrom: [
    'controllers/**/*.js',
    'middlewares/**/*.js',
    'routes/**/*.js',
    '!**/node_modules/**',
  ],
};
