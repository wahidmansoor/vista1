# Developer QA Checklist

## Build & Environment
- [ ] `npx tsc --noEmit` returns zero errors.
- [ ] `npm run build` completes successfully.
- [ ] Bundle size is within acceptable limits (no unexpected large dependencies added).

## Runtime & UI
- [ ] No `console.error` or `console.warn` outputs during standard user flow.
- [ ] UI Groups (Eligible / Potential / Not Eligible) render in the correct order.
- [ ] "Not Eligible" section is collapsed by default.
- [ ] Component handles "Empty State" (no protocols) without crashing.
- [ ] Performance: Logic execution time for matching 42 protocols is < 50ms.

## Content & Wording
- [ ] No occurrences of "Recommendation", "Best", or "Suggested Treatment" in the final UI.
- [ ] All warnings and contraindications from the protocol dataset are visible in the `ProtocolResultCard`.
- [ ] Rationale text is correctly mapped from the matching engine.

## Tests
- [ ] `npx vitest run src/modules/cdu/sections/utils/protocolMatcher.validation.ts` passes 100%.
