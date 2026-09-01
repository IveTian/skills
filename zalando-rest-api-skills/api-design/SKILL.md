---
name: api-design
description: >
  Design new REST APIs and OpenAPI contracts using portable principles derived from the Zalando RESTful API Guidelines.
---

# API Design

Use this sub-skill when creating or materially redesigning a REST API.

## Workflow

Design in this order:

1. Identify consumers and use cases.
2. Identify domain resources.
3. Define resource relationships.
4. Define operations on resources.
5. Define schemas and error models.
6. Define pagination, filtering, sorting, and concurrency where needed.
7. Define reliability behavior such as retries and idempotency.
8. Define compatibility and lifecycle expectations.
9. Write or update the OpenAPI contract.
10. Only then implement the service.

Do not let database tables, ORM models, controller names, microservice boundaries, or internal architecture dictate the public API.

## API First

REST APIs MUST have an OpenAPI specification.

Prefer OpenAPI 3.1 for new APIs unless the surrounding platform requires another version.

The contract should define:

- paths and methods
- parameters
- request bodies
- response bodies
- status codes
- error responses
- authentication
- schemas
- examples where useful

Treat OpenAPI as the API contract, not generated documentation after implementation.

## Resource-Oriented Design

Model APIs around meaningful domain resources rather than actions.

Prefer:

    POST /orders

instead of:

    POST /create-order

Prefer:

    DELETE /orders/{order_id}

instead of:

    POST /delete-order

Prefer:

    PATCH /orders/{order_id}

instead of:

    POST /update-order

When an apparent action is required, first ask whether it can be modeled as a resource or state transition.

For example, cancellation could be modeled as:

    PATCH /orders/{order_id}

with:

    {
      "status": "CANCELLED"
    }

or as a dedicated resource:

    POST /orders/{order_id}/cancellations

Choose the model that best matches the domain. Do not distort the domain merely to eliminate every verb.

## Naming

Use plural resource names.

Good:

    /users
    /orders
    /payment-methods

Use kebab-case for path segments.

Good:

    /payment-methods
    /event-registrations

Use snake_case for query parameters and JSON properties.

Good:

    ?created_after=...
    ?page_size=50

    {
      "created_at": "2026-09-01T12:30:00Z"
    }

Prefer UPPER_SNAKE_CASE for enum values.

    PAYMENT_PENDING
    CANCELLED

Use U.S. English for API-facing names unless the product explicitly requires another language convention.

Avoid vague implementation-oriented names such as:

    /items
    /objects
    /database-records
    /order-service

## Paths and Hierarchy

Use paths for resource identity and meaningful sub-resource relationships.

Example:

    /events/{event_id}/registrations

Avoid unnecessarily deep nesting.

If a child resource has a globally unique identifier, prefer a shallow direct path for retrieving it:

    /registrations/{registration_id}

rather than repeating the full hierarchy.

Avoid trailing slashes.

Avoid meaningless `/api` prefixes unless required by infrastructure or established product convention.

## Query Parameters

Use query parameters for:

- filtering
- searching
- sorting
- pagination
- field selection
- optional embedding

Prefer:

    GET /orders/{order_id}

instead of:

    GET /orders?id={order_id}

for fundamental resource identity.

## JSON

Use JSON by default unless another media type is more appropriate.

Prefer top-level JSON objects rather than bare arrays.

Prefer:

    {
      "items": [...],
      "next_cursor": "..."
    }

instead of:

    [...]

This leaves room for compatible additions.

Be deliberate about null semantics.

Prefer:

    "enabled": false

instead of nullable booleans.

Prefer:

    []

instead of:

    null

for empty arrays.

## Dates and Times

Use RFC 3339 / ISO 8601 timestamps.

Example:

    2026-09-01T12:30:00Z

Use clear timestamp field names such as:

    created_at
    updated_at
    starts_at
    expires_at

Make timezone semantics explicit.

## Identifiers

Treat IDs as opaque to consumers.

Clients MUST NOT infer business meaning from the structure of an identifier.

Choose identifiers according to system needs rather than automatically defaulting to UUIDs.

## HTTP Methods

### GET

Use for retrieval.

GET MUST NOT intentionally mutate business state.

GET should be safe and idempotent.

### POST

Use for resource creation or non-idempotent operations.

Collection creation commonly returns:

    201 Created

Return a `Location` header when useful.

### PUT

Use to replace or create a resource at a client-known URI.

PUT is idempotent.

Do not use PUT for generic partial updates.

### PATCH

Use for partial updates.

Define omitted-field semantics explicitly.

Clients must not have to guess whether omission means unchanged, deleted, reset, or null.

Make PATCH idempotent where practical.

### DELETE

Use for deletion.

DELETE should be idempotent from the consumer's perspective.

## Status Codes

Use standard HTTP status codes.

Typical success codes:

    200 OK
    201 Created
    202 Accepted
    204 No Content

Typical client errors:

    400 Bad Request
    401 Unauthorized
    403 Forbidden
    404 Not Found
    409 Conflict
    412 Precondition Failed
    422 Unprocessable Content
    429 Too Many Requests

