# Zalando REST API Skills

A compact Agent skill package derived from the portable design principles of the Zalando RESTful API Guidelines.

## Structure

```text
zalando-rest-api-skills/
├── SKILL.md
├── README.md
├── api-design/
│   └── SKILL.md
└── api-review/
    └── SKILL.md
```

## Parent Skill

`SKILL.md` acts as the router.

It sends new API design work to `api-design` and existing API/OpenAPI review work to `api-review`.

## api-design

Use for:

- new REST API design
- resource modeling
- URL and naming conventions
- HTTP methods and status codes
- request/response schemas
- pagination and filtering
- errors
- idempotency and concurrency
- asynchronous operations
- compatibility, deprecation, and versioning
- OpenAPI-first workflows

## api-review

Use for:

- endpoint reviews
- OpenAPI reviews
- HTTP semantic checks
- backward compatibility checks
- REST consistency reviews
- reliability and idempotency reviews
- API evolution reviews

Findings are prioritized as:

- MUST FIX
- SHOULD FIX
- CONSIDER

## Design Intent

This package intentionally separates portable REST guidance from Zalando-specific infrastructure conventions. Proprietary Zalando headers, internal identifiers, hostname rules, and similar organization-specific requirements are not applied by default.
