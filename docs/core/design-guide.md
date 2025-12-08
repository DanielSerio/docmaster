# Design Guide

The overall feel that we are trying to acheive with our UI is a modern, minimalistic, "OS-like" feel. We should try to maintain tribute to our "tile-like" feel wherever possible.

## General Feel

1. Modern
2. Minimal
3. Playful
4. Professional
5. Compact

## Radius

To maintain a tight, tile-like feel, we will use a reduced border radius. The radius for cards, buttons, badges, etc should feel like squares with dulled corners.

## Spacing

To maintain a compact feel, we will use a reduced spacing.

## Icons

Icons should generally be small, but remain legible. Icons should be used liberally to enhance the UI.

### Button Icon Placement

When buttons include both text and icons, the icon should be placed **after** the text content, not before. This creates a consistent visual pattern across the application and matches the style of the AsyncButton component.

**Correct:**
```tsx
<Button>
  Save
  <Save className="h-4 w-4" />
</Button>
```

**Incorrect:**
```tsx
<Button>
  <Save className="h-4 w-4" />
  Save
</Button>
```

This pattern applies to all button variants including AsyncButton, which automatically positions the icon (or spinner during loading) after the button text.
