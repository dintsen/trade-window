name: Bug Report
description: Create a report to help us improve
body:
  - type: textarea
    id: env
    attributes:
      label: Environment
      description: OS, Browser, Node version, Go version, etc.
    validations:
      required: true
  - type: dropdown
    id: area
    attributes:
      label: Affected Area
      options:
        - Frontend
        - Backend
        - Gno
        - Docs
    validations:
      required: true
  - type: textarea
    id: steps
    attributes:
      label: Steps to Reproduce
      description: How can we trigger the bug?
    validations:
      required: true
  - type: textarea
    id: expected
    attributes:
      label: Expected Result
    validations:
      required: true
  - type: textarea
    id: actual
    attributes:
      label: Actual Result
    validations:
      required: true
  - type: textarea
    id: logs
    attributes:
      label: Logs/Screenshots
      description: Attach logs or screenshots.
