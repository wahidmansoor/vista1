# Handbook Supabase Migration Guide

This guide explains how to migrate the handbook content from local file storage to a Supabase-backed system for dynamic loading.

## Overview

The migration replaces locally stored handbook content (`.md` and `.json` files) with a Supabase database system that provides:

- **Dynamic loading**: Content is fetched from the database instead of static files
- **Better performance**: Indexed queries and optimized data fetching
- **Scalability**: Easy to add, update, or manage content through the database
- **Security**: Built-in XSS protection with DOMPurify for markdown content
- **Type safety**: Full TypeScript support with proper interfaces

## Architecture Changes

### Before (File-based)
```
public/
├── medical_oncology_handbook/
│   ├── toc.json
│   ├── overview.md
│   └── sections/
│       ├── diagnosis-workup/
│       │   └── breast-cancer.json
│       └── treatment-modalities/
│           └── chemotherapy.md
├── palliative_handbook/
└── radiation_handbook/
```

### After (Supabase-based)
```
Supabase Database:
handbook_files table
├── id (UUID)
├── section (medical-oncology, palliative, radiation)
├── topic (diagnosis-workup/breast-cancer)
├── title (extracted from content)
├── content (raw markdown or JSON string)
├── format (markdown or json)
├── path (optional reference path)
├── created_at
└── updated_at
```

## Database Schema

The `handbook_files` table structure:

```sql
CREATE TABLE handbook_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section VARCHAR(50) NOT NULL,
  topic VARCHAR(255) NOT NULL,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  format VARCHAR(10) NOT NULL CHECK (format IN ('markdown', 'json')),
  path VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(section, topic)
);
```

## Migration Steps

### 1. Database Setup

1. **Run the migration SQL**:
   ```bash
   # Apply the migration to your Supabase database
   psql -h <your-supabase-host> -U postgres -d postgres -f supabase/migrations/20250613_create_handbook_files.sql
   ```

2. **Verify table creation**:
   ```sql
   SELECT * FROM handbook_files LIMIT 1;
   ```

### 2. Environment Configuration

Ensure your `.env` file has the correct Supabase credentials:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

### 3. Content Migration

Use the migration script to transfer existing files:

```bash
# Install dependencies if needed
npm install

# Verify connection and check current state
node scripts/migrate-handbook-to-supabase.js

# Run the actual migration
node scripts/migrate-handbook-to-supabase.js --confirm
```

The script will:
- Scan all handbook directories
- Extract titles from markdown frontmatter or JSON
- Generate topic IDs from file paths
- Upload content to Supabase with proper metadata

### 4. Code Changes

The migration includes several new components:

#### New Files Created:
- `src/lib/supabase.ts` - Supabase client configuration
- `src/modules/handbook/UniversalContentViewer.tsx` - Universal content viewer
- `supabase/migrations/20250613_create_handbook_files.sql` - Database schema
- `scripts/migrate-handbook-to-supabase.js` - Migration script

#### Modified Files:
- `src/hooks/useHandbookData.ts` - Updated to fetch from Supabase
- `src/modules/handbook/Handbook.tsx` - Uses new content viewer
- `src/modules/handbook/types/handbook.ts` - Added new type interfaces

## New Hook Interface

The `useHandbookData` hook now returns:

```typescript
interface ExtendedUseHandbookDataReturn {
  tocData: any[] | null;          // Navigation data
  activeFile: string | null;      // File path (for compatibility)
  content: string | null;         // Raw content from database
  format: 'markdown' | 'json' | null; // Content format
  isLoading: boolean;             // Loading state
  error: Error | null;            // Error state
  isValidSection: boolean;        // Section validation
}
```

## Content Rendering

The new `UniversalContentViewer` component:

1. **Handles both formats**: Automatically detects and renders markdown or JSON
2. **XSS protection**: Uses DOMPurify to sanitize markdown content
3. **Type safety**: Full TypeScript support with proper error handling
4. **Loading states**: Shows loading spinners and error messages
5. **Progress tracking**: Displays reading progress with sticky header

## Security Features

### XSS Prevention
- All markdown content is sanitized with DOMPurify before rendering
- JSON content is properly escaped and validated
- Input validation for section/topic parameters

### Access Control
- Public read access for all handbook content
- Authenticated-only write access for content management
- Row Level Security (RLS) policies enforced

## Performance Optimizations

### Database Indexes
```sql
CREATE INDEX idx_handbook_files_section ON handbook_files(section);
CREATE INDEX idx_handbook_files_section_topic ON handbook_files(section, topic);
CREATE INDEX idx_handbook_files_format ON handbook_files(format);
```

### Query Optimization
- Single query to fetch both TOC and content
- Efficient filtering by section and topic
- Automatic caching through Supabase client

## Backward Compatibility

The migration maintains backward compatibility:

- Existing URL structure remains the same
- Navigation and routing work identically
- Content rendering preserves all features
- Print functionality is unchanged

## Rollback Plan

If needed, you can rollback by:

1. **Reverting code changes**:
   ```bash
   git revert <migration-commit>
   ```

2. **Restoring original components**:
   - Use `JsonHandbookViewer` instead of `UniversalContentViewer`
   - Revert `useHandbookData` to file-based loading
   - Remove Supabase dependencies

3. **Keeping local files**: The migration doesn't delete local files, so they remain as fallback

## Troubleshooting

### Common Issues

1. **Connection Errors**:
   - Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
   - Check Supabase project status
   - Ensure RLS policies are configured correctly

2. **Missing Content**:
   - Verify migration script completed successfully
   - Check database for records: `SELECT COUNT(*) FROM handbook_files;`
   - Review migration logs for errors

3. **Format Issues**:
   - Ensure content format is correctly detected
   - Check for malformed JSON in content
   - Verify markdown frontmatter syntax

### Debug Mode

Enable debug logging by setting:
```bash
VITE_ENABLE_DEBUG=true
```

This will show detailed console logs for:
- Content fetching operations
- Format detection and processing
- Error handling and fallbacks

## Best Practices

### Content Management
1. **Use consistent naming**: Follow kebab-case for topic IDs
2. **Add metadata**: Include proper titles and descriptions
3. **Validate content**: Test both markdown and JSON formats
4. **Version control**: Keep migration scripts for future reference

### Performance
1. **Optimize queries**: Use specific field selections
2. **Cache results**: Leverage browser and Supabase caching
3. **Monitor usage**: Track query performance in Supabase dashboard
4. **Lazy loading**: Content loads only when needed

### Security
1. **Regular updates**: Keep DOMPurify and Supabase client updated
2. **Input validation**: Always validate section/topic parameters
3. **Access review**: Regularly review RLS policies
4. **Content audit**: Monitor for malicious content uploads

## Future Enhancements

Potential improvements for the future:

1. **Content Management UI**: Admin interface for content editing
2. **Version Control**: Track content changes and revisions
3. **Search Integration**: Full-text search across all content
4. **Analytics**: Track content usage and popular topics
5. **Internationalization**: Multi-language content support
6. **Real-time Updates**: Live content updates without page refresh

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Review Supabase logs in the dashboard
3. Examine browser console for error details
4. Test migration script in development environment first

---

**Migration completed successfully!** 🎉

The handbook system now uses Supabase for dynamic content loading while maintaining all existing functionality and improving performance, security, and maintainability.
