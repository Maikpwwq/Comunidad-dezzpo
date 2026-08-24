# Comunidad Dezzpo — Design System & Brand Identity

> **CANONICAL REFERENCE**: This file is the single source of truth for CSS, typography, colors, and button patterns. All agents and developers **MUST** consult this document before writing any visual styles.

## Live Reference: `/dev` Route

The project maintains a **live interactive style guide** at two routes:

| Route | Purpose | Component |
|-------|---------|-----------|
| `/dev` | Full design system overview (typography, buttons, colors) | [`AllFontStyles.tsx`](../src/components/dev/AllFontStyles.tsx) |
| `/dev/typography` | Same component, legacy URL | Same component |

**Route files:**
- [`pages/(marketing)/dev/+Page.tsx`](../pages/(marketing)/dev/+Page.tsx) — Renders `AllFontStyles`
- [`pages/(marketing)/dev/typography/+Page.tsx`](../pages/(marketing)/dev/typography/+Page.tsx) — Legacy path, same component

These pages are pre-rendered (`prerender: true`) via the `(marketing)` route group config. They are **development-only references** — not linked from any user-facing navigation.

---

## CSS Architecture

### File Organization

```
src/styles/
├── _variables.scss          # 🎨 CSS custom properties (colors, fonts)
├── components/
│   ├── _typography.scss     # 📝 Fluid typography system & preset classes
│   └── _buttons.scss        # 🔘 Centralized button system (6 variants)
├── _globals.scss            # Global resets, font-face, utility classes
└── main.scss                # Entry point (imports all partials)
```

### Import Rule

All SCSS partials use `@use '@styles/_variables' as *` for access to CSS custom properties. **Never duplicate variable values inline.**

---

## 1. Color Palette (Corporate Identity)

### Primary Brand Colors

| Name | Hex | CSS Variable | Usage |
|------|-----|-------------|-------|
| Logo Dezzpo | `#209da1` | `--logo-comunidad-dezzpo-color` | Logo, brand accent |
| Primary Green/Teal | `#00b0ab` | `--background-main-green-color` | Primary buttons, CTAs, active states |
| Hover Green | `#009999` | `--background-hover-green-color` | Button hover states |
| Primary Cyan | `#1ec7e6` | `--primary-blue-light-color` | Accent highlights |
| Primary Purple | `#662382` | `--background-dark-purple-color` | Asísteme bar, premium features |
| Hover Purple | `#662483` | `--background-hover-purple-color` | Purple button hover |

### Text Colors

| Name | Hex | CSS Variable | Usage |
|------|-----|-------------|-------|
| Black | `#000000` | `--primary-black-text-color` | Maximum contrast text |
| Titles | `#4d4d4d` | `--primary-titles-text-color` | Headings |
| Content | `#4b4b4b` | `--content-text-color` | Body text, paragraphs |
| Green Text | `#149ba1` | `--primary-green-text-color` | Links, brand text |
| White | `#ffffff` | `--content-text-white-color` | Text on dark backgrounds |
| Light Gray | `#bababa` | `--content-text-light-gray-color` | Placeholders, disabled |

### Background Colors

| Name | Hex | CSS Variable | Usage |
|------|-----|-------------|-------|
| White | `#ffffff` | `--background-white-color` | Default page background |
| Light Gray | `#e6e6e6` | `--background-light-gray-color` | Section backgrounds |
| Dark Gray | `#333333` | `--background-dark-gray-color` | Footer, dark sections |
| Smoke Overlay | `rgba(0,0,0,0.8)` | `--background-smoke-color` | Image overlays |
| Nav Bar | `#f6f8f9` | `--background-nav-bar-sigmi-color` | Navigation background |

### Alert Colors

| Name | Hex | CSS Variable | Usage |
|------|-----|-------------|-------|
| Success | `#069169` | `--success-alert-color` | Success messages |
| Error | `#a80521` | `--error-alert-color` | Error messages |
| Warning | `#ffab00` | `--warning-alert-color` | Warning messages |

### Background Utility Classes

| Class | Color | Usage |
|-------|-------|-------|
| `.bg-verde` | Teal `#00b0ab` | Teal section backgrounds |
| `.bg-azul` | Blue | Blue section backgrounds |
| `.bg-crema` | Cream | Neutral warm backgrounds |
| `.bg-cafe` | Brown | Earth-tone backgrounds |
| `.bg-negro` | Black | Dark section backgrounds |

---

