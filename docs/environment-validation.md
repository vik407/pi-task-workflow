# Environment Validation

CI is useful. It is not the whole truth.

A software lifecycle may include:

1. Local development
2. Development environment
3. Staging
4. Production

Each environment may require different validation.

## Analysis Requirement

During analysis and discovery, identify available environments and validation paths:

- Local commands.
- CI jobs, if present.
- Development environment checks.
- Staging checks.
- Production smoke checks.
- Logs and observability tools.
- Manual QA steps.
- External team validations.
- Release manager or project manager approvals.

## Validation Types

| Type | Examples |
|---|---|
| Local | unit tests, lint, typecheck, build |
| CI | pipeline status, automated test suite, coverage report |
| Development | deployed branch check, service logs, integration smoke test |
| Staging | end-to-end test, product owner review, release candidate validation |
| Production | smoke check, logs, metrics, rollback readiness |
| Manual | console check, browser check, API call, business workflow confirmation |

## Rule

If CI is missing, weak, or unavailable, do not pretend the workflow is invalid.

Instead:

- Record that CI is not available.
- Define the manual or environment-specific validation path.
- Assign open questions or checks to the right owner.
- Let the developer decide whether the evidence is enough.

## Task Artifact Placement

Use:

```text
.pi/workflow/tasks/<TASK-ID>/analysis.md       # environment discovery and validation plan
.pi/workflow/tasks/<TASK-ID>/validation.md     # executed checks and results
.pi/workflow/tasks/<TASK-ID>/context/          # screenshots, logs, links, notes
.pi/workflow/tasks/<TASK-ID>/gate-decisions.md # accepted risks and manual closures
```
