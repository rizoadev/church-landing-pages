/**
 * ==============================================================================
 * PAYWALL PREVIEW CONTROLLER
 * ==============================================================================
 * Muncul setelah 45 detik masa preview.
 * 
 * CARA MELEPAS SETELAH KLIEN MELUNASI:
 * Opsi 1: Ubah `PAYWALL_ENABLED = false;` di bawah ini.
 * Opsi 2: Hapus file ini dan hapus `<script src="paywall.js"></script>` dari index.html.
 * ==============================================================================
 */

const PAYWALL_CONFIG = {
  enabled: true,
  timeoutSeconds: 45,
  whatsappNumber: "+62 878-8127-2246",
  whatsappUrl: "https://wa.me/6287881272246?text=Halo%20saya%20tertarik%20membeli%20full%20version%20landing%20page%20ini.",
  warningSeconds: 10 // Peringatan 10 detik sebelum paywall aktif
};

(function initPaywall() {
  if (!PAYWALL_CONFIG.enabled) return;

  // Tunggu DOM siap
  document.addEventListener('DOMContentLoaded', () => {
    // 1. Inject Style Paywall
    const style = document.createElement('style');
    style.id = 'paywall-styles';
    style.innerHTML = `
      #paywall-overlay {
        position: fixed;
        inset: 0;
        z-index: 999999;
        background: rgba(14, 18, 22, 0.88);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.4s ease, visibility 0.4s ease;
      }
      #paywall-overlay.active {
        opacity: 1;
        visibility: visible;
      }
      #paywall-card {
        background: #ffffff;
        color: #1e2124;
        max-width: 520px;
        width: 100%;
        border-radius: 24px;
        padding: 40px 32px;
        text-align: center;
        box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1);
        transform: scale(0.92);
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }
      #paywall-overlay.active #paywall-card {
        transform: scale(1);
      }
      .paywall-badge {
        display: inline-block;
        background: #fef3c7;
        color: #92400e;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        padding: 6px 14px;
        border-radius: 9999px;
        margin-bottom: 16px;
      }
      .paywall-title {
        font-size: 26px;
        font-weight: 800;
        line-height: 1.25;
        color: #111827;
        margin-bottom: 12px;
      }
      .paywall-desc {
        font-size: 14px;
        line-height: 1.6;
        color: #4b5563;
        margin-bottom: 28px;
      }
      .paywall-wa-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        background: #25D366;
        color: #ffffff;
        text-decoration: none;
        font-size: 14px;
        font-weight: 700;
        letter-spacing: 0.04em;
        padding: 16px 24px;
        border-radius: 14px;
        box-shadow: 0 10px 25px -5px rgba(37, 211, 102, 0.4);
        transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
        margin-bottom: 14px;
      }
      .paywall-wa-btn:hover {
        background: #20bd5a;
        transform: translateY(-2px);
        box-shadow: 0 14px 28px -5px rgba(37, 211, 102, 0.5);
      }
      .paywall-copy-btn {
        background: #f3f4f6;
        color: #374151;
        border: none;
        cursor: pointer;
        font-size: 12px;
        font-weight: 600;
        padding: 10px 18px;
        border-radius: 10px;
        transition: background 0.2s ease;
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .paywall-copy-btn:hover {
        background: #e5e7eb;
      }
      #paywall-toast {
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: #111827;
        color: #ffffff;
        font-size: 12px;
        font-weight: 600;
        padding: 12px 24px;
        border-radius: 9999px;
        z-index: 9999999;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        opacity: 0;
        transition: all 0.3s ease;
        pointer-events: none;
      }
      #paywall-toast.show {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
      }
    `;
    document.head.appendChild(style);

    // 2. Inject Paywall Overlay DOM
    const overlay = document.createElement('div');
    overlay.id = 'paywall-overlay';
    overlay.innerHTML = `
      <div id="paywall-card">
        <div class="paywall-badge">
          ⏳ Masa Preview Berakhir
        </div>
        <h2 class="paywall-title">
          Tertarik Menggunakan Template Ini?
        </h2>
        <p class="paywall-desc">
          Masa pratinjau 45 detik telah selesai. Untuk mendapatkan <strong>Full Version</strong> (source code lengkap, seluruh asset resolusi tinggi, dan lisensi tanpa batas), silakan hubungi kami via WhatsApp.
        </p>
        <a href="${PAYWALL_CONFIG.whatsappUrl}" target="_blank" rel="noopener noreferrer" class="paywall-wa-btn">
          <svg style="width:20px;height:20px;fill:currentColor" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.584 1.777.949 2.791.949 3.182 0 5.768-2.586 5.769-5.766.001-3.18-2.585-5.767-5.769-5.767zm0 10.373c-.933 0-1.637-.282-2.385-.758l-.171-.109-1.579.414.421-1.54-.112-.178c-.521-.83-.824-1.638-.823-2.602.001-2.483 2.02-4.502 4.649-4.502s4.648 2.019 4.648 4.502c-.001 2.483-2.02 4.503-4.649 4.503zm6.613-12.714c-1.815-1.817-4.23-2.818-6.797-2.818-5.297 0-9.609 4.311-9.61 9.61 0 1.694.444 3.348 1.286 4.808l-1.365 4.988 5.105-1.338c1.406.767 2.991 1.172 4.606 1.173h.004c5.296 0 9.608-4.312 9.609-9.611 0-2.568-.999-4.983-2.818-6.797z"/>
          </svg>
          <span>Hubungi via WhatsApp (${PAYWALL_CONFIG.whatsappNumber})</span>
        </a>
        <div>
          <button id="paywall-copy-btn" class="paywall-copy-btn">
            📋 Salin Nomor WhatsApp
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    // 3. Inject Toast Element
    const toast = document.createElement('div');
    toast.id = 'paywall-toast';
    document.body.appendChild(toast);

    function showPaywallToast(text) {
      toast.textContent = text;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3500);
    }

    // 4. Handle Copy Button
    const copyBtn = document.getElementById('paywall-copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(PAYWALL_CONFIG.whatsappNumber).then(() => {
          copyBtn.textContent = '✅ Nomor Berhasil Disalin!';
          showPaywallToast('Nomor WhatsApp telah disalin ke clipboard');
          setTimeout(() => {
            copyBtn.textContent = '📋 Salin Nomor WhatsApp';
          }, 3000);
        });
      });
    }

    // 5. Timer Peringatan 10 Detik Sebelum Lock
    if (PAYWALL_CONFIG.timeoutSeconds > PAYWALL_CONFIG.warningSeconds) {
      setTimeout(() => {
        showPaywallToast(`Masa pratinjau tersisa ${PAYWALL_CONFIG.warningSeconds} detik...`);
      }, (PAYWALL_CONFIG.timeoutSeconds - PAYWALL_CONFIG.warningSeconds) * 1000);
    }

    // 6. Timer Kunci Paywall (45 Detik)
    setTimeout(() => {
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';

      // Cegah escape key menutup paywall
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
          e.stopPropagation();
          e.preventDefault();
        }
      }, true);
    }, PAYWALL_CONFIG.timeoutSeconds * 1000);
  });
})();
