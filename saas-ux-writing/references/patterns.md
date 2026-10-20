# SaaS copy patterns

Use these patterns as starting structures, not mandatory templates.

## Create flow

Title: `Create {object}`
Primary action: `Create {object}`
Secondary action: `Cancel`

Helper copy should explain constraints or consequences, not repeat the title.

## Empty state

Title: `No {objects} yet`
Body: `{Objects} help you {user value}.`
Action: `Create {object}`

If the value is obvious, omit the body.

## Permission block

`You need {Role} access to {action}.`

Optional recovery:
`Ask a workspace owner for access.`

## Known-cause error

`Couldn't {action}. {Cause in user language}. {Recovery action}.`

Example:
`Couldn't import this repository. It's already connected to another project. Choose a different repository or open the existing project.`

## Unknown-cause error

`Couldn't {action}. Try again.`

If logs are useful:
`Couldn't deploy this project. Check the build logs for details.`

## Destructive confirmation

Title: `{Destructive verb} {object}?`
Body: `This will {specific consequence}. {Recovery statement if relevant}.`
Primary: `{Destructive verb} {object}`
Secondary: `Cancel`

For very high-risk actions, require typed confirmation only when it materially reduces accidental loss.

## Save settings

Primary: `Save` or `Save changes`
Success: `Changes saved`

If a follow-up operation is required:
`Changes saved. Redeploy to apply them.`

## Agent run

Primary: `Run agent`
Queued: `Run queued`
Running: `Running`
Approval: `Waiting for approval`
Stopped: `Stopped`
Completed: `Completed`
Failed: `Failed`

Details:
- `View tool calls`
- `View logs`
- `Stop run`
- `Retry`

## Agent approval

Title: `Allow this action?`
Body: `The agent wants to {specific action and scope}.`
Primary: `Allow once`
Secondary: `Deny`

For persistent permission:
- `Always allow for this project`

Do not offer persistent approval when the scope is ambiguous.

## Billing change

Title: `Change plan`
Body: `You'll be charged {amount} {when}. Your new plan starts {when}.`
Primary: `Confirm plan change`
Secondary: `Cancel`

## Cancellation

Title: `Cancel subscription?`
Body: `You'll keep access until {date}. You won't be charged again after that.`
Primary: `Cancel subscription`
Secondary: `Keep subscription`

## Delete API key

Title: `Delete API key?`
Body: `Requests using this key will stop working. This can't be undone.`
Primary: `Delete API key`
Secondary: `Cancel`
