# OurCoordinates.com — Conversion Enhancements — Installation Guide

## File Overview

```
shopify/
├── assets/
│   ├── occ-conversion.css      ← All styles (namespaced .occ-)
│   └── occ-conversion.js       ← All interactive behaviors
├── sections/
│   ├── occ-sticky-atc.liquid       ← Sticky add-to-cart bar
│   ├── occ-trust-badges.liquid     ← Star rating + 4 trust icons
│   ├── occ-how-it-works.liquid     ← 3-step personalization guide
│   ├── occ-couple-bundle.liquid    ← Couple bracelet bundle upsell
│   ├── occ-shipping-bar.liquid     ← Free shipping progress bar
│   └── occ-collection-hero.liquid  ← Collection page hero + nav
└── snippets/
    ├── occ-urgency.liquid          ← Viewer count + stock + countdown
    └── occ-cart-upsell.liquid      ← Cart cross-sell recommendation
```

## Step 1 — Upload Files

### Via Shopify CLI (recommended)
```bash
shopify theme push --only assets/occ-conversion.css assets/occ-conversion.js sections/occ-*.liquid snippets/occ-*.liquid
```

### Via Theme Editor
1. Go to **Online Store → Themes → Edit code**
2. Upload each file to the matching folder (Assets / Sections / Snippets)

---

## Step 2 — Add Sections to Product Pages

In **Customize → Products → Default product** (or your specific product template):

1. **Add `OCC Sticky Add-to-Cart`** — place anywhere in the template (it's `position: fixed`)
2. **Add `OCC Trust Badges`** — place directly below the Add-to-Cart button block
3. **Add `OCC How It Works`** — place below the product description
4. **Add `OCC Couple Bundle`** — on magnetic couple bracelet product pages only
   - Set **Companion product handle** to the matching bracelet's URL handle

For urgency, render the snippet inside your existing product form section:
```liquid
{% render 'occ-urgency', product: product %}
```

---

## Step 3 — Add Shipping Bar to Header

In **Customize → Header**:
- Add `OCC Shipping Bar` as the first section in your header group
- Set your free shipping threshold (default: $75)

---

## Step 4 — Add Collection Hero

In **Customize → Collections → Default collection**:
- Add `OCC Collection Hero` as the first section
- Upload a background image (1400×400px recommended)
- Add category nav links (Bracelets, Necklaces, Couple Bracelets)

---

## Step 5 — Add Cart Upsell

Inside your cart template or cart drawer liquid file, add:
```liquid
{% render 'occ-cart-upsell',
  bracelet_upsell_handle: 'YOUR-NECKLACE-HANDLE',
  necklace_upsell_handle: 'YOUR-BRACELET-HANDLE',
  couple_upsell_handle:   'YOUR-COUPLE-NECKLACE-HANDLE'
%}
```
Replace handles with the actual Shopify product handles from your store.

---

## Couple Bundle — Important Note

The bundle shows a **discounted display price** but Shopify requires a separate mechanism to actually charge the discounted price. Options:

1. **Shopify Discounts** — Create an automatic discount "Buy 2 couple bracelets, save 15%"
2. **Bundle app** — Shopify Bundles (free), Bundler, or Bold Bundles
3. **Custom script** (Shopify Plus only)

The section's "Add Both" button adds both items to cart correctly. The discount must be configured separately.

---

## Testing Checklist

- [ ] Sticky ATC bar slides up when product form scrolls out of view
- [ ] Viewer count is stable per session (doesn't change on page refresh)
- [ ] Low stock badge only appears on products with < 10 inventory
- [ ] Dispatch countdown hides on weekends, updates every minute
- [ ] Shipping bar updates without page reload when items are added to cart
- [ ] "Add Both" in couple bundle adds two items simultaneously
- [ ] Cart upsell hides if the upsell product is already in cart
- [ ] All sections look correct at 375px mobile width
