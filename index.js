// Configuration loaded from _config.js (generated at build time)
const CONFIG = window.SUPABASE_CONFIG;

let supabaseClient;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const { createClient } = supabase;
    supabaseClient = createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey);
    loadGallery();
});

async function loadGallery() {
    const container = document.getElementById('galleryContainer');
    container.innerHTML = '<div class="loading">Loading images...</div>';

    try {
        console.log('Supabase Config:', {
            url: CONFIG.supabaseUrl,
            bucket: CONFIG.bucketName,
            folder: CONFIG.folderPath,
            hasKey: !!CONFIG.supabaseKey
        });

        // Check if client is initialized
        console.log('Supabase client initialized:', !!supabaseClient);

        // List files from bucket
        const listResponse = await supabaseClient.storage
            .from(CONFIG.bucketName)
            .list(CONFIG.folderPath || '', {
                limit: 100,
                sortBy: { column: 'name', order: 'asc' }
            });

        console.log('Full response:', listResponse);

        if (listResponse.error) {
            console.error('Supabase error:', listResponse.error);
            throw new Error(`Supabase error: ${listResponse.error.message} (${listResponse.error.statusCode || 'no status'})`);
        }

        const data = listResponse.data;
        console.log('Files found:', data);

        // Filter only image files
        const imageFiles = data.filter(file =>
            file.name && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.name)
        );

        console.log('Image files filtered:', imageFiles);

        if (imageFiles.length === 0) {
            const message = data.length === 0
                ? 'The bucket appears to be empty or you may not have permission to access it.<br><br>Check that:<br>1. Files exist in the bucket<br>2. Bucket has public access or appropriate RLS policies<br>3. Bucket name is correct'
                : `Found ${data.length} file(s) but none are images (jpg, jpeg, png, gif, webp, svg)`;
            container.innerHTML = `<div class="error">${message}</div>`;
            return;
        }

        // Create gallery
        const gallery = document.createElement('div');
        gallery.className = 'gallery';

        for (const file of imageFiles) {
            const filePath = CONFIG.folderPath
                ? `${CONFIG.folderPath}${file.name}`
                : file.name;

            // Get public URL
            const { data: urlData } = supabaseClient.storage
                .from(CONFIG.bucketName)
                .getPublicUrl(filePath);

            console.log('Image URL:', urlData.publicUrl);

            const item = createGalleryItem(urlData.publicUrl, file.name);
            gallery.appendChild(item);
        }

        container.innerHTML = '';
        container.appendChild(gallery);

    } catch (error) {
        container.innerHTML = `<div class="error">Error loading gallery: ${error.message}<br><br>Check the browser console for more details.</div>`;
        console.error('Full error:', error);
    }
}

function createGalleryItem(imageUrl, fileName) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.onclick = () => openLightbox(imageUrl);

    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = fileName;
    img.loading = 'lazy';

    // const overlay = document.createElement('div');
    // overlay.className = 'overlay';
    // overlay.innerHTML = `<h3>${fileName}</h3>`;

    item.appendChild(img);
    // item.appendChild(overlay);

    return item;
}

function openLightbox(imageUrl) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    lightboxImage.src = imageUrl;
    lightbox.classList.add('active');
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
}

// Close lightbox on background click
document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target.id === 'lightbox') {
        closeLightbox();
    }
});

// Close lightbox on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});