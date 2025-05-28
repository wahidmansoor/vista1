# 🤖 GitHub Copilot Chat Prompt - OncoVista Handbook Module Implementation

## Primary Implementation Prompt

```
You are an expert React/TypeScript developer implementing a medical handbook module for OncoVista, an oncology application. I have a comprehensive roadmap saved as ROADMAP.md in my project root.

CONTEXT:
- Building a handbook module with 3 specialties: General Oncology, Radiation Oncology, and Palliative Care
- Medical Oncology segment is ALREADY CREATED and FUNCTIONAL - DO NOT MODIFY existing medical oncology code
- Using React components with TypeScript, Tailwind CSS, and markdown files
- Palliative Care has existing TOC structure with 14 main topics, each with 4 subtopics
- Need to EXTEND existing system by adding: Radiation Oncology and Palliative Care sections, enhanced TOC, mobile responsiveness
- Must integrate seamlessly with existing medical oncology components

CURRENT TASK: [SPECIFY PHASE/TASK]

REQUIREMENTS:
1. DO NOT modify existing medical oncology components or files - only EXTEND the system
2. Follow the exact file structure from the roadmap for NEW sections only
3. Use TypeScript interfaces that are compatible with existing code patterns
4. Implement proper error handling and loading states consistent with current implementation
5. Create mobile-responsive components with Tailwind CSS matching existing design system
6. Include proper YAML frontmatter in all NEW markdown files
7. Integrate new TOC sections with existing TOC structure without breaking current functionality
8. Generate clean, production-ready code with comments that follows existing code style

Please analyze the roadmap and existing medical oncology implementation, then help me implement [SPECIFIC COMPONENT/FEATURE]. Provide:
- Complete code implementation that extends existing system
- File structure commands for NEW directories only
- Integration points with existing medical oncology code
- Any necessary dependencies (if not already installed)
- Migration/integration strategy
- Testing considerations
- Next steps

IMPORTANT: First analyze existing medical oncology code structure to understand current patterns before implementing new features.

Roadmap reference: Check ROADMAP.md in project root for full context.
```

---

## Phase-Specific Prompts

### 🔰 Phase 1: Foundation & Structure (Extension)
```
TASK: Extend existing handbook structure for Radiation Oncology and Palliative Care

First, analyze my existing medical oncology handbook implementation:
- Current directory structure in src/modules/handbook/
- Existing component patterns and interfaces
- Current TOC structure and navigation system
- Existing markdown loading and rendering logic

Then help me:
1. Create directory structure for radiation-oncology/ and palliative-care/ ONLY
2. Extend existing TOC configuration to include new sections
3. Update existing components to handle new specialties without breaking medical oncology
4. Create any missing core components following existing patterns

Show me the integration points and ensure backward compatibility.
```

### 🏗️ Phase 2: Content Structure Creation
```
TASK: Create comprehensive content structure for Radiation Oncology and Palliative Care

Based on existing medical oncology markdown structure, help me:
1. Create file structure for Radiation Oncology (following roadmap)
2. Implement Palliative Care structure matching my existing TOC (14 topics with subtopics)
3. Generate markdown templates with proper frontmatter matching existing format
4. Create placeholder content files with correct metadata structure
5. Update TOC configuration with new sections

Ensure all new files follow existing naming conventions and metadata patterns.
```

### 🔧 Phase 3: Component Enhancement
```
TASK: Enhance existing components for new specialties and mobile responsiveness

Analyze existing components and help me:
1. Update TOC.tsx to handle subtopics and mobile navigation
2. Enhance MarkdownRenderer.tsx for specialty-specific formatting if needed
3. Add mobile-responsive drawer/sidebar without breaking desktop view
4. Implement search functionality across all specialties
5. Add loading states that match existing patterns

Focus on extending, not replacing, existing functionality.
```

### 🤖 Phase 4: AI Integration Enhancement
```
TASK: Enhance AI summary system and export functionality

Working with existing AI integration, help me:
1. Extend SummaryPanel.tsx for specialty-specific summaries
2. Add error handling and retry mechanisms
3. Implement print/export functionality with clinical formatting
4. Add user feedback system for AI summaries
5. Ensure consistent styling with existing components

Maintain compatibility with current AI endpoints and data structures.
```

### 📚 Phase 5: Content Population Support
```
TASK: Create tools and templates for efficient content creation

Help me build:
1. Content creation templates for each specialty
2. Markdown validation scripts
3. TOC auto-generation utilities
4. Content review workflow tools
5. Bulk import/export utilities for clinical team collaboration

Focus on tools that work with existing content management patterns.
```

---

## Quick Action Prompts

### 🚀 Immediate Setup
```
I need to start implementing the OncoVista handbook roadmap. First, analyze my existing medical oncology handbook code and show me:
1. Current file structure
2. Existing component interfaces
3. Current TOC configuration
4. Integration points for adding new specialties

Then create the basic directory structure for radiation-oncology and palliative-care following the roadmap, without modifying existing medical oncology files.
```

### 🧭 TOC Integration
```
I have an existing TOC system for medical oncology. I need to extend it to include:
1. Radiation Oncology with comprehensive site-specific protocols
2. Palliative Care with my 14-topic structure (each having 4 subtopics)

Show me how to integrate these into existing TOC without breaking current navigation. Provide the updated TypeScript interfaces and configuration.
```

### 📱 Mobile Enhancement
```
My existing handbook works on desktop but needs mobile optimization. Help me:
1. Add responsive drawer navigation for TOC
2. Implement collapsible sections
3. Add touch-friendly navigation
4. Ensure existing medical oncology content remains functional

Show me the component updates needed while preserving current functionality.
```

### 🔍 Content Analysis
```
Analyze my existing handbook markdown files and help me create consistent templates for:
1. Radiation Oncology protocols
2. Palliative Care sections matching my TOC structure
3. Proper frontmatter that integrates with existing system

Show me examples that match current patterns and metadata structure.
```

---

## Usage Instructions

1. **Save this prompt collection** as `COPILOT_PROMPTS.md` in your project root
2. **Reference your roadmap** by mentioning "Check ROADMAP.md" in prompts
3. **Use phase-specific prompts** for systematic implementation
4. **Always start with analysis** of existing code before implementing
5. **Test integration points** after each phase

## Example Usage in VS Code
```
@workspace I'm implementing Phase 1 of my OncoVista handbook roadmap. [Paste Phase 1 prompt here]
```