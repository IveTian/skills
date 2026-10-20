---
name: saas-ux-writing
description: Write and review concise, product-native UX copy for SaaS, developer tools, AI agents, dashboards, settings, onboarding, permissions, errors, empty states, billing, and destructive actions. Use when creating or editing UI labels, buttons, helper text, status messages, dialogs, forms, notifications, or product terminology so the language feels like a modern SaaS product rather than internal engineering language, literal translation, marketing copy, or AI-generated jargon.
metadata:
  author: Patrick Tien + OpenAI
  version: "1.0.0"
---

# SaaS UX Writing

Write interface copy that feels native to a modern SaaS product: direct, calm, specific, compact, and consistent.

This skill synthesizes recurring language patterns observed in Linear, Vercel, Stripe, GitHub, and Slack. Do not imitate any one brand mechanically. Apply the shared principles, then adapt to the product's own terminology, users, and risk level.

## Use this skill for

- buttons, menus, tabs, labels, placeholders, helper text
- empty states, onboarding, setup, upgrade prompts
- errors, warnings, success, loading, queued states
- settings, permissions, roles, invitations
- billing, subscriptions, usage, invoices, payments
- developer tools, deployments, API keys, webhooks, repositories
- AI agents, runs, tasks, tool calls, approvals, queues, sessions
- reviewing frontend copy for inconsistency, jargon, or translation-like phrasing

Do not use it as the primary guide for long-form marketing, legal copy, or general documentation unless the request is specifically about interface language.

## Goal

Optimize for user comprehension and action, not technical completeness.

A user should quickly understand:

1. What is this thing?
2. What happened or will happen?
3. What can I do next?

If copy explains implementation details but fails one of these, rewrite it.

## Core rules

### Lead with the user's action or object

Prefer a concrete verb plus a stable product object.

Use:
- Create project
- Add member
- Save changes
- Redeploy
- Archive issue
- Cancel subscription
- Run agent

Avoid:
- Initiate project creation
- Perform member addition
- Execute configuration save
- Trigger redeployment process
- Subscription cancellation operation

Do not nominalize a simple action when a verb works.

### Keep the object model stable

One product concept gets one canonical name.

Do not casually alternate between:
- run / execution / task / job / session
- workspace / organization / team / account
- member / user / collaborator / participant
- secret / credential / token / API key

Before writing a new term, inspect nearby UI, code, schema, routes, existing copy, or the supplied glossary. Reuse the established term unless there is a real semantic distinction.

If multiple terms are genuinely different, make the distinction teachable in one sentence.

### Hide implementation vocabulary unless users need it

Translate internal system concepts into product concepts.

Prefer:
- Your run is queued.
- Couldn't connect to GitHub.
- This project no longer exists.
- You don't have access to this workspace.

Avoid:
- Execution instance entered pending state.
- OAuth provider handshake failed.
- Resource lookup returned null.
- Authorization policy rejected this operation.

Keep technical terms when the audience is expected to act on them, such as webhook, DNS record, environment variable, API key, branch, or deployment.

### Use plain language, not enterprise-software language

Prefer common words:
- use, not utilize
- start, not initiate
- change, not modify
- help, not facilitate
- before, not prior to

Inspect abstract nouns such as operation, functionality, configuration, execution, process, mechanism, capability, resource, entity, and instance. Keep them only when they are the clearest accurate term.

### Make controls predict outcomes

Buttons should describe what the click does.

Good:
- Save
- Create workspace
- Send invite
- Retry
- Redeploy
- Delete project
- Cancel subscription

Weak when context is ambiguous:
- Continue
- Submit
- Confirm
- Proceed
- Click here
- Execute

A generic label is acceptable only when the immediate context makes the outcome obvious.

### Use sentence case

Prefer `Create project`, `Environment variables`, `Save changes`.

Preserve established product names and acronyms.

### Be concise, but never vague

Remove words that do not change the user's decision.

Prefer:
- No deployments yet
- Add a domain to get started.

Avoid:
- There are currently no deployments available to display at this time.

Short UI copy is not telegram language. Keep words that make a sentence natural and unambiguous.

### Put important information first

For status, warning, and error copy, begin with the consequence or state the user cares about.

Prefer:
- Deployment failed. Check the build logs and try again.
- Payment failed. Ask the customer to use another payment method.

Avoid:
- An error occurred while the system was attempting to process the deployment request.

### Do not over-celebrate routine success

Use success copy only when confirmation is useful.

Prefer:
- Changes saved
- Invite sent
- Deployment started

Avoid:
- Success! Your changes have been successfully saved!
- Awesome! Your deployment has been initiated successfully.

Usually remove `successfully` when the state already communicates success.

### Do not blame the user

Describe conditions neutrally.

Prefer:
- That email address is already in use.
- Enter a valid domain.
- You need Owner access to change this setting.

Avoid:
- You entered an invalid email.
- You are not allowed to perform this operation.
- You failed to provide a valid domain.

## Surface-specific rules

Use `references/patterns.md` when the task involves a concrete UI surface. Key rules:

- Navigation: use stable nouns such as Projects, Deployments, Members, Billing, Usage, Settings.
- Flow titles: use task language such as Create project, Invite members, Set up webhook.
- Fields: label the data concept; use helper text for consequences or unfamiliar concepts.
- Placeholders: show examples or expected format; never replace the label.
- Empty states: say what is missing, why it matters if non-obvious, and give the next action.
- Loading: name the actual state such as Deploying…, Run queued, Waiting for approval.
- Errors: state what failed, explain the cause if known and useful, then give recovery.
- Validation: be specific and local to the field.
- Permissions: say which role/access is required and what the user can do next.
- Destructive actions: name the object and irreversible consequence; repeat the destructive verb in the confirmation action.
- Billing: be explicit about money, dates, renewal, cancellation, and access.
- Onboarding: guide toward the next meaningful product state, not internal setup stages.

