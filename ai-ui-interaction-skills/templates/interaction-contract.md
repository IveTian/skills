# Interaction Contract

Use this before writing UI code.

```yaml
page_goal:

primary_user_intents:
  - 

states:
  idle:
  loading:
  empty:
  creating:
  editing:
  confirming_delete:
  submitting:
  error:

actions:
  - id:
    trigger:
    intent:

transitions:
  - from:
    action:
    to:

visibility:
  component_or_region:
    visible_when:
      -

presentation_decisions:
  creation:
  editing:
  deletion:
  filters:
  advanced_settings:

edge_states:
  loading:
  empty:
  error:
  success:

responsive_notes:
```

## Fast sanity check

Before coding, answer:

1. What is visible on first render?
2. What is intentionally hidden?
3. What does each main button do?
4. What state does each action enter?
5. What closes/cancels each temporary state?
6. Are forms shown only when the user is performing that task?
