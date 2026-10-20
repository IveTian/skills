# Terminology guardrails

## Preferred action verbs

Prefer concrete verbs that describe a user-visible result:

- add
- archive
- assign
- cancel
- connect
- copy
- create
- delete
- deploy
- disable
- disconnect
- edit
- enable
- import
- invite
- move
- publish
- remove
- rename
- retry
- revoke
- run
- save
- send
- stop
- update
- upload
- view

## Words to inspect before using

These words are not forbidden, but often indicate leaked implementation language or unnecessary abstraction:

- execute
- execution
- initiate
- invocation
- operation
- process
- configuration
- functionality
- mechanism
- capability
- resource
- entity
- instance
- payload
- authorization
- provision
- terminate
- utilize
- facilitate

Ask: Is this the word users use for the thing they are trying to do?

## Common transformations

- `Initiate deployment` -> `Deploy`
- `Execute agent` -> `Run agent`
- `Modify configuration` -> `Edit settings`
- `Credential configuration` -> `Add credentials`
- `Authentication provider` -> `Sign-in provider` or the provider name
- `Execution history` -> `Run history`
- `Terminate execution` -> `Stop run`
- `Authorization required` -> `Approval required` or `You need access`
- `Resource not found` -> name the missing object
- `Operation completed successfully` -> `{Object/action} complete` or omit

## Agent product ontology

Use a glossary per product. If none exists, start with:

Agent — a configured actor that can perform work.
Run — one execution of an agent toward a goal.
Task — a meaningful work unit, only if exposed to users.
Tool — an external capability the agent can use.
Tool call — one attempt to use a tool.
Approval — a user decision required before an action.
Queue — work waiting to start.
Session — a persisted context or conversation only if that persistence matters in the UI.
Message — one conversational turn.

Avoid treating these as synonyms.
