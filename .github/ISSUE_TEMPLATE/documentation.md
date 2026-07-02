name: Documentation
description: Report an issue or suggest improvements for documentation
body:
  - type: input
    id: file
    attributes:
      label: File / Page
      description: Which file or page needs updating?
    validations:
      required: true
  - type: textarea
    id: unclear
    attributes:
      label: Unclear Part
      description: What is incorrect or missing?
    validations:
      required: true
  - type: textarea
    id: suggestion
    attributes:
      label: Suggested Correction
    validations:
      required: false
