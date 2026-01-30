# WinterslowMRE
A website for the Winterslow Model Railway Exhibition

# Supabase Image Gallery

A clean, elegant image gallery powered by Supabase Storage.

## Deployment on Vercel

### 1. Add Environment Variables to Vercel

Go to your Vercel project settings and add these environment variables:

- `SUPABASE_URL` - Your Supabase project URL (e.g., `https://xxxxx.supabase.co`)
- `SUPABASE_ANON_KEY` - Your Supabase anon/public key
- `BUCKET_NAME` - The name of your storage bucket (e.g., `images`)
- `FOLDER_PATH` - (Optional) Specific folder path (leave empty for root)

### 2. Deploy to Vercel

Push your code to GitHub and connect it to Vercel. The build script will automatically inject the environment variables.

#### How it works:
1. During Vercel build, `build.sh` runs
2. It creates `_config.js` with your environment variables
3. The HTML file loads this config at runtime
4. `_config.js` is NOT committed to GitHub (it's in `.gitignore`)

## Local Development

For local development, you have two options:

### Option A: Create a local _config.js file
```javascript
// _config.js
window.SUPABASE_CONFIG = {
    supabaseUrl: 'https://your-project.supabase.co',
    supabaseKey: 'your-anon-key',
    bucketName: 'images',
    folderPath: ''
};
```

### Option B: Use environment variables locally
Set environment variables and run `bash build.sh` manually.

## Files

- `supabase-gallery.html` - Main gallery page
- `build.sh` - Build script that generates config from env vars
- `vercel.json` - Vercel configuration
- `.gitignore` - Prevents sensitive files from being committed
- `_config.js` - Generated at build time (DO NOT COMMIT)

## Security Note

The Supabase anon key is designed to be public and can be safely exposed in client-side code. However, you MUST:
- Configure Row Level Security (RLS) policies in Supabase
- Never expose service role keys
- Use Vercel environment variables for sensitive data

## Ensure Bucket Permissions

Make sure your Supabase storage bucket has:
- Public access enabled for the bucket, OR
- Appropriate RLS policies configured

