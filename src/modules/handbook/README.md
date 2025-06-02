# OncoVista Handbook Module

## Overview

The OncoVista Handbook is a JSON-based clinical knowledge system for oncology content. It provides a structured, maintainable way to organize and display medical guidelines, protocols, and reference materials.

## File Structure

```
handbook/
├── components/
│   ├── JsonHandbookViewer.tsx    # Main content renderer
│   ├── HandbookSidebar.tsx       # Navigation sidebar
│   └── HandbookLanding.tsx       # Landing/section selector
├── types/
│   └── handbook.ts               # TypeScript type definitions
└── public/
    ├── medical_oncology_handbook/
    │   ├── toc.json             # Table of contents
    │   ├── overview.json        # Section overview
    │   └── topics/             
    │       └── [topic].json     # Individual topic files
    ├── radiation_handbook/
    └── palliative_handbook/
```

## URL Format

- `/handbook` - Main landing page
- `/handbook/:section` - Section overview (auto-redirects to overview.json)
- `/handbook/:section/:topic` - Individual topic page

Examples:
- `/handbook/medical-oncology`
- `/handbook/medical-oncology/diagnosis-workup/staging`

## Components

### JsonHandbookViewer

Main content renderer that supports:
- Headings (multiple levels)
- Paragraphs
- Lists (bullet points)
- Clinical Pearls (highlighted tips)
- Tables
- Dark mode styling
- Print optimization
- Mobile responsiveness

### Example Usage:

```tsx
<JsonHandbookViewer filePath="/medical_oncology_handbook/overview.json" />
```

## JSON Schema

### Topic File Structure

```json
{
  "title": "Topic Title",
  "category": "Section Category",
  "section": "Subsection",
  "summary": "Optional short summary",
  "content": [
    {
      "type": "heading",
      "level": 2,
      "text": "Section Title"
    },
    {
      "type": "paragraph",
      "text": "Content paragraph"
    },
    {
      "type": "list",
      "items": ["Item 1", "Item 2"]
    },
    {
      "type": "clinical_pearl",
      "text": "Important clinical tip"
    },
    {
      "type": "table",
      "headers": ["Col 1", "Col 2"],
      "rows": [
        ["Data 1", "Data 2"],
        ["Data 3", "Data 4"]
      ]
    }
  ]
}
```

### Table of Contents Structure

```json
{
  "overview": {
    "title": "Section Overview",
    "path": "overview",
    "items": []
  },
  "diagnosis": {
    "title": "Diagnosis",
    "path": "diagnosis",
    "items": [
      {
        "title": "Initial Workup",
        "path": "diagnosis/initial-workup"
      }
    ]
  }
}
```

## Styling

The handbook uses Tailwind CSS with:
- Light/dark mode support via `dark:` variants
- Print styles via `print:` variants
- Responsive design using standard breakpoints
- Custom gradients and shadows for visual hierarchy
- Consistent typography using the `prose` plugin

## Error Handling

The system includes:
- Loading states with spinners
- Error boundaries for component crashes
- Network error handling for JSON fetching
- Fallback UI for missing content
- Type checking for malformed JSON

## Creating New Topics

1. Create a new JSON file in the appropriate section folder
2. Follow the JSON schema structure
3. Add the topic to the section's toc.json
4. Test rendering in both light and dark modes
5. Verify print layout

## Testing

1. Component Tests:
   ```bash
   # Test JSON parsing and rendering
   npm test JsonHandbookViewer
   ```

2. Manual Testing Checklist:
   - Light/dark mode rendering
   - Print layout
   - Mobile responsiveness
   - Error states
   - Navigation flow
   - Content loading states

## Future Improvements

- [ ] Full-text search across all topics
- [ ] Glossary term tooltips
- [ ] AI-powered summaries
- [ ] PDF export with custom styling
- [ ] Version history and change tracking
- [ ] Interactive diagrams and charts
- [ ] Offline support via PWA
- [ ] Collaborative editing interface
- [ ] Integration with clinical decision support
- [ ] Citation management system

## Content Structure

### Recommended JSON Structure

For the best display and most consistent user experience, use the following structure for your handbook JSON files:

