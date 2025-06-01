# 🛠️ OncoVista App Audit Fix Plan

This document provides a structured, prompt-based remediation plan for fixing the audit issues identified in the OncoVista codebase. Each step is designed to be used as a **Copilot Chat prompt** in **VS Code**, ensuring a smooth fix-and-verify workflow.

---

## 📅 Date Generated
**June 01, 2025**

---

## 🔴 CRITICAL FIXES (Fix Immediately)

### STEP 1: TypeScript Compilation Errors
```markdown
Run `tsc --noEmit`. Identify and fix:
- implicit `any`
- incorrect imports/exports
- missing interfaces/types
```

### STEP 2: Add Error Boundaries
```markdown
Wrap all top-level pages (e.g., RegimensLibrary.tsx, HandbookSidebarNew.tsx) with <ErrorBoundary>.
Create a reusable ErrorBoundary component if missing.
```

### STEP 3: Null Safety Checks
```markdown
Fix all potential null/undefined accesses with nullish coalescing (`?? []`) or optional chaining (`?.`) where applicable.
```

### STEP 4: API Key Safety
```markdown
Ensure `process.env.KEY` checks before usage. Never log or expose secrets client-side.
```

### STEP 5: Fix Route Guards
```markdown
Ensure all protected pages have proper `isAuthenticated` logic using <Navigate> or ProtectedRoute.
```

---

## 🟡 HIGH PRIORITY (Fix This Sprint)

### STEP 6: Improve Type Safety
```markdown
Ensure all props and API types are explicitly typed in TypeScript. No implicit `any`.
```

### STEP 7: Fix State Management Logic
```markdown
Inspect `useEffect`, `useCallback`, and reducer logic for correct dependency arrays and state updates.
```

### STEP 8: Improve API Error Handling
```markdown
Add error messages, fallback UIs, and user feedback in all `fetch`/`axios` blocks.
```

### STEP 9: Validate Required Props
```markdown
Ensure all props in components are properly typed and validated. Mark required ones as non-optional.
```

### STEP 10: Expand Test Coverage
```markdown
Add tests for edge cases, invalid API responses, and error boundaries.
```

---

## 🟠 MEDIUM PRIORITY (Next Sprint)

### STEP 11: Optimize Performance
```markdown
Add useMemo/useCallback, React.lazy(), and bundle splitting where appropriate.
```

### STEP 12: Fix Accessibility
```markdown
Add ARIA labels, alt tags, and ensure keyboard accessibility for inputs and buttons.
```

### STEP 13: Improve UI/UX Consistency
```markdown
Use shared UI components and consistent design for error/loading states.
```

### STEP 14: Mobile Responsiveness
```markdown
Fix layout issues, overflows, and breakpoints for small screen sizes.
```

---

## 🟢 LOW PRIORITY (Technical Debt)

### STEP 15: Clean Dead Code
```markdown
Remove unused variables, functions, and commented-out code.
```

### STEP 16: Enforce Best Practices
```markdown
Standardize naming, folder structure, and add JSDoc for major modules.
```

### STEP 17: Input Validation
```markdown
Use `zod` or `yup` for form/API input validation.
```

### STEP 18: Extract Hardcoded Values
```markdown
Move magic strings and numbers into config/constants files.
```

---

## ✅ FINAL TRACKING PROMPT
```markdown
Create a checklist of these 18 steps.
Track progress with GitHub Issues or TODOs in the codebase.
```

---

> Use each section as a Copilot Chat prompt, and confirm changes step-by-step.
