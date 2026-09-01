---
name: api-review
description: >
  Review existing REST APIs and OpenAPI specifications using portable principles derived from the Zalando RESTful API Guidelines.
---

# API Review

Use this sub-skill to inspect an existing REST API, endpoint set, or OpenAPI specification.

The review must focus on correctness, HTTP semantics, domain modeling, consistency, compatibility, reliability, security boundaries, and developer experience.

Do not mechanically rewrite established public APIs merely to satisfy style preferences.

## Review Order

Review in this order because earlier issues are usually more important than later stylistic issues.

### 1. Domain Model

Check:

- Are resources meaningful domain concepts?
- Are action-style endpoints hiding resources?
- Are resource boundaries clear?
- Does the public model reflect consumer needs rather than internal database/service structure?

Examples to challenge:

    POST /get-user
    POST /delete-event
    POST /process-order

Prefer resource operations where the domain supports them.

### 2. URLs and Naming

Check:

- plural resource names
- kebab-case paths
- snake_case query parameters
- meaningful resource names
- shallow nesting
- stable identifiers
- no unnecessary trailing slashes
- no meaningless implementation-oriented path segments

Challenge examples such as:

    /event/{id}
    /getAllUsers
    /payment_methods
    /orders?id=123

Do not recommend breaking renames solely for cosmetic consistency in an established public API.

### 3. HTTP Semantics

Check:

- GET is safe
- GET does not intentionally mutate business state
- PUT is idempotent
- DELETE is idempotent from the client's perspective
- POST is used appropriately
- PATCH semantics are explicit
- retries do not create unintended duplicate effects
- status codes match outcomes

Challenge:

    GET /send-email
    GET /orders/create

and APIs that return HTTP 200 for every result.

### 4. Payloads

Check:

- JSON is consistently shaped
- top-level objects are preferred over bare arrays when extensibility matters
- JSON properties use snake_case
- null semantics are clear
- booleans are not unnecessarily nullable
- empty arrays are arrays rather than null
- timestamps use RFC 3339 / ISO 8601
- identifiers are treated as opaque
- enums are evolvable

### 5. Errors

Check:

- errors use appropriate HTTP status codes
- errors are machine-readable
- Problem Details is used or a similarly consistent error model exists
- validation errors contain useful field-level detail
- no stack traces, SQL errors, internal paths, secrets, credentials, or sensitive implementation details are exposed

Challenge patterns such as:

    HTTP 200
    {
      "success": false,
      "error": "order not found"
    }

### 6. Collections

Check:

- large collections are paginated
- page size is bounded
- ordering is stable
- filtering is documented
- sorting is deterministic
- cursor pagination is used when data changes frequently
- exact total counts are only returned when justified

Challenge unbounded list endpoints.

### 7. Reliability

Check:

- retry-sensitive creation supports idempotency where necessary
- idempotency semantics are documented
- optimistic concurrency exists where lost updates matter
- long-running operations use asynchronous resource patterns when appropriate
- rate limiting uses standard semantics
- batch operations clearly define atomicity and partial-success behavior

Retry-sensitive domains include:

- payments
- orders
- bookings
- registrations
- reservations
- provisioning
- jobs

### 8. Authentication and Authorization

Check:

- authentication is distinct from authorization
- permissions/scopes are domain-oriented
- endpoints enforce resource-level authorization where required
- internal role implementation is not leaked accidentally
- sensitive fields cannot be exposed through broad object reuse

Security issues take priority over style issues.

### 9. Evolution and Compatibility

Review every proposed change for breaking impact.

Usually compatible:

- adding optional request fields
- adding response fields
- adding endpoints
- adding optional query parameters

Potentially breaking:

- removing fields
- renaming fields
- changing field types
- making optional inputs required
- changing resource semantics
- narrowing accepted values
- changing validation
- changing default sorting
- changing identifier semantics
- changing status-code semantics

Treat response objects as open for extension.

Flag strict response enums when future values are plausible.

### 10. Versioning and Deprecation

Check whether versioning exists because it is genuinely needed or merely because breaking changes are convenient.

Do not automatically recommend URL versions.

For established APIs already using URL versioning, weigh consistency and migration costs.

For deprecation, check that there is:

- a supported replacement
- a migration path
- usage monitoring
- sufficient migration time
- a sunset strategy when appropriate

### 11. OpenAPI Contract

Check that the specification accurately covers:

- endpoints
- methods
- parameters
- schemas
- request bodies
- response bodies
- status codes
- authentication
- errors
- examples where useful

When reviewing changes, inspect the OpenAPI diff for backward compatibility.

## Severity Model

Every substantive finding should be classified as one of the following.

### MUST FIX

Use when the design:

- violates important HTTP semantics
- creates a security problem
- introduces serious ambiguity
- creates a breaking compatibility issue without a migration plan
- risks data corruption, duplicated business effects, or lost updates
- exposes sensitive internal information

Examples:

- GET mutates business state
- secrets exposed in errors
- authorization boundary is incorrect
- response field type is changed incompatibly
- payment creation can duplicate on retry with no idempotency protection

### SHOULD FIX

Use when the API works but creates unnecessary inconsistency, fragility, operational risk, or poor developer experience.

Examples:

- offset pagination on a highly dynamic collection
- unnecessarily deep nested paths
- action-style endpoint with an obvious resource model
- inconsistent error schema
- missing idempotency on retry-sensitive creation
- ambiguous PATCH omission semantics

### CONSIDER

Use for contextual improvements rather than defects.

Examples:

- optional embedding
- field projection
- ETag support when collisions are uncommon
- asynchronous processing for an operation that may grow slower over time

Do not inflate stylistic preferences into critical findings.

## Existing Public APIs

Backward compatibility usually matters more than cosmetic consistency.

If fixing a convention would be breaking:

1. identify the inconsistency
2. explain the ideal design
3. explain the compatibility impact
4. recommend a migration strategy only if the benefit justifies it

Never recommend a breaking migration solely to change casing, plurality, or URL aesthetics.

## Review Output

Prefer a compact summary first, followed by prioritized findings.

For each finding, provide:

- severity
- affected endpoint/schema
- problem
- why it matters
- recommended design
- whether the fix is breaking

Example:

    MUST FIX — POST /payments

    Problem:
    Retrying the request can create duplicate payments.

    Why it matters:
    The client cannot know whether a timed-out request completed successfully.

    Recommendation:
    Add an explicit idempotency mechanism and define key scope, replay, conflict, and expiration behavior.

    Breaking:
    No, if introduced as an optional request header and existing semantics are preserved.

When useful, show before/after examples.

## Anti-Patterns Checklist

Challenge:

- POST /get-user
- POST /delete-event
- GET /orders/create
- GET /send-email
- /api/v1/getAllUsers
- /event/{id}
- /orders?id=123
- HTTP 200 for every outcome
- ad-hoc error formats per endpoint
- mixed camelCase and snake_case
- unbounded list endpoints
- undocumented filtering
- deeply nested paths
- APIs mirroring database tables directly
- mandatory URL versions without a lifecycle strategy
- breaking changes justified only by internal backend changes

## Review Principle

Prioritize findings in this order:

1. correctness
2. security
3. backward compatibility
4. domain clarity
5. HTTP semantics
6. consistency
7. developer experience
8. stylistic preference

The purpose of the review is to make the API safer and easier to evolve, not to maximize theoretical REST purity.