## 2. Typography System

**Source file:** [`src/styles/components/_typography.scss`](../src/styles/components/_typography.scss)

### Font Families

| CSS Variable | Font | Usage |
|-------------|------|-------|
| `--font-helvetica-semibold` | Helvetica Neue SemiBold | Headings, buttons |
| `--font-worksans-regular` | Work Sans Regular | Body text, paragraphs |

### Fluid Typography Mixin

All heading and body classes use the `fluid-type()` mixin for responsive sizing:

```scss
// Usage: @include fluid-type($min-mobile, $max-desktop);
@include fluid-type(16px, 24px);
// → clamp(16px, calc(intercept + slope*100vw), 24px)
```

### Typography Preset Classes

#### Headings

| Class | Fluid Size | Font Family | Weight | Intent |
|-------|-----------|-------------|--------|--------|
| `.type-hero-title` | 32px → 60px | Helvetica SemiBold | 700 | Hero/landing page titles |
| `.type-section-title` | 24px → 36px | Helvetica SemiBold | 700 | Section headers |
| `.type-card-title` | 18px → 24px | Helvetica SemiBold | 600 | Card titles, sub-sections |
| `.headline-m` | 24px fixed | — | — | Secondary headers |

#### Body Text

| Class | Fluid Size | Font Family | Weight | Intent |
|-------|-----------|-------------|--------|--------|
| `.type-body-lg` | 16px → 18px | Work Sans | 400 | Lead paragraphs, marketing copy |
| `.type-body` | 14px → 16px | Work Sans | 400 | Standard content text |
| `.type-caption` | 12px → 14px | Work Sans | 400 | Captions, metadata, legal |

#### Specialized

| Class | Size | Intent |
|-------|------|--------|
| `.marketing-description` | 16px → 18px fluid | Feature descriptions, long-form copy |
| `.section-label` | 14px → 16px + uppercase | Category labels ("PROPIETARIOS") |
| `.hero-subtitle.on-image` | 16px → 21px + text-shadow | Text on image/gradient backgrounds |

### Text Variant Utilities

| Class | Effect |
|-------|--------|
| `.text-bold` | `font-weight: 700` |
| `.text-italic` | `font-style: italic` |
| `.text-underline` | `text-decoration: underline` |
| `.text-strikethrough` | `text-decoration: line-through` |
| `.text-optimal-width` | `max-width: 65ch` (WCAG line width) |

---

## 3. Button System

**Source file:** [`src/styles/components/_buttons.scss`](../src/styles/components/_buttons.scss)

### Base Styles (`.btn-base`)

All button variants extend `.btn-base`:
- Font: Helvetica SemiBold, 700 weight, 1rem
- Hover: `translateY(-1px)` + box-shadow
- Disabled: `opacity: 0.65`, no transform
- Transition: `all 0.15s ease-in-out`

### Button Variants

| # | Class | Visual | Intent | Example |
|---|-------|--------|--------|---------|
| 1 | `.btn-primary-gradient` | Teal→Blue gradient, 30px radius | **Main CTAs** | Siguiente, Guardar |
| 2 | `.btn-secondary-outline` | Transparent + teal border, 30px radius | **Secondary actions** | Volver atrás, Cancelar |
| 3 | `.btn-icon-action` | Solid teal + left icon slot | **Icon buttons** | PUBLICAR, CHAT EN VIVO |
| 4 | `.btn-floating-action` | Purple + shadow | **Floating CTAs** | Asísteme bar |
| 5 | `.btn-menu-nav` | Semi-transparent dark | **Navigation items** | Menu buttons |
| 6 | `.btn-card-action` | Solid teal, 8px radius | **Card actions** | Blog links |

### Legacy Compatibility Map

These legacy class names are mapped to modern variants via `@extend`:

| Legacy Class | Maps To | Context |
|-------------|---------|---------|
| `.btn-buscador` | `.btn-primary-gradient` | Search submit |
| `.btn-siguiente` | `.btn-primary-gradient` | Wizard next step |
| `.btn-avanzar` | `.btn-primary-gradient` | Form advance |
| `.btn-volver` | `.btn-secondary-outline` | Back navigation |
| `.btn-cancelar` | `.btn-secondary-outline` | Cancel action |
| `.btn-chat-en-vivo` | `.btn-icon-action` | Chat trigger |
| `.btn-publicar` | `.btn-icon-action` | Publish action |
| `.btn-green` | Solid green, 8px radius | Generic green button |
| `.btn-round.btn-high` | Green pill, full padding | Rounded CTA |