Typical server errors:

    500 Internal Server Error
    502 Bad Gateway
    503 Service Unavailable
    504 Gateway Timeout

Do not return `200 OK` with an application-level error hidden in the body.

## Errors

Use structured machine-readable errors.

Prefer Problem Details compatible with:

    application/problem+json

Example:

    {
      "type": "https://example.com/problems/invalid-order-state",
      "title": "Invalid order state",
      "status": 409,
      "detail": "A cancelled order cannot be paid.",
      "instance": "/orders/ord_123"
    }

For validation errors, include structured field-level details where useful.

Never expose stack traces, SQL errors, filesystem paths, secrets, credentials, or sensitive implementation details.

## Pagination

Collections that can grow significantly MUST support pagination.

Prefer cursor-based pagination for large or frequently changing collections.

Example:

    GET /events?page_size=50&cursor=abc123

Response:

    {
      "items": [...],
      "next_cursor": "def456"
    }

Use offset pagination only when its tradeoffs are acceptable, such as small admin datasets, analytics, or random page access.

Always define a maximum page size.

Avoid exact total counts unless consumers genuinely need them.

## Filtering and Sorting

Use query parameters for simple filters.

Example:

    GET /events?status=PUBLISHED&city=tokyo

Document implicit filters.

When sorting matters, define:

- supported fields
- ascending/descending syntax
- default order
- deterministic tie breaking

Cursor pagination requires stable ordering.

## Field Selection and Embedding

For large resources, optional field projection may be useful:

    ?fields=id,name,status

When round trips are expensive, optionally allow related resources to be embedded:

    ?embed=venue,organizer

Avoid uncontrolled recursive expansion.

Do not introduce projection or embedding complexity unless it provides real value.

## Idempotency

Design explicit idempotency for retry-sensitive operations such as:

- payments
- orders
- bookings
- registrations
- reservations
- provisioning
- job creation

For POST operations, an idempotency key may be accepted through an appropriate header.

Define:

- key scope
- expiration
- replay behavior
- conflict behavior
- concurrency behavior

Do not claim an operation is idempotent unless its observable business effects satisfy that property.

## Concurrency

For resources that may be edited concurrently, consider optimistic concurrency using standard HTTP mechanisms:

    ETag
    If-Match
    If-None-Match

Reject stale writes rather than silently overwriting newer changes when lost updates matter.

## Asynchronous Operations

Do not keep HTTP connections open for long-running work unnecessarily.

Prefer creating an operation/job resource.

Example:

    POST /exports

returns:

    202 Accepted

and a resource such as:

    /exports/{export_id}

Possible states:

    PENDING
    RUNNING
    SUCCEEDED
    FAILED

## Rate Limiting

Use:

    429 Too Many Requests

when an enforced rate limit is exceeded.

Provide standard retry/rate-limit information where applicable.

## Batch Operations

Only add batch endpoints when they provide meaningful efficiency or transactional value.

Define whether the operation is:

- atomic
- best-effort
- partially successful

For partial success, return per-item outcomes.

## Authentication and Authorization

Authentication answers who the caller is.

Authorization answers what the caller may do.

Do not confuse the two.

Prefer stable, domain-oriented scopes or permissions where fine-grained authorization is needed.

Do not expose internal role implementation unless roles are intentionally part of the public contract.

## Compatibility

Backward compatibility is a primary design constraint.

Usually compatible:

- adding an optional request property
- adding a response property
- adding a new endpoint
- adding a new optional query parameter

Potentially breaking:

- removing or renaming a field
- changing a field type
- making optional input required
- changing default sorting
- changing identifier semantics
- narrowing accepted values
- changing validation unexpectedly
- changing status-code semantics

Treat response objects as open for compatible extension.

Clients should ignore unknown response fields.

## Enums

Be cautious with closed response enums.

Adding an enum value can break strict generated clients.

For extensible domains, design consumers to tolerate unknown future values.

## Versioning

Avoid versioning unless genuinely necessary.

Prefer backward-compatible evolution.

Do not automatically add versions to URLs just because breaking changes are convenient.

Avoid:

    /v1/orders
    /v2/orders

unless the product intentionally adopts URL versioning as its lifecycle strategy.

When an established public API already uses URL versioning, preserve consistency unless there is a compelling migration reason.

## Deprecation

Deprecation is a lifecycle process.

When deprecating an API:

1. mark it deprecated in the API specification
2. provide a supported replacement
3. document migration
4. monitor usage
5. give consumers sufficient time
6. define a sunset date when appropriate

Consider standard `Deprecation` and `Sunset` headers.

## Output Style

When producing an API design, prefer a concrete contract over abstract prose.

Example:

    POST /events

    {
      "name": "Design Conference",
      "starts_at": "2026-10-01T09:00:00Z"
    }

    → 201 Created

    {
      "id": "evt_123",
      "name": "Design Conference",
      "starts_at": "2026-10-01T09:00:00Z",
      "created_at": "2026-09-01T12:00:00Z"
    }

When appropriate, include an OpenAPI fragment.

Explain important tradeoffs briefly and explicitly.
