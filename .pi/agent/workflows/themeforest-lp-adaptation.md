---
name: themeforest-lp-adaptation
description: End-to-end workflow to research best-selling ThemeForest themes, capture screenshots, substitute free stock imagery, adapt authentic Indonesian localized content, implement pure HTML + Tailwind CDN with interactive modals, attach a 45-second WhatsApp paywall, and deploy to Cloudflare Pages.
---

# ThemeForest to Tailwind LP Adaptation Workflow

Standardized SOP for creating high-converting, premium-quality landing pages from ThemeForest live demos adapted into local Indonesian niche contexts.

## Workflow Pipeline Overview

```
[1. Target Research] ──► [2. Headless Inspection] ──► [3. Free Stock Photo Sourcing]
         │                          │                                 │
         ▼                          ▼                                 ▼
[6. Cloudflare Deploy] ◄── [5. Paywall Integration] ◄── [4. Tailwind CDN & Local Copy]
```

---

## Phase 1: ThemeForest Discovery & Live Demo Resolution
1. **Identify Top Items**: Cari item terlaris / berating tertinggi di ThemeForest untuk niche target (misal *Tour & Travel*, *Church*, *Real Estate*, *Clinic*, dll).
2. **Resolve Live Demo URL**: Ambil URL demo langsung dari author resmi (misal `themes.themegoods.com/...`, `qodeinteractive.com/...`, dll).
3. **Analyze Unique Layout Flavor**: Catat karakteristik khas (apakah modern grid, editorial storytelling, booking platform, brutalist, minimal luxury).

---

## Phase 2: Headless Visual & Structural Inspection
1. **Full-Page & Viewport Capture**:
   ```bash
   google-chrome --headless --disable-gpu --no-sandbox --window-size=1440,900 --virtual-time-budget=3000 --screenshot=preview.jpg <url>
   google-chrome --headless --disable-gpu --no-sandbox --window-size=390,844 --virtual-time-budget=3000 --screenshot=mobile.jpg <url>
   ```
2. **Extract Design Tokens**:
   - Palette warna hex (primary accent, dark background, light surface, rating gold/teal).
   - Google Fonts / typography hierarchy (Heading display font, body sans-serif).
   - Hero components (Search filter, date picker, category select, callout badges).
   - Card micro-interactions & badge positions.

---

## Phase 3: Royalty-Free Image Harvesting (Zero Copyright Risk)
1. **Never use copyrighted preview images**: Ganti seluruh gambar berbayar/watermark dengan foto resolusi tinggi dari Unsplash.
2. **High-Res Curl Script**:
   - Ambil foto lanskap, produk, atau aktivitas yang sesuai konteks Indonesia (misal: Komodo, Bromo, Raja Ampat, Sumba, Bali).
   - Simpan rapi di subfolder `images/` dalam format `.jpg` / `.png` optimal.

---

## Phase 4: Localized Real-World Content & Tailwind Architecture
1. **Pure HTML5 + Tailwind CSS CDN**:
   - No build step required (langsung jalan via double click atau web server).
   - Font Awesome 6 CDN untuk icon.
   - Google Fonts via CDN.
2. **Real-World Indonesian Data**:
   - Tanpa "Lorem Ipsum".
   - Nama entitas riil, nomor telepon asli, alamat valid di berbagai kota/provinsi Indonesia.
   - Harga transparan dalam mata uang Rupiah (`Rp x.xxx.xxx`).
   - Rincian jadwal atau itinerary hari ke-1 s/d hari ke-3/4.
3. **Interactive Functionality (No Dead Links)**:
   - **Hero Search Bar**: Filter kartu destinasi secara live berdasarkan kata kunci dan kategori.
   - **Detail & Itinerary Modal**: Pop-up dialog kaya informasi berisi jadwal lengkap, fasilitas include/exclude, dan form reservasi instan.
   - **Video Modal**: Video player responsif 16:9 (Vimeo/YouTube).
   - **Mobile Drawer**: Navigasi hamburger menu dengan transisi slide-in mulus di perangkat mobile.
   - **Tanpa Icon Shop**: Hapus keranjang belanja jika fokus pada booking jasa/donasi.

---

## Phase 5: Commercial Preview Paywall (45 Detik)
1. Pasang `paywall.js` di setiap folder landing page:
   - Timer 45 detik dengan overlay blur layar penuh (`backdrop-blur-lg`).
   - Toast reminder di detik ke-35 (*"Masa pratinjau tersisa 10 detik..."*).
   - Call-To-Action langsung ke WhatsApp **`+62 878-8127-2246`**.
   - Tombol copy nomor WhatsApp dengan visual toast.
   - Body scroll locked + anti-escape bypass.
2. **Zero-Hassle Removal**:
   - Jika klien melunasi, cukup ubah `enabled: false` di `paywall.js`.

---

## Phase 6: Master Showcase Gallery & Cloudflare Pages Deploy
1. **Master Gallery (`index.html`)**:
   - Menampilkan kartu preview seluruh landing page dengan screenshot aktual.
   - Live iframe modal dengan viewport switcher (Desktop, Tablet, Mobile).
   - Filter tab kategori & live search bar.
   - Floating WhatsApp button.
2. **Deploy to Cloudflare Pages**:
   ```bash
   CLOUDFLARE_ACCOUNT_ID=6a9e013423487824494e74b595feaeca npx wrangler pages deploy . --project-name=<project-name>
   ```
3. **Synchronize Git**:
   - Push ke remote GitHub repository dengan conventional commits.
