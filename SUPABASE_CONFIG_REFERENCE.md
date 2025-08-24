# Supabase Configuration Reference

**Project:** KCT Admin Dashboard  
**Created:** 2025-08-25  
**Purpose:** Reference document for correct Supabase configuration values

## 🔧 Critical Configuration Values

### Authentication Keys

#### ❌ OLD/INCORRECT Values (DO NOT USE)
```typescript
// WRONG - These caused 401 errors
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrdHFjcHFkb3h3aW1rZ3l6aXZvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNDU5NTYwMCwiZXhwIjoyMDQwMTcxNjAwfQ.JNbG4FqOV6YfLBJRpOHtmRWVdGDYrWDKY5VFBUUnNXjM'
```

#### ✅ CORRECT Values (USE THESE)
```typescript
// CORRECT - Use these for production
const SUPABASE_URL = 'https://qktqcpqdoxwimkgyziov.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrdHFjcHFkb3h3aW1rZ3l6aXZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ1OTU2MDAsImV4cCI6MjA0MDE3MTYwMH0.2BZfUkLMJ4yBXEaXSuRCLCWdoDoyJ_xo05CbRmM7erHsov8PsNqyo31n-bGvYtg'
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrdHFjcHFkb3h3aW1rZ3l6aXZvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNDU5NTYwMCwiZXhwIjoyMDQwMTcxNjAwfQ.2BZfUkLMJ4yBXEaXSuRCLCWdoDoyJ_xo05CbRmM7erHsov8PsNqyo31n-bGvYtg'
```

### Environment Configuration

#### Frontend (.env file)
```env
VITE_SUPABASE_URL=https://qktqcpqdoxwimkgyziov.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrdHFjcHFkb3h3aW1rZ3l6aXZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ1OTU2MDAsImV4cCI6MjA0MDE3MTYwMH0.2BZfUkLMJ4yBXEaXSuRCLCWdoDoyJ_xo05CbRmM7erHsov8PsNqyo31n-bGvYtg
```

## 📊 Database Tables Reference

### Verified Tables (These exist and are accessible)
- ✅ `orders` - Order management data
- ✅ `admin_notifications` - Admin notification system
- ✅ `products` - Product catalog
- ✅ `analytics` - Analytics and reporting data

### Table Access Patterns

#### For Frontend Data Fetching
```typescript
// Use supabaseAdmin for direct database access (admin operations)
import { supabaseAdmin } from '@/utils/supabase'

// Examples:
const { data: orders } = await supabaseAdmin.from('orders').select('*')
const { data: products } = await supabaseAdmin.from('products').select('*')
const { data: notifications } = await supabaseAdmin.from('admin_notifications').select('*')
```

#### For User-Facing Operations
```typescript
// Use regular supabase client for user operations
import { supabase } from '@/utils/supabase'

// For operations that respect RLS policies
const { data, error } = await supabase.from('orders').select('*')
```

## 🔑 Client Configuration

### Correct Implementation (`src/utils/supabase.ts`)
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!

// Standard client (respects RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client (bypasses RLS) - USE THIS FOR ADMIN DASHBOARD
export const supabaseAdmin = createClient(
  supabaseUrl,
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrdHFjcHFkb3h3aW1rZ3l6aXZvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNDU5NTYwMCwiZXhwIjoyMDQwMTcxNjAwfQ.2BZfUkLMJ4yBXEaXSuRCLCWdoDoyJ_xo05CbRmM7erHsov8PsNqyo31n-bGvYtg'
)
```

## 🚨 Common Issues & Solutions

### Issue: 401 Unauthorized Errors
**Cause:** Wrong service role key or using regular client instead of admin client  
**Solution:** 
1. Verify service role key matches the correct value above
2. Use `supabaseAdmin` for all admin dashboard operations
3. Never use the old/incorrect key ending in `...NbG4FqOV6YfLBJRpOHtmRWVdGDYrWDKY5VFBUUnNXjM`

### Issue: Tables Not Found
**Cause:** Typo in table names or accessing non-existent tables  
**Solution:** Use exact table names listed above

### Issue: RLS Policy Blocking Access
**Cause:** Using regular `supabase` client for admin operations  
**Solution:** Switch to `supabaseAdmin` client

## 🔒 Security Notes

⚠️ **IMPORTANT:** The service role key has full database access. Only use it in:
- Admin dashboards
- Server-side operations
- Trusted environments

❌ **NEVER** use service role key in:
- Public websites
- Client-side user applications
- Shared environments

## 🔄 Troubleshooting Checklist

When connecting website to admin dashboard, verify:

- [ ] Supabase URL is correct: `https://qktqcpqdoxwimkgyziov.supabase.co`
- [ ] Service role key matches the correct value (ends with `...n-bGvYtg`)
- [ ] Using `supabaseAdmin` client for database operations
- [ ] Table names are spelled correctly
- [ ] No hardcoded old keys in the codebase

## 📝 Change Log

**2025-08-25:** Fixed critical service role key issue
- **Problem:** Wrong hardcoded service role key causing 401 errors
- **Solution:** Updated `src/utils/supabase.ts` with correct key
- **Files Modified:** `kct-admin-dashboard/src/utils/supabase.ts`

---

**Last Updated:** 2025-08-25  
**Next Review:** When adding new tables or modifying authentication