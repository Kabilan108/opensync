# Fix: Empty Assistant Messages in Sessions

**Related Issues:** [#7](https://github.com/waynesutton/opensync/issues/7), [#8](https://github.com/waynesutton/opensync/issues/8)

**Status:** Fixed (2025-01-22)

## Problem

Users reported empty assistant message bubbles in Claude Code sessions, particularly with long tool-calling chains. Messages showed timestamps but no content. The issue affected:

- Dashboard session viewer
- SessionViewer component
- Context page slide-over
- Public session pages

## Root Cause

The `hasDisplayableParts` / `hasPartsContent` check only verified if a part TYPE existed (tool-call or tool-result), not whether the part had actual extractable content.

**Before (buggy):**
```typescript
const hasDisplayableParts = message.parts?.some((part: any) => {
  if (part.type === "text") {
    const text = getPartTextContent(part.content);
    return text && text.trim().length > 0;  // Correctly checks content
  }
  return part.type === "tool-call" || part.type === "tool-result";  // BUG: Only checks type!
});
```

This caused:
1. `hasDisplayableParts` = `true` (because part type existed)
2. `showFallback` = `false` (skipped textContent fallback)
3. Empty bubbles rendered because part.content was null/undefined/malformed

## Fix

Added content validation for tool-call and tool-result parts:

**After (fixed):**
```typescript
const hasDisplayableParts = message.parts?.some((part: any) => {
  if (part.type === "text") {
    const text = getPartTextContent(part.content);
    return text && text.trim().length > 0;
  }
  if (part.type === "tool-call") {
    // Check if tool-call has extractable name
    return part.content && (part.content.name || part.content.toolName);
  }
  if (part.type === "tool-result") {
    // Check if tool-result has extractable result
    const result = part.content?.result || part.content?.output || part.content;
    return result !== null && result !== undefined;
  }
  return false;
});
```

## Files Modified

1. `src/pages/Dashboard.tsx` - MessageBubble component
2. `src/components/SessionViewer.tsx` - MessageBlock component
3. `src/pages/Context.tsx` - SlideOverMessageBlock component
4. `src/pages/PublicSession.tsx` - MessageBlock component

## Testing

After fix:
- Messages with empty/null parts but valid `textContent` now show the textContent
- Tool-call parts with actual names render correctly
- Tool-result parts with actual results render correctly
- Messages with no extractable content from parts OR textContent show empty (correct behavior)

## Previous Related Fixes

This is the second fix for content extraction issues:

1. **First fix (Issue #7 initial):** Added content normalization helpers (`getPartTextContent`, `getTextContent`) to handle object formats like `{ text: "..." }` or `{ content: "..." }` from Claude Code.

2. **Second fix (Issue #7, #8):** Fixed the displayable content detection to properly check tool-call/tool-result content, not just type existence.