## Agent and DevTool language

AI and developer products are especially prone to leaking internal vocabulary. Apply these rules aggressively.

### Default Agent ontology

If the product has no established glossary, start with:

- Agent: the configured actor
- Run: one execution of an agent toward a goal
- Task: a unit of work, only if the product truly exposes tasks
- Tool call: one call from the agent to a tool
- Approval: a user decision required before a sensitive action
- Queue: work waiting to start
- Session: persisted conversational context only when persistence matters to users
- Message: one user/agent conversational turn

Do not use `execution`, `invocation`, `job`, and `run` interchangeably.

### Run states

Recommended default labels:

- Queued
- Running
- Waiting for approval
- Completed
- Stopped
- Failed

Use `Completed`, not `Execution succeeded`.
Use `Stopped`, not `Terminated`, unless termination has a distinct technical meaning.

### Tool calls

Prefer:
- Called `search_web`
- Running `npm test`
- Updated `config.ts`
- Waiting for permission to access GitHub

Avoid:
- Tool invocation initiated
- Function execution completed successfully
- External capability call pending authorization

### Agent errors

Expose the layer users can act on.

Prefer:
- GitHub returned an error. Reconnect GitHub and try again.
- The run exceeded its time limit.
- The agent couldn't find `config.ts`.

Keep raw provider, harness, stack, and protocol details behind `View details`, `Logs`, or an expandable technical section unless they are directly actionable.

### Approvals

State the proposed action and scope.

Good:
- Allow this run to deploy to production?
- The agent wants to delete 3 files.
- Allow once / Deny

Weak:
- Approve requested capability?
- Authorize operation

## Brand-derived tendencies

Use these as tendencies, not imitation targets. Read `references/product-language-benchmarks.md` for detailed observations and official source links.

### Linear

Borrow:
- stable object names
- compact action labels
- minimal routine explanation
- direct create/add/edit/archive/delete verbs
- strong resistance to synonym drift

Best fit: productivity, project management, structured work.

### Vercel

Borrow:
- developer-native nouns without over-explaining them
- short settings labels
- add/import/deploy/redeploy/save verbs
- failure + troubleshooting pairing
- explicit explanation of when configuration changes take effect

Best fit: infrastructure, deployment, developer tooling.

### Stripe

Borrow:
- precise domain nouns
- explicit timing, money, and lifecycle consequences
- create/add/review/finalize/send/cancel verbs
- explicit destructive labels
- progressive disclosure for advanced settings

Best fit: billing, finance, configuration, high-stakes flows.

### GitHub

Borrow:
- plain language and active voice
- terminology from the product itself
- user-goal-oriented explanations
- enough context for mixed expertise levels
- strong warnings and explicit confirmation for irreversible actions

Best fit: developer products serving novice through expert users.

### Slack

Borrow:
- active-voice button labels that describe outcomes
- common, globally understandable words
- conventional action pairs where convention reduces thinking
- specific destructive labels instead of ambiguous `Cancel`
- restrained use of primary/danger emphasis

Best fit: collaboration and conversational workflows.

## Rewrite workflow

### 1. Identify the surface

Classify the copy: navigation, action, form, helper text, empty state, status, error, permission, destructive confirmation, onboarding, billing, or agent/tool activity.

### 2. Identify the user's goal

Rewrite the internal requirement in plain user language before drafting.

Example:
- Internal: `Persist OAuth credential for repository provider`
- User goal: `Connect GitHub so this product can access repositories`

Draft from the user goal.

### 3. Resolve terminology

Extract canonical nouns from existing product context.

If `workspace` and `organization` both appear, verify whether they are distinct before writing either. Do not create a synonym just because it sounds nicer.

### 4. Draft the shortest accurate version

Start with the smallest useful phrase or sentence. Add context only when it changes understanding, confidence, or action.

### 5. Check consequence and recovery

For errors, warnings, permissions, billing, and destructive actions, verify that the user understands what happens next.

### 6. Remove AI-writing artifacts

Usually rewrite or delete:
- successfully
- kindly
- simply
- seamlessly
- effortlessly
- leverage
- utilize
- initiate
- perform an operation
- in order to
- at this time
- excessive exclamation marks

Use `please` only when courtesy is genuinely useful, not as default UI filler.

### 7. Read it inside the UI

A button does not need to repeat its modal title. Helper text does not need to repeat its label. A toast does not need to explain what the page already shows.

## Review checklist

Before returning final copy, verify:

- Every product object has one name.
- Buttons predict outcomes.
- Internal terms are hidden unless useful.
- Important information comes first.
- Errors include a next step when one exists.
- Destructive actions name the affected object.
- Permission copy explains the required role or next action.
- Billing copy is explicit about amount and timing.
- Routine success copy is calm and short.
- No fake cause has been invented.
- No unnecessary synonym was introduced.
- No sentence sounds like an API/database model translated into prose.
- The copy can be understood without knowing the underlying architecture.

## Output behavior

When the user asks only for copy, return the finished copy first. Do not bury it under a style lecture.

When reviewing existing copy, preserve established product nouns unless changing them is necessary. If terminology conflicts, identify the conflict and recommend one canonical term.

When multiple surfaces are involved, group output by component or surface, not by abstract writing principle.

When implementation context is available, inspect relevant UI/code strings before inventing new terminology.

If the product has an explicit voice-and-tone guide or glossary, that guide overrides this skill's stylistic defaults while the clarity and consistency rules still apply.
