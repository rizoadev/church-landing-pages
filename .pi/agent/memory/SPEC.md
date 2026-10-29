# Technical Specification — Landing Pages

> Version: 1.0 | Date: 2026-10-29 | Church & Religion Theme Landing Pages

## Tech Stack
- **HTML**: Semantic HTML5 (`header`, `nav`, `main`, `section`, `aside`, `footer`)
- **CSS**: Tailwind CSS via CDN (`https://cdn.tailwindcss.com`)
- **Icons**: Font Awesome 6 CDN (`https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css`)
- **Fonts**: Google Fonts (`Montserrat`, `Noto Serif`, `Roboto`) + local custom fonts (e.g., `fonts/Cervanttis.ttf`)
- **JS**: Vanilla JavaScript (no external bundle dependencies)

## Mandatory Interactive Guidelines

### 1. Mobile Responsiveness & Drawer
- Breakpoints:
  - Mobile: `< 640px` (single column layout, hamburger menu icon)
  - Tablet: `640px - 1024px` (2 columns grid)
  - Desktop: `> 1024px` (full navigation bar, 3-4 columns grid)
- Burger Menu Drawer:
  - Width: `w-[320px] sm:w-[380px]`
  - Position: Fixed right slide-in with `translate-x-full` transition
  - Backdrop: `bg-black/60` with smooth fade
  - Content: Brand logo, navigation menu, about snippet, contact details, social icons, close button `X`

### 2. Read More / Content Modals
- Modal Trigger:
  - Hero `— SEE MORE` button
  - Mission / Beliefs `— SEE MORE` button
  - Blog / News card images, titles, and `— SEE MORE` buttons
- Modal UI Structure:
  - Backdrop: `bg-black/70 backdrop-blur-sm`
  - Card: Centered card with smooth zoom/fade transition (`scale-95 opacity-0` -> `scale-100 opacity-100`)
  - Header Image (if applicable) with vertical date badge
  - Category, Author, Date metadata
  - Styled article body with blockquote and paragraph typography
  - Social share links and `CLOSE` button

### 3. Additional Functional Elements
- **Donation Modal**: Triggered by `DONATE` buttons. Includes preset amount selector ($10, $25, $50, $100, custom), donor information form, and confirmation toast.
- **Video Modal**: Triggered by video play button. Embeds responsive 16:9 iframe (e.g. Vimeo) and stops playback on close.
- **Search Overlay**: Triggered by search icon. Displays full-screen search input with instant feedback.
- **Sliders / Galleries**: Paginators (`1`, `2`, `3` or next/prev arrows) must change the background image or shift content.
- **Toast Notifications**: Non-intrusive bottom-right toast message (`#toastNotification`) with auto-dismiss after 4 seconds.
- **Keyboard & Touch Accessibility**: `Escape` key closes any active modal or drawer. Clicking on backdrops closes them.

## Directory Layout per Project
```
{index}-{slug}/
├── index.html
├── fonts/
│   └── [CustomFont].ttf (if needed)
└── images/
    └── [all-high-res-assets].jpg / .png
```
