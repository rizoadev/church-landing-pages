# Architecture Decision Records

> Immutable log. Never edit past entries — add new ones to supersede.

## ADR-001: Landing Page Architecture, Mobile Responsiveness, and Interactive Element Rules
- **Date**: 2026-10-29
- **Status**: Accepted
- **Context**:
  Project membutuhkan pembuatan 13 landing page berbasis HTML murni + Tailwind CSS CDN, dengan desain yang harus 100% identik dengan 13 file referensi PNG screenshot. Halaman harus memiliki UX modern, responsif penuh di mobile, dan semua elemen interaktif harus fungsional.
- **Decision**:
  1. **Self-Contained Folder Structure**: Setiap desain memiliki folder tersendiri (`01-events-home-chapel/`, dll) berisi `index.html`, folder `images/`, dan `fonts/` jika terdapat custom font file.
  2. **Mobile Rule**: Wajib mendukung responsive design sempurna di mobile (<640px) dan tablet. Hamburger burger menu wajib membuka slide-in drawer navigasi dengan backdrop dan tombol close.
  3. **Read More / See More Modal Rule**: Semua tombol "Read More", "— SEE MORE", atau klik kartu konten wajib membuka modal dialog elegan untuk menampilkan konten berita/artikel/doktrin secara lengkap, bukan tautan mati (`href="#"`).
  4. **Element Functionality**:
     - Video button wajib membuka video modal.
     - Slider controls (angka/panah) wajib menggeser slide.
     - Search button wajib memicu search overlay.
     - Contact & newsletter form wajib memiliki JS submission handler + visual Toast notification.
     - Escape key & backdrop click wajib menutup semua modal/drawer.
     - Icon Shop/Cart dihilangkan dari navigasi.
- **Consequences**:
  - Semua landing page berdiri sendiri tanpa build step.
  - Setiap halaman memiliki pengalaman pengguna interaktif yang kaya dan tidak ada elemen mati/dummy.
