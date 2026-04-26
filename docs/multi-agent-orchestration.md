# Multi-Agent Orchestration

## Current Position

Pi does not currently document native Claude-style sub-agents as a built-in workflow primitive.

The official Pi documentation does document extension capabilities that may support future orchestration:

- custom commands through `pi.registerCommand()`
- custom tools through `pi.registerTool()`
- session control through extension command contexts
- model changes through `pi.setModel()`
- thinking level changes through `pi.setThinkingLevel()`
- injected user messages through `pi.sendUserMessage()`
- event hooks around agent, model, context, and tool execution

These are enough for command orchestration and guided workflows. They are not the same as true isolated sub-agents with independent context, independent model selection, structured return contracts, and synthesis.

## Workflow Decision

For now, `pi-workflow` treats multi-agent orchestration as a future capability.

Current implementation:

- Prompt templates simulate phase-specific agents.
- Task files provide shared memory.
- Gate scripts enforce structure.
- Model policy suggests model class at phase boundaries.
- The developer remains the final orchestrator.

Future implementation, when Pi documentation and APIs are mature enough:

- A Pi extension may register task commands.
- The extension may orchestrate phase-specific runs.
- The extension may suggest or set model/thinking level with developer approval.
- The extension may collect structured outputs into task artifacts.
- The extension may coordinate parallel analysis folders and synthesize root files.

## Non-Goal

Do not build fragile pseudo-sub-agents that depend on undocumented behavior.

We should not chase fake parity. Use it. Observe it. Improve from real tasks.

If Pi does not document a stable API for a capability, keep it as an open future item.

## Open Future Item

Design a `pi-workflow` extension when official Pi documentation clearly supports the needed orchestration model.

Minimum requirements:

- Stable command API.
- Stable session/message API.
- Safe model suggestion or selection behavior.
- Structured artifact writing.
- Gate integration.
- Developer approval for model changes and risky actions.
