#!/bin/bash
# build.sh - Vercel build script

# Create _config.js with environment variables
cat > _config.js << EOF
window.SUPABASE_CONFIG = {
    supabaseUrl: '${SUPABASE_URL}',
    supabaseKey: '${SUPABASE_ANON_KEY}',
    bucketName: '${BUCKET_NAME}',
    folderPath: '${FOLDER_PATH}'
};
EOF

echo "Config file generated successfully"
