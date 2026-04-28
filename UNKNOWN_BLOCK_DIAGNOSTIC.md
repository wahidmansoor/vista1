# Unknown Block Diagnostic Report

## 1. Fallback Location

**File:** [src/modules/handbook/ContentRenderer.tsx](src/modules/handbook/ContentRenderer.tsx)  
**Line:** 489 (in the `default` case of the `switch(block.type)` statement)  
**Component:** `ContentRenderer` function

```tsx
default:
  console.warn(`Unknown block type: ${block.type || 'undefined'}`, block);
  console.error("UNKNOWN_BLOCK_DETECTED", {
    blockType: block.type,
    blockKeys: Object.keys(block),
    fullBlock: JSON.parse(JSON.stringify(block)),
    index: index
  });
  
  // Renders an error box with the JSON structure
```

## 2. Block Type Mismatches Identified

### PRIMARY ISSUE - Definition List Type Mismatch:
The parser normalizes `definitions` → `definition_list` but the renderer only handles `definitions`.

**Parser Code** ([src/modules/handbook/UniversalContentViewer.tsx](src/modules/handbook/UniversalContentViewer.tsx), line 307):
```tsx
} else if (normalizedBlock.type === 'definitions') {
  normalizedBlock.type = 'definition_list';  // ← CONVERTS to definition_list
}
```

**Renderer Code** ([src/modules/handbook/ContentRenderer.tsx](src/modules/handbook/ContentRenderer.tsx), line 245):
```tsx
case 'definitions': {
  // ... handles 'definitions' type
  // ← But NEVER handles 'definition_list'!
}
```

### SECONDARY ISSUE - Divider Block Not Handled:
The parser creates `divider` blocks ([UniversalContentViewer.tsx:218](src/modules/handbook/UniversalContentViewer.tsx#L218)):
```tsx
blocks.push({
  type: 'divider',  // ← Created by parser
  id: generateId('divider')
});
```

But ContentRenderer has NO case for `'divider'` type (only for 'heading', 'paragraph', 'list', 'bullets', 'numbers', 'definitions', 'table', 'code', 'note', 'warning', 'clinical_pearl', 'markdown', 'document')

## 3. Root Cause Analysis

### PRIMARY: Definition List Type Mismatch

| Component | Behavior |
|-----------|----------|
| **Parser** (UniversalContentViewer.tsx) | Converts `definitions` → `definition_list` during normalization |
| **Renderer** (ContentRenderer.tsx) | Only has `case 'definitions':` handler |
| **Result** | Block type `definition_list` hits the `default` case and triggers fallback |

**Block Type Flow:**
1. JSON source has `type: 'definitions'` 
2. `normalizeContentBlock()` converts it to `type: 'definition_list'` (line 307)
3. ContentRenderer receives block with `type: 'definition_list'`
4. No matching case exists → **falls through to default** → WARNING logged

### SECONDARY: Divider Block Not Handled

| Block Type | Created By | Handled By |
|------------|-----------|-----------|
| `divider` | UniversalContentViewer.tsx:218 | ❌ **NOT HANDLED** |

**Block Type Flow:**
1. Parser creates `{ type: 'divider', ... }` when encountering horizontal rules (`---`, `***`, `___`)
2. ContentRenderer receives block with `type: 'divider'`
3. No matching case exists → **falls through to default** → WARNING logged

## 4. Source & Parser Details

### Where Blocks Originate:
- **File:** Handbook markdown/JSON content from public handbook directory
- **Parser:** `UniversalContentViewer.tsx` → `normalizeContentBlock()` function
- **Normalizer:** Lines 300-327 in UniversalContentViewer.tsx

### Parser Behavior:
The parser explicitly maps these types:
- `'bullets'` → `'list'`
- `'numbers'` → `'list'` (with `ordered: true`)
- `'definitions'` → `'definition_list'` ← **This is the problem!**

## 5. Why This Is Wrong

### Type Mismatch:
The ContentRenderer expects `'definitions'` but receives `'definition_list'`:

```typescript
// What renderer handles:
case 'definitions': { ... }

// What renderer actually gets:
{ type: 'definition_list', items: [...] }
```

### Result:
Falls through to default, showing "Unknown content block structure" warning.

## 6. Recommended Fixes

### FIX #1: Definition List Type Mismatch

#### Option 1A: Make Parser Consistent with Renderer (BEST)
Keep the type as `'definitions'` instead of converting to `'definition_list'`.

**File:** [src/modules/handbook/UniversalContentViewer.tsx](src/modules/handbook/UniversalContentViewer.tsx), line 307

Remove the type conversion:
```tsx
// REMOVE THIS:
else if (normalizedBlock.type === 'definitions') {
  normalizedBlock.type = 'definition_list';  // ← DELETE THIS LINE
}
```

**Why this is better:** 
- Less code churn
- Keeps type names predictable
- Renderer already handles `'definitions'` perfectly

---

#### Option 1B: Add Handler to Renderer
Add missing case for `'definition_list'` in ContentRenderer.

**File:** [src/modules/handbook/ContentRenderer.tsx](src/modules/handbook/ContentRenderer.tsx), after line 327

```tsx
case 'definition_list': {
  // Same handler as 'definitions' - they're identical!
  if (!block.items || !Array.isArray(block.items) || block.items.length === 0) {
    return null;
  }
  // ... rest of definitions handler
}
```

**Why NOT to use:** 
- Adds duplicate code
- Creates confusion with two different type names for same content
- Violates DRY principle

---

### FIX #2: Missing Divider Handler

Add missing case for `'divider'` in ContentRenderer.

**File:** [src/modules/handbook/ContentRenderer.tsx](src/modules/handbook/ContentRenderer.tsx), around line 450

```tsx
case 'divider':
  return (
    <div key={getKey(block, index)} className="my-6">
      <hr className="border-gray-300 dark:border-gray-600" />
    </div>
  );
```

**Rationale:** 
- Dividers are created by parser but never rendered
- Currently falls to default and triggers unnecessary warning
- Should render as a simple horizontal rule

---

## 7. Current Impact

✅ **The warning renders correctly** - JSON is displayed in amber box  
❌ **But console error is logged** - "Unknown content block structure"  
❌ **Type inconsistency confuses future maintainers**  

## 8. Summary

### PRIMARY ISSUE
**Root Cause:** Mismatch between parser output (`definition_list`) and renderer input expectation (`definitions`)

**Location:** 
- Parser normalizes to `definition_list` in UniversalContentViewer.tsx:307
- Renderer expects `definitions` in ContentRenderer.tsx:245

**Severity:** Medium (content still displays, but console error logged on any definition list block)

**Fix Difficulty:** Trivial (1 line change in either component)

**Recommended Fix:** Remove line 307 in UniversalContentViewer.tsx that converts `definitions` → `definition_list`

---

### SECONDARY ISSUE
**Root Cause:** Parser creates `divider` blocks that renderer doesn't handle

**Location:**
- Parser creates divider in UniversalContentViewer.tsx:218
- Renderer has no `case 'divider':` in ContentRenderer.tsx

**Severity:** Low (dividers are rare, but still trigger console error when encountered)

**Fix Difficulty:** Easy (add 5-line case handler)

**Recommended Fix:** Add `case 'divider':` handler to ContentRenderer.tsx

---

*Diagnostic generated with enhanced logging added to ContentRenderer.tsx*
