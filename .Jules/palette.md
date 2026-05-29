## 2025-05-14 - Modal Accessibility and Icon-only Buttons
**Learning:** Found that the custom Modal component lacks basic ARIA attributes (role, aria-modal, aria-labelledby) and the close button is icon-only without an accessible label. This makes the modal invisible or confusing to screen reader users.
**Action:** Always include semantic roles and ARIA labels for modals and interactive icon-only elements to ensure accessibility.
