/**
 * OurCoordinates.com — Conversion Enhancement JavaScript
 * Vanilla JS, no jQuery dependency. ES6+.
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────────
     Utility helpers
  ───────────────────────────────────────────────────────────── */
  function qs(selector, root) { return (root || document).querySelector(selector); }
  function qsa(selector, root) { return Array.from((root || document).querySelectorAll(selector)); }
  function moneyFormat(cents) {
    return '$' + (cents / 100).toFixed(2).replace(/\.00$/, '');
  }
  function dispatch(name, detail, el) {
    (el || document).dispatchEvent(new CustomEvent(name, { detail: detail, bubbles: true }));
  }

  /* ─────────────────────────────────────────────────────────────
     1. Sticky Add-to-Cart
  ───────────────────────────────────────────────────────────── */
  function initStickyATC() {
    var bar = qs('.occ-sticky');
    if (!bar) return;

    // The element to watch — Shopify Dawn uses #MainProduct-form,
    // adjust selector via data attribute if needed
    var watchSelector = bar.dataset.watchSelector || '#MainProduct-form, form[action="/cart/add"]';
    var target = qs(watchSelector);
    if (!target) return;

    var stickyBtn = qs('.occ-sticky__btn', bar);
    var stickySelect = qs('.occ-sticky__variant-select', bar);

    // Keep variant select in sync with main product form
    function syncVariant() {
      var mainSelect = qs('select[name="id"], input[name="id"]:checked');
      if (mainSelect && stickySelect) {
        stickySelect.value = mainSelect.value || '';
      }
    }

    // Watch the main form for variant changes
    var mainForm = qs('form[action="/cart/add"]');
    if (mainForm) {
      mainForm.addEventListener('change', syncVariant);
    }

    // Sticky button add-to-cart
    if (stickyBtn) {
      stickyBtn.addEventListener('click', function () {
        var variantId = stickySelect ? stickySelect.value : bar.dataset.variantId;
        if (!variantId) return;

        stickyBtn.disabled = true;
        stickyBtn.innerHTML = '<span class="occ-loading"></span>';

        fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
          body: JSON.stringify({ id: variantId, quantity: 1 })
        })
        .then(function (r) { return r.json(); })
        .then(function () {
          dispatch('cart:updated', {});
          stickyBtn.innerHTML = '✓ Added!';
          setTimeout(function () {
            stickyBtn.innerHTML = 'Add to Cart';
            stickyBtn.disabled = false;
          }, 1800);
        })
        .catch(function () {
          stickyBtn.innerHTML = 'Try again';
          stickyBtn.disabled = false;
        });
      });
    }

    // IntersectionObserver — show bar when main form is out of view
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            bar.classList.remove('occ-sticky--visible');
          } else {
            bar.classList.add('occ-sticky--visible');
            syncVariant();
          }
        });
      }, { threshold: 0 });
      observer.observe(target);
    }
  }

  /* ─────────────────────────────────────────────────────────────
     2. Free Shipping Progress Bar
  ───────────────────────────────────────────────────────────── */
  function initShippingBar() {
    var bar = qs('.occ-shipping-bar');
    if (!bar) return;

    var fill = qs('.occ-shipping-bar__fill', bar);
    var text = qs('.occ-shipping-bar__text', bar);
    var threshold = parseInt(bar.dataset.threshold || '7500', 10); // cents
    var msgEmpty   = bar.dataset.msgEmpty   || 'FREE shipping on orders over ' + moneyFormat(threshold);
    var msgAlmost  = bar.dataset.msgAlmost  || "You're <strong>{amount}</strong> away from free shipping!";
    var msgUnlocked = bar.dataset.msgUnlocked || "🎉 You've unlocked <strong>FREE shipping</strong>!";

    function update() {
      fetch('/cart.js')
        .then(function (r) { return r.json(); })
        .then(function (cart) {
          var total = cart.total_price;
          if (total === 0) {
            if (text) text.innerHTML = msgEmpty;
            if (fill) fill.style.width = '0%';
            return;
          }
          if (total >= threshold) {
            if (text) text.innerHTML = msgUnlocked;
            if (fill) fill.style.width = '100%';
          } else {
            var gap = threshold - total;
            var pct = Math.round((total / threshold) * 100);
            var msg = msgAlmost.replace('{amount}', moneyFormat(gap));
            if (text) text.innerHTML = msg;
            if (fill) fill.style.width = pct + '%';
          }
        });
    }

    update();
    document.addEventListener('cart:updated', update);
  }

  /* ─────────────────────────────────────────────────────────────
     3. Urgency — Viewers, Low Stock, Dispatch Countdown
  ───────────────────────────────────────────────────────────── */
  function initUrgencyViewers() {
    var el = qs('#occ-viewers');
    if (!el) return;

    // Stable per session so it doesn't flicker on refresh
    var key = 'occ_viewers_' + (window.location.pathname);
    var stored = sessionStorage.getItem(key);
    var count;
    if (stored) {
      count = parseInt(stored, 10);
    } else {
      count = Math.floor(Math.random() * 16) + 8; // 8–23
      sessionStorage.setItem(key, count);
    }
    el.textContent = count;

    // Simulate small fluctuations over time (±1 every 25–45s)
    function fluctuate() {
      var delta = Math.random() < 0.5 ? -1 : 1;
      count = Math.max(5, Math.min(28, count + delta));
      el.textContent = count;
      setTimeout(fluctuate, 25000 + Math.random() * 20000);
    }
    setTimeout(fluctuate, 30000);
  }

  function initDispatchCountdown() {
    var el = qs('#occ-dispatch-countdown');
    if (!el) return;

    function tick() {
      var now = new Date();
      var day = now.getDay(); // 0=Sun, 6=Sat

      // Only show on weekdays
      if (day === 0 || day === 6) {
        el.closest('.occ-urgency__item') && (el.closest('.occ-urgency__item').style.display = 'none');
        return;
      }

      // Cutoff: 2pm in user's local time (adjust via data-cutoff-hour if needed)
      var cutoffHour = parseInt(el.dataset.cutoffHour || '14', 10);
      var cutoff = new Date(now);
      cutoff.setHours(cutoffHour, 0, 0, 0);

      if (now >= cutoff) {
        // Show "tomorrow" messaging
        el.innerHTML = 'Order now for dispatch <strong>tomorrow</strong>';
        return;
      }

      var diff = cutoff - now;
      var hours = Math.floor(diff / 3600000);
      var mins  = Math.floor((diff % 3600000) / 60000);
      el.innerHTML = 'Order in <strong>' + hours + 'h ' + mins + 'm</strong> for dispatch today';
    }

    tick();
    setInterval(tick, 60000);
  }

  /* ─────────────────────────────────────────────────────────────
     4. Couple Bundle — Add Both to Cart
  ───────────────────────────────────────────────────────────── */
  function initCoupleBundle() {
    var bundleBtn = qs('.occ-bundle__btn[data-bundle-add]');
    if (!bundleBtn) return;

    bundleBtn.addEventListener('click', function () {
      var variantA = bundleBtn.dataset.variantA;
      var variantB = bundleBtn.dataset.variantB;
      if (!variantA || !variantB) return;

      bundleBtn.disabled = true;
      bundleBtn.innerHTML = '<span class="occ-loading" style="border-top-color:#1a1a1a;border-color:rgba(0,0,0,0.2);border-top-color:#1a1a1a;"></span> Adding...';

      fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        body: JSON.stringify({
          items: [
            { id: parseInt(variantA, 10), quantity: 1 },
            { id: parseInt(variantB, 10), quantity: 1 }
          ]
        })
      })
      .then(function (r) {
        if (!r.ok) throw new Error('Cart error');
        return r.json();
      })
      .then(function () {
        dispatch('cart:updated', {});
        bundleBtn.innerHTML = '✓ Both Added!';
        // Open native cart drawer if theme supports it, otherwise redirect
        if (window.Shopify && typeof window.Shopify.theme !== 'undefined') {
          dispatch('theme:cart:open', {});
        }
        setTimeout(function () {
          bundleBtn.innerHTML = 'Add Both to Cart — Save ' + bundleBtn.dataset.discount + '%';
          bundleBtn.disabled = false;
        }, 2500);
      })
      .catch(function () {
        bundleBtn.innerHTML = 'Error — Try Again';
        bundleBtn.disabled = false;
      });
    });
  }

  /* ─────────────────────────────────────────────────────────────
     5. Cart Upsell — Quick Add
  ───────────────────────────────────────────────────────────── */
  function initCartUpsell() {
    var btn = qs('.occ-cart-upsell__btn[data-variant-id]');
    if (!btn) return;

    btn.addEventListener('click', function () {
      var vid = btn.dataset.variantId;
      if (!vid) return;

      var origText = btn.textContent;
      btn.disabled = true;
      btn.innerHTML = '<span class="occ-loading"></span>';

      fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        body: JSON.stringify({ id: parseInt(vid, 10), quantity: 1 })
      })
      .then(function (r) { return r.json(); })
      .then(function () {
        dispatch('cart:updated', {});
        btn.innerHTML = '✓ Added';
        // Hide the upsell card after adding
        setTimeout(function () {
          var card = btn.closest('.occ-cart-upsell');
          if (card) card.style.display = 'none';
        }, 1500);
      })
      .catch(function () {
        btn.textContent = origText;
        btn.disabled = false;
      });
    });
  }

  /* ─────────────────────────────────────────────────────────────
     6. Patch fetch to fire cart:updated on cart mutations
        This lets the shipping bar update when other code adds to cart
  ───────────────────────────────────────────────────────────── */
  function patchCartEvents() {
    var origFetch = window.fetch;
    window.fetch = function (url, opts) {
      var p = origFetch.apply(this, arguments);
      if (typeof url === 'string' && /\/cart\/(add|change|update)/.test(url)) {
        p.then(function () { dispatch('cart:updated', {}); });
      }
      return p;
    };
  }

  /* ─────────────────────────────────────────────────────────────
     Init on DOMContentLoaded
  ───────────────────────────────────────────────────────────── */
  function init() {
    patchCartEvents();
    initStickyATC();
    initShippingBar();
    initUrgencyViewers();
    initDispatchCountdown();
    initCoupleBundle();
    initCartUpsell();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
