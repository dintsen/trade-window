name: Feature Request
description: Suggest an idea for this project
body:
  - type: textarea
    id: problem
    attributes:
      label: Problem
      description: What is the problem you want to solve?
    validations:
      required: true
  - type: textarea
    id: solution
    attributes:
      label: Proposed Solution
    validations:
      required: true
  - type: textarea
    id: protocol_impact
    attributes:
      label: Protocol Impact
    validations:
      required: false
  - type: textarea
    id: security_impact
    attributes:
      label: Security Impact
    validations:
      required: false
  - type: textarea
    id: docs_impact
    attributes:
      label: Docs Impact
    validations:
      required: false
