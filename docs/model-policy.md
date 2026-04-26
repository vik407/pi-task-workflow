# Model Policy

Use stronger models where judgment matters. Use cheaper models where facts are already established.

## Phase Policy

| Phase | Model expectation | Reason |
|---|---|---|
| Task initialization | High-reasoning preferred | First assumptions shape the task. |
| Analysis and discovery | High-reasoning required | Root cause and scope errors are costly. |
| Planning | High-reasoning required | Architecture and rollback need judgment. |
| Complex implementation | High-reasoning required | Complex changes need adaptation. |
| Simple implementation | Standard model allowed | Scope is bounded and plan is clear. |
| Validation | Standard model allowed | Commands provide objective evidence. |
| Status summaries | Standard model allowed | No new judgment should be needed. |
| Delta updates | High-reasoning preferred | Requirements may invalidate prior work. |
| PR drafting | Standard model allowed | It summarizes existing artifacts. |

## Rules

- Do not use a weak model for root-cause analysis.
- Do not use a weak model for architecture decisions.
- Validation claims must come from real command output or documented manual checks.
- If uncertainty grows, switch to a stronger model before proceeding.
- If a model cannot verify evidence, it must say so.

## Practical Guidance

Use high reasoning for:

```text
/task-init
/task-analyze
/task-plan
/task-update
/task-implement <TASK-ID> AUTO for COMPLEX tasks
```

Standard models are acceptable for:

```text
/task-status
/task-validate when running deterministic checks
/task-pr
README or changelog formatting
```

## End-of-Phase Suggestions

At the end of each phase, the assistant should suggest the model class for the next phase.

| Completed phase | Next phase | Suggestion rule |
|---|---|---|
| Analysis | Planning | Recommend high-reasoning for `COMPLEX`, low confidence, unclear architecture, or active signals. |
| Planning | Implementation | Recommend high-reasoning for complex, risky, ambiguous, or multi-component work. Standard is acceptable for simple bounded changes. |
| Implementation | Validation | Standard is acceptable for deterministic command checks. High-reasoning if failures or unresolved risks remain. |
| Validation | PR drafting or follow-up | Standard is acceptable when validation passed. High-reasoning if validation failed, was skipped, or risks remain. |
| Delta update | Affected next phase | High-reasoning if scope, architecture, or implementation changed. Standard if cosmetic or documentation-only. |

The assistant must not switch models automatically. It only suggests. The developer decides.

The policy is advisory until enforced by a future Pi extension.
