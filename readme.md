# PFMobileAppV3 
Collaborators: Josh Meier, Noah Lee, ...

## Set up instructions
1. Git clone
2. Ask Noah or Josh for the aws-exports.js file - put it in the repository root
3. npm ci (Node.js 22)
4. npx expo run:ios - to test application

## Testing
- To run test: `npm test`
- Make unit test: `{filename}.test.tsx`

## Other info:
- The amplify app is 'dev'
- The cognito userpool is the one that begins with 'dev...'
For local development, put your team-provided `aws-exports.js` in the repository
root (next to `package.json`), then run `npm run web`. Use Node.js 22 and `npm ci`
for a reproducible installation. See [testing instructions](tests/testsreadme.md)
for unit and browser tests; browser tests do not need live AWS configuration.
