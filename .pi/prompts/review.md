---
description: Review repository changes with a focus on bugs, security, and maintainability
argument-hint: "[focus]"
---

Review the current repository changes.

Additional user focus:

$ARGUMENTS

Expected steps:

1. Inspect `git status` and the relevant diffs.
2. Identify bugs, security risks, regressions, and maintainability issues.
3. Point to files and lines when possible.
4. Prioritize findings by impact.
5. Suggest concrete fixes.

Do not modify files during the review unless the user requests it.
