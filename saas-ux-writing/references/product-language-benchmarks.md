# Product language benchmarks

These notes summarize recurring interface-language patterns observed in official Linear, Vercel, Stripe, GitHub, and Slack sources reviewed on 2026-09-21. They are intended as design observations, not a claim that every screen in each product follows every pattern.

## Linear

Observed patterns:

- Uses stable domain objects: issue, project, team, workspace, cycle, label, template.
- Routine actions are short and direct: Create issue, Edit project, Delete project, Create labels, Apply labels.
- Explanations focus on what an object is for rather than internal implementation.
- Settings paths use concise object-based navigation such as Team settings, Workspace settings, Templates, Labels, Cycles.
- Destructive documentation states consequences plainly, for example that deleting a label is not reversible and removes it from issues.
- Avoids duplicative vocabulary: Linear explicitly reserves label names that duplicate existing product concepts such as status, priority, project, assignee, cycle.

Implication for this skill:

Treat terminology architecture as UX. Do not introduce synonyms for existing product objects. Keep routine actions terse and let the information architecture carry context.

Official sources:

- https://linear.app/docs/creating-issues
- https://linear.app/docs/projects
- https://linear.app/docs/workspaces
- https://linear.app/docs/labels
- https://linear.app/docs/use-cycles
- https://linear.app/docs/project-templates

## Vercel

Observed patterns:

- Uses developer-native nouns directly: project, deployment, environment variable, domain, repository, team.
- Dashboard actions are compact: Add New…, Project, Import, Save, Edit, Redeploy.
- Documentation connects configuration changes to their operational consequence, e.g. changed environment variables apply to new deployments and require redeploying.
- Error pages generally name the failed state, explain a likely cause, and provide troubleshooting actions.
- Technical detail is not removed when it is actionable for the developer audience.

Implication for this skill:

Do not dumb down genuine developer concepts. Remove ceremony around them. Pair state and configuration copy with the real operational consequence.

Official sources:

- https://vercel.com/docs/projects/managing-projects
- https://vercel.com/docs/project-configuration/project-settings
- https://vercel.com/docs/environment-variables/managing-environment-variables
- https://vercel.com/docs/errors/error-list
- https://vercel.com/geist/button
- https://vercel.com/geist/typography

## Stripe

Observed patterns:

- Uses precise business-domain nouns consistently: customer, payment, invoice, subscription, product, price, quote, payment method.
- Actions reflect lifecycle transitions: Create invoice, Review invoice, Send invoice, Finalize quote, Cancel subscription, Add customer.
- Billing documentation is explicit about consequences and timing rather than using euphemisms.
- Advanced settings are progressively disclosed rather than packed into primary controls.
- Stripe Apps design guidance reserves destructive button treatment for destructive actions.
- Button examples frequently use a direct verb plus object, such as Add customer.

Implication for this skill:

For billing and high-stakes operations, precision beats friendliness. Name the object, state money/timing consequences, and use explicit destructive language.

Official sources:

- https://docs.stripe.com/api/payment-link/create
- https://docs.stripe.com/api/subscriptions/cancel
- https://docs.stripe.com/stripe-apps/components/button
- https://docs.stripe.com/no-code/quotes
- https://docs.stripe.com/billing/subscriptions/metered-billing/thresholds

## GitHub

Observed patterns:

- GitHub's public content guidance explicitly prioritizes plain language, active voice, concision, user needs, readability, and consistency.
- It recommends using terminology from the product itself and keeping naming consistent.
- Product UI uses established developer nouns without unnecessary renaming: repository, pull request, issue, organization, role, permission.
- Irreversible deletion uses strong, explicit confirmation: the affected repository is named, consequences are presented, and users must confirm understanding.
- Permission explanations state the role/access required for an action.

Implication for this skill:

Use plain language without erasing technical accuracy. For destructive actions, increase specificity and friction in proportion to the impact.

Official sources:

- https://docs.github.com/en/contributing/writing-for-github-docs/best-practices-for-github-docs
- https://docs.github.com/en/contributing/writing-for-github-docs/content-design-principles
- https://docs.github.com/en/contributing/style-guide-and-content-model/style-guide
- https://docs.github.com/en/repositories/creating-and-managing-repositories/deleting-a-repository
- https://docs.github.com/en/get-started/learning-about-github/access-permissions-on-github

## Slack

Observed patterns:

- Slack's app design guidance explicitly recommends common, understandable words.
- Button labels should be clear, specific, active-voice, and reflect the user's outcome.
- Slack advises against vague labels such as Click here and against replacing words with emoji.
- Conventional action pairs are preferred when conventions help users decide quickly.
- Slack's Block Kit guidance says destructive actions should name the object, e.g. Cancel subscription rather than an ambiguous Cancel.
- Primary and danger button styling should be used with restraint.

Implication for this skill:

Write controls as decisions users can recognize instantly. Use conventional wording when novelty would increase cognitive load.

Official sources:

- https://docs.slack.dev/concepts/app-design/
- https://docs.slack.dev/concepts/designing-with-block-kit
- https://docs.slack.dev/reference/block-kit/block-elements/button-element
- https://slack.com/help/articles/201402297-Create-a-channel
- https://slack.com/help/articles/115004988303-Adjust-channel-management-permissions

## Shared synthesis

Across these products, the strongest recurring patterns are:

1. Product nouns are treated as part of the system architecture, not interchangeable prose.
2. Routine actions use compact verbs.
3. Buttons describe outcomes.
4. Technical terms remain when they are useful to the intended audience.
5. Internal implementation language is not exposed merely because it exists in code.
6. Errors become useful when they connect failure, cause, and recovery.
7. High-impact actions become more explicit, not more euphemistic.
8. Good SaaS copy is often quieter than AI-generated copy: fewer intensifiers, fewer congratulations, fewer abstract nouns.
