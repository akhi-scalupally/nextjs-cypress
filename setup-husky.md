# Husky Precommit Hook Setup

This project now includes Husky precommit hooks to run Cypress tests before every git commit.

## Initial Setup

After cloning the repository or when setting up husky for the first time, run:

```bash
npm install
npm run prepare
```

The `prepare` script will initialize husky and set up the git hooks.

## What happens on commit

Before each commit, the following will occur:

1. ✅ Your Next.js app will be built in test mode
2. ✅ The app will start on localhost:3000
3. ✅ Cypress tests will run headlessly against the app
4. ✅ If tests pass → commit proceeds
5. ❌ If tests fail → commit is blocked with error message

## Available Test Scripts

- `npm run test:dev:open` - Run tests in development mode with Cypress UI open
- `npm run test:run` - Run tests in development mode headlessly  


## Troubleshooting

If you need to bypass the precommit hook temporarily:

```bash
git commit --no-verify -m "your commit message"
```

Or disable husky entirely:

<!-- ```bash
HUSKY=0 -->
```

## Configuration Files

- `.husky/pre-commit` - Contains the precommit hook script
- `.husky/_/husky.sh` - Husky core functionality
- `package.json` - Contains test scripts and husky prepare command

## Adding Team Members

New team members just need to run `npm install` and the hooks will be automatically set up thanks to the `prepare` script in package.json.
