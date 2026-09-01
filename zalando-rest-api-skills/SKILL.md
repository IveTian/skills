---
name: zalando-rest-api
version: 1.0.0
description: >
  Design and review REST APIs using portable principles derived from the Zalando RESTful API Guidelines.
  Route new API design work to the api-design sub-skill and existing API/OpenAPI review work to the api-review sub-skill.
---

# Zalando REST API Skill

Use this parent skill for REST API design and review tasks.

## Routing

Use `api-design/SKILL.md` when the task involves:

- designing a new REST API
- defining resources and URLs
- selecting HTTP methods and status codes
- request/response schema design
- pagination, filtering, sorting, and embedding
- error models
- idempotency and concurrency
- asynchronous operations
- compatibility, deprecation, or versioning strategy
- creating or improving an OpenAPI contract before implementation

Use `api-review/SKILL.md` when the task involves:

- reviewing an existing API
- reviewing endpoints or an OpenAPI specification
- identifying REST or HTTP semantic problems
- finding backward compatibility risks
- evaluating naming consistency
- checking pagination, idempotency, errors, security boundaries, or evolvability
- producing prioritized findings

If a task contains both design and review work, review the existing contract first, then design the recommended replacement or migration.

## Core Philosophy

Prefer APIs that are:

- API-first
- resource-oriented
- predictable
- explicit
- backward-compatible
- based on standard HTTP semantics
- machine-readable through OpenAPI
- designed from the consumer's domain perspective rather than internal implementation details

Prefer boring, consistent interfaces over clever abstractions.

## Portable vs Zalando-Specific Rules

Apply the portable REST principles by default.

Do not automatically copy Zalando-specific infrastructure conventions such as proprietary headers, internal API identifiers, audiences, hostname conventions, or `X-Flow-ID` unless the user explicitly requests strict Zalando compatibility.

## Decision Priority

When rules conflict, prioritize:

1. correctness
2. security
3. backward compatibility
4. domain clarity
5. standard HTTP semantics
6. consistency
7. developer experience
8. stylistic preference

The goal is not to make an API look RESTful. The goal is to create a stable, understandable, evolvable interface.
