# Netlify Environment Variables Setup

## Required Environment Variables

You need to set these environment variables in your Netlify Dashboard:

### 🔐 API Keys (Server-side only - DO NOT expose to client)

Go to **Netlify Dashboard > Site Settings > Environment Variables** and add:

```bash
# AI Service API Keys
GEMINI_API_KEY=your-gemini-api-key-here
OPENAI_API_KEY=your-openai-api-key-if-needed

# Database Configuration (client-safe)
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Auth0 Configuration (client-safe - public identifiers)
VITE_AUTH0_DOMAIN=your-auth0-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
VITE_AUTH0_AUDIENCE=your-auth0-api-identifier
```

### 📝 How to Set Environment Variables in Netlify

1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Select your site (mwoncovista)
3. Go to **Site Settings** → **Environment Variables**
4. Click **Add Variable** for each of the above variables
5. Set the **Key** (variable name) and **Value** as shown above

### 🌐 Production URLs

The production URLs are automatically handled by the `netlify.toml` configuration:
- Production: `https://mwoncovista.netlify.app`
- Deploy Previews: `https://deploy-preview-{PR-number}--mwoncovista.netlify.app`
- Branch Deploys: `https://{branch-name}--mwoncovista.netlify.app`

### ✅ Security Benefits

✅ **API keys are server-side only** - Never exposed to client bundle
✅ **Secrets scanning configured** - Netlify will allow known safe variables
✅ **Environment-specific URLs** - Correct Auth0 callbacks for each environment
✅ **No sensitive data in repository** - All secrets managed via Netlify dashboard

### 🚀 Deploy Process

After setting the environment variables:

1. Push your changes to GitHub
2. Netlify will automatically:
   - Install dependencies with `npm ci --include=dev`
   - Build with `npm run build`
   - Use server-side environment variables for Netlify Functions
   - Inject client-side `VITE_` variables into the build
   - Deploy to your custom domain

### 🔍 Troubleshooting

If the build still fails:
1. Check that all environment variables are set in Netlify Dashboard
2. Ensure no `VITE_` prefixed API keys are in the build output
3. Verify Auth0 callback URLs are correct for your domain
4. Check the build logs for any remaining secrets scanning warnings

The configuration now properly separates client-safe variables (exposed via `VITE_` prefix) from server-side secrets (used only in Netlify Functions).
