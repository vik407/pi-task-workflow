# Plan: FXT-0001

## Solution Overview

- **Approach**: Use a minimal Node.js project with real source and tests.
- **Alignment Rationale**: This hardens the workflow beyond synthetic task artifacts.

## Solution Architecture

- **Design Approach**: Small ES module with Node.js built-in test runner.
- **Integration Strategy**: Root workflow script invokes fixture-local tests and gates.

## Implementation Phases

### Phase 1: Fixture project

- **Objectives**: Provide real source code and tests.
- **Technical Tasks**: Add `src/calculator.mjs`, `test/calculator.test.mjs`, and fixture task artifacts.
- **Validation**: Run `npm test` and task gates.

## Quality Assurance

- **Testing Strategy**: Use `npm test` with Node.js built-in test runner.
- **Environment Validation Plan**: Local fixture only.
- **Coverage Plan**: Test add, divide, and division-by-zero behavior.
- **Success Criteria**: Fixture tests and all task gates pass.
- **Risk Mitigation**: Keep fixture small and deterministic.
- **Rollback Plan**: Remove `fixtures/sample-node-project`.

## Signals

No active signals.

## Implementation Checklist

- [x] [Phase 1 - Step]: Add fixture source code.
- [x] [Phase 1 - Step]: Add fixture tests.
- [x] [Phase 1 - Step]: Add fixture task artifacts.
- [x] [Phase 1 - Validation]: Run fixture tests.
- [x] Final integration validation.