```json
{
  "title": "Article Title",
  "category": "Medical Oncology",
  "section": "General Oncology",
  "summary": "Brief summary of the article (optional)",
  "author": "Author name (optional)",
  "version": "1.0",
  "lastUpdated": "2023-09-01",
  "content": [
    {
      "type": "heading",
      "level": 1,
      "text": "Main Title"
    },
    {
      "type": "paragraph",
      "text": "Introduction text with **markdown** formatting supported."
    },
    // More content blocks...
  ]
}
```

### Available Content Block Types

The following content block types are supported:

1. **Heading**
   ```json
   {
     "type": "heading",
     "level": 1-6,
     "text": "Heading Text"
   }
   ```

2. **Paragraph**
   ```json
   {
     "type": "paragraph",
     "text": "Paragraph text with *markdown* support."
   }
   ```

3. **List (Bulleted)**
   ```json
   {
     "type": "list",
     "items": [
       "Item 1",
       "Item 2 with **formatting**",
       "Item 3"
     ]
   }
   ```

4. **Numbered List**
   ```json
   {
     "type": "numbers",
     "items": [
       "First item",
       "Second item",
       "Third item"
     ]
   }
   ```

5. **Table**
   ```json
   {
     "type": "table",
     "headers": ["Column 1", "Column 2", "Column 3"],
     "rows": [
       ["Row 1, Cell 1", "Row 1, Cell 2", "Row 1, Cell 3"],
       ["Row 2, Cell 1", "Row 2, Cell 2", "Row 2, Cell 3"]
     ]
   }
   ```

6. **Clinical Pearl** (highlighted information for clinicians)
   ```json
   {
     "type": "clinical_pearl",
     "text": "Important clinical note or pearl of wisdom."
   }
   ```

7. **Code Block**
   ```json
   {
     "type": "code",
     "language": "javascript",
     "text": "console.log('Hello, world!');"
   }
   ```

8. **Markdown Block** (for complex markdown content)
   ```json
   {
     "type": "markdown",
     "text": "# Markdown Title\n\nComplex markdown content with lists, tables, etc."
   }
   ```

9. **Definitions**
   ```json
   {
     "type": "definitions",
     "items": [
       {
         "term": "Term 1",
         "definition": "Definition for term 1"
       },
       {
         "term": "Term 2",
         "definition": "Definition for term 2"
       }
     ]
   }
   ```
   
   Alternatively, definitions can use a simpler format:
   ```json
   {
     "type": "definitions",
     "items": [
       "Term 1: Definition 1",
       "Term 2: Definition 2"
     ]
   }
   ```

## Markdown Support

All text fields support Markdown formatting. This includes:

- Basic formatting: **bold**, *italic*, ~~strikethrough~~
- Links: [text](url)
- Lists: both bulleted and numbered
- Tables
- Code blocks
- HTML tags (use with caution)

## File Naming and Organization

Handbook content files should follow these conventions:

1. Place files in the appropriate section directory:
   ```
   /public/medical_oncology_handbook/[section]/[topic].json
   ```

2. Use lowercase, hyphenated filenames:
   ```
   hallmarks-of-cancer.json
   ```

3. For section overview pages, use either:
   ```
   index.json
   overview.json
   ```

## Schema Validation

A formal JSON schema is available at `src/modules/handbook/schema/handbook-schema.json` to validate content files.

## Converting Legacy Content

If you have existing content in alternative formats (like nested sections), the handbook viewer can still render it, but the best practice is to convert it to the recommended flat structure with a direct `content` array.

```json
// Before (nested sections)
{
  "title": "Hallmarks of Cancer",
  "sections": [
    {
      "title": "Introduction",
      "content": {
        "list": [
          "Item 1",
          "Item 2"
        ]
      }
    }
  ]
}

// After (recommended flat structure)
{
  "title": "Hallmarks of Cancer",
  "content": [
    {
      "type": "heading",
      "level": 2,
      "text": "Introduction"
    },
    {
      "type": "list",
      "items": [
        "Item 1",
        "Item 2"
      ]
    }
  ]
}
```

## Rich Text Editing

In the future, a rich text editor will be provided to make content creation and editing easier without having to manually write JSON.