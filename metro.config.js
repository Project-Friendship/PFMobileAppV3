const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
const path = require('path');

// Browser tests render the real UI without requiring a developer's AWS config.
// This resolver is enabled only by Playwright's server environment.
if (process.env.PF_TEST_CONFIG === '1') {
  config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (moduleName === '../aws-exports') {
      return { type: 'sourceFile', filePath: path.join(__dirname, 'tests/fixtures/auth-config.js') };
    }
    return context.resolveRequest(context, moduleName, platform);
  };
}

// Exclude test files from the bundle
config.resolver.blockList = [
  /.*\.test\.(js|jsx|ts|tsx)$/,
  /.*\.spec\.(js|jsx|ts|tsx)$/,
  /__tests__\/.*/
];

module.exports = config;
