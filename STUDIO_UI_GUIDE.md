# Studio UI Guide

## Visual Layout Reference

### Project Form - Image Gallery Section

```
┌─────────────────────────────────────────────────────────┐
│ PROJECT IMAGES                                          │
│ Upload images — first image is the cover. Drag to      │
│ reorder.                                                │
│                                                         │
│ ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐               │
│ │      │  │      │  │      │  │      │               │
│ │ IMG1 │  │ IMG2 │  │ IMG3 │  │ IMG4 │               │
│ │      │  │      │  │      │  │      │               │
│ └──────┘  └──────┘  └──────┘  └──────┘               │
│   ↑↓🗑️     ↑↓🗑️     ↑↓🗑️     ↑↓🗑️                    │
│  (hover to see controls)                               │
│                                                         │
│ [ 📤 Upload image ]                                    │
└─────────────────────────────────────────────────────────┘
```

### Image Controls (on hover)

```
┌──────────────┐
│              │
│   [Image]    │
│              │
│ ┌──────────┐ │  ← Dark overlay appears on hover
│ │  ↑ ↓ 🗑️  │ │  ← Control buttons centered
│ └──────────┘ │
└──────────────┘
```

### Control Buttons Explained

| Button | Function | When Disabled |
|--------|----------|---------------|
| ↑ (ChevronUp) | Move image left/up in order | First image |
| ↓ (ChevronDown) | Move image right/down in order | Last image |
| 🗑️ (Trash) | Delete image from gallery | Never |

### Complete Project Form Layout

```
┌─────────────────────────────────────────────────────────┐
│ NEW PROJECT                                             │
│ Fill in the fields below                               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ TITLE *                                                 │
│ [My Project________________________]                    │
│                                                         │
│ DESCRIPTION                                             │
│ [What does this project do?________]                    │
│ [________________________________]                      │
│ [________________________________]                      │
│                                                         │
│ TAGS                                                    │
│ Technologies used                                       │
│ [Next.js_______________________] [🗑️]                  │
│ [TypeScript____________________] [🗑️]                  │
│ [+ Add item]                                           │
│                                                         │
│ PROJECT IMAGES                                          │
│ Upload images — first image is the cover.              │
│ ┌──────┐  ┌──────┐  ┌──────┐                          │
│ │ IMG1 │  │ IMG2 │  │ IMG3 │                          │
│ └──────┘  └──────┘  └──────┘                          │
│ [ 📤 Upload image ]                                    │
│                                                         │
│ LIVE URL                                                │
│ [https://example.com___________]                        │
│                                                         │
│ GITHUB / REPO URL                                       │
│ [https://github.com/user/repo__]                        │
│                                                         │
│ COLLABORATORS                                           │
│ [Solo, or Team of 3____________]                        │
│                                                         │
│ ☑ Featured project                                     │
│                                                         │
│ ─────────────────────────────────────────────────────  │
│                                                         │
│ [Add project]  [Cancel]                                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Color Scheme (from ui.tsx)

### Light Mode
- Background: `#fafafa`
- Surface: `#ffffff`
- Elevated: `#f5f5f5`
- Border: `#e0e0e0`
- Foreground: `#1a1a1a`
- Muted: `#666666`
- Danger: `#fee`
- Danger Foreground: `#c33`

### Dark Mode
- Background: `#0a0a0a`
- Surface: `#141414`
- Elevated: `#1e1e1e`
- Border: `#2a2a2a`
- Foreground: `#e5e5e5`
- Muted: `#999999`
- Danger: `#3a1a1a`
- Danger Foreground: `#ff6b6b`

## Responsive Behavior

### Desktop (> 768px)
- Gallery grid: 4-5 columns
- Hover overlay shows controls
- Smooth transitions on hover
- Full form width (max 900px)

### Mobile (< 768px)
- Gallery grid: 2-3 columns
- Tap to show controls (no hover)
- Touch-friendly button sizes
- Full viewport width with padding

## Interaction States

### Upload Button
```
Normal:   [ 📤 Upload image ]
Hover:    [ 📤 Upload image ] (slightly darker)
Disabled: [ 📤 Uploading… ]   (grayed out)
```

### Image Tile
```
Normal:   [Image with border]
Hover:    [Image with dark overlay + controls]
Selected: (file picker opens)
```

### Control Buttons
```
Enabled:  White background, black icon
Disabled: White background, 30% opacity
Danger:   Red background, white icon
```

## Keyboard Navigation

- **Tab**: Navigate between form fields
- **Enter**: Submit form (when focused on input)
- **Escape**: Cancel form (when focused anywhere)
- **Space**: Click focused button

## Accessibility

- All buttons have `type="button"` to prevent form submission
- Images have empty `alt=""` (decorative)
- Disabled buttons have `disabled` attribute
- Color contrast meets WCAG AA standards
- Focus indicators on all interactive elements

## Animation Timing

- Hover overlay: `0.15s` fade in/out
- Button transitions: `0.15s` color change
- Scroll to form: `smooth` behavior
- No animations on mobile (performance)

---

**Pro Tips**:
1. First image in gallery = cover image for project cards
2. Hover over images to see reorder/delete controls
3. Upload multiple images one at a time
4. Reorder before saving (can't reorder after save without editing)
5. Delete and re-upload if wrong image
