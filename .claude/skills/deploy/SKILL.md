---
name: deploy
description: Deploy the Finance Tracker to staging - run the tests, build the production bundle, and push to the staging branch. Use when the user asks to deploy, ship, or push to staging.
disable-model-invocation: true
---

# Deploy to staging

Run these steps in order. If any step fails, stop, show the user the error output, and do not continue to the next step.

## 1. Run the tests

- If `package.json` has a `test` script, run `npm test`.
- The project has no test suite yet, so if there is no `test` script, run `npm run lint` instead and tell the user that lint was the only check run.

## 2. Build the production bundle

Run `npm run build`. It must finish without errors and produce `dist/`. The warning about chunks over 500 kB is expected and doesn't block the deploy.

## 3. Push to staging

Staging is the `staging` branch on `origin`.

1. Run `git status`. If there are uncommitted changes, stop and ask the user whether to commit them first. Never commit for them without asking.
2. Show the user which commits will go to staging: `git fetch origin` and then `git log --oneline origin/staging..HEAD` (if `origin/staging` doesn't exist yet, say that the branch will be created).
3. Ask the user to confirm before pushing.
4. Push the current commit to staging: `git push origin HEAD:staging`. Never force-push. If the push is rejected, report it and stop.

## 4. Report

Tell the user what ran (tests or lint), whether the build passed, and which commit is now on `staging`.