### Size Modifiers

| Class | Padding | Font Size |
|-------|---------|-----------|
| `.btn-sm` | 6px 14px | 0.875rem |
| `.btn-md` | 10px 24px | 1rem |
| `.btn-lg` | 14px 32px | 1.125rem |

### Module-Scoped Auth Buttons

The auth pages (`/ingreso`, `/registro`) use **CSS Module** classes for high-contrast auth-specific buttons:

| Class (Module) | File | Intent |
|---------------|------|--------|
| `.PrimaryAuthButton` | `Login.module.scss` / `Register.module.scss` | Phone/email submit (white text on gradient) |
| `.TealButton` | `Login.module.scss` / `Register.module.scss` | Google sign-in (white text on solid teal) |

---

## 4. Contrast Enforcement (WCAG)

### Overlay Classes

| Class | Effect | Intent |
|-------|--------|--------|
| `.opacidad-negro` | `rgba(0,0,0,0.8)` background + white text | Dark overlay for text on images |
| `.opacidad-blanco` | `rgba(233,235,230,0.8)` background | Light overlay for content on images |
| `.step-card-text` | Forces `color: var(--content-text-color)` | Fixes white-on-white in step cards |

### Context-Aware Text

| Class | When To Use |
|-------|-------------|
| `.text-on-light` | Text on white/cream/light-gray backgrounds |
| `.text-on-dark` | Text on dark/image backgrounds |

### Accessibility Utilities

| Class | Purpose |
|-------|---------|
| `.sr-only` | Screen-reader only text |
| `.focus-visible` | Keyboard focus indicator |
| `.text-optimal-width` | Max 65ch line width for readability |

---

## 5. Gradient Definitions

The project uses a consistent teal-to-blue gradient for primary actions:

```scss
// Primary CTA gradient
background: linear-gradient(-90deg, #18B1A7 35%, #0099CC 100%);

// Hover state (slightly darker)
background: linear-gradient(-90deg, #15a098 35%, #0088bb 100%);
```

**This gradient MUST NOT be changed** — it is the signature visual of the Dezzpo brand across CTAs, the navbar, and promotional banners.

---

## 6. Anti-Patterns (FORBIDDEN)

> **Every agent MUST read this section before writing any CSS or styling code.**

### ❌ NEVER Do These

1. **Never invent new colors.** Use ONLY the CSS custom properties defined in `_variables.scss`. If you need a color not in the palette, ask the user first.

2. **Never use hardcoded hex values in components.** Always reference `var(--variable-name)`.
   ```scss
   // ❌ FORBIDDEN
   color: #00b0ab;
   
   // ✅ CORRECT
   color: var(--background-main-green-color);
   ```

3. **Never create new button styles.** Use the 6 existing variants from `_buttons.scss`. If none fit, extend `.btn-base` and add the new variant to `_buttons.scss` with documentation.

4. **Never override `.TealButton` or `.PrimaryAuthButton`** — these are high-contrast WCAG-compliant auth buttons. Their white text on dark backgrounds is intentional.

5. **Never use Tailwind CSS classes.** The project uses SCSS with CSS custom properties. Tailwind is not installed and must not be introduced.

6. **Never use MUI `sx` prop for brand colors.** Use the SCSS classes or CSS variables instead.
   ```tsx
   // ❌ FORBIDDEN - ad-hoc MUI color
   <Button sx={{ backgroundColor: '#00b0ab' }}>

   // ✅ CORRECT - uses existing class
   <button className="btn-primary-gradient">
   ```

7. **Never change font families.** The project uses Helvetica SemiBold for headings/buttons and Work Sans for body text. No additional fonts without explicit approval.

8. **Never remove or modify utility classes** (`.bg-verde`, `.opacidad-negro`, `.TealButton`, etc.) that are used across the application.

### ✅ ALWAYS Do These

1. **Check the `/dev` route** to visually verify your typography and color choices match the system.

2. **Use fluid typography classes** (`.type-hero-title`, `.type-body`, etc.) instead of fixed pixel sizes.

3. **Use CSS variables** for all colors, not hex literals.

4. **Apply contrast enforcement** classes (`.text-on-light`, `.text-on-dark`) when placing text on colored backgrounds.

5. **Test button contrast** — all button text must be white (`#ffffff`) on teal/gradient backgrounds for WCAG AA compliance.
