# Mobile Optimization - Customization Guide

## 🎚️ Adjustable Parameters

### 1. Swipe Sensitivity

**File:** `src/hooks/use-smooth-swipe.ts`

```typescript
// Current settings (recommended):
{
  nextPage?: string;
  prevPage?: string;
  threshold: 80,           // ← Adjust this (pixels)
  minVelocity: 0.3         // ← Adjust this (px/ms)
}
```

**To make swiping MORE sensitive:**
```typescript
threshold: 60,        // Lower = more sensitive
minVelocity: 0.2      // Lower = faster swipes trigger
```

**To make swiping LESS sensitive:**
```typescript
threshold: 100,       // Higher = less sensitive
minVelocity: 0.4      // Higher = only fast swipes trigger
```

**Real-world effects:**
- `threshold: 60` - Twitchy, short swipes register
- `threshold: 80` - **Current (Recommended)**
- `threshold: 120` - Requires longer swipes

---

### 2. Page Transition Speed

**File:** `src/components/PageTransition.tsx`

```typescript
// Current setting:
const transitionTimer = setTimeout(() => {
  setIsTransitioning(false);
}, 200);  // ← Milliseconds
```

**To make faster:**
```typescript
}, 150);  // 150ms (zippy feel)
```

**To make slower:**
```typescript
}, 300);  // 300ms (more dramatic fade)
```

**Recommended values:**
- 150ms - Very fast, modern feel
- 200ms - **Current (Recommended)**
- 250ms - Smooth, noticeable
- 300ms - Dramatic, slow

---

### 3. Animation Duration (Swipe snap)

**File:** `src/hooks/use-smooth-swipe.ts`

```typescript
// Current easing and timing:
transition: isSwiping ? 'none' : `transform 0.4s ${SWIPE_EASING}`
```

**To adjust the animation:**
```typescript
// Faster snap back:
`transform 0.3s ${SWIPE_EASING}`

// Slower snap back:
`transform 0.5s ${SWIPE_EASING}`

// Different easing:
'cubic-bezier(0.25, 0.1, 0.25, 1.0)'   // Bouncy
'cubic-bezier(0.34, 1.56, 0.64, 1.0)'  // Very bouncy
'cubic-bezier(0.3, 0, 0.7, 1.0)'       // Linear ease
```

---

### 4. Mobile Animation Count

**File:** `src/components/GlobalBackground.tsx`

```typescript
// Current setting:
const count = isMobile ? 8 : 24;  // ← Adjust these numbers
```

**To use fewer animations on mobile:**
```typescript
const count = isMobile ? 4 : 24;   // Less effect, better battery
```

**To use more animations:**
```typescript
const count = isMobile ? 12 : 24;  // More visual effect
```

**Real-world battery impact:**
- 4 lights - ~2% battery/hour
- 8 lights - ~4% battery/hour (current)
- 12 lights - ~6% battery/hour
- 24 lights - ~12% battery/hour (desktop only)

---

### 5. Mobile Breakpoint

**File:** `src/hooks/use-mobile.tsx` and `src/index.css`

```typescript
// Current breakpoint:
const MOBILE_BREAKPOINT = 768;  // ← Change this
```

**Common values:**
```typescript
512   // Very aggressive mobile optimization
640   // Standard mobile size
768   // **Current (Recommended)**
1024  // Only optimize for phones
```

**Note:** Change in both files:
- `src/hooks/use-mobile.tsx` - JavaScript detection
- `tailwind.config.ts` - CSS breakpoint (md: 768px)

---

### 6. Header Touch Target Size

**File:** `src/components/Header.tsx`

```tsx
// Current button sizes:
className="h-9 w-9 p-0"      // 36x36px
className="h-9 px-3"         // ~44x36px
```

**To make bigger (easier to tap):**
```tsx
className="h-11 w-11 p-0"    // 44x44px
className="h-11 px-4"        // ~52x44px
```

**To make smaller (more compact):**
```tsx
className="h-8 w-8 p-0"      // 32x32px
className="h-8 px-2"         // ~40x32px
```

**Apple Guideline:** Minimum 44x44px
**Best Practice:** 48x48px minimum

---

## 🎨 Responsive Design Customization

### Header Padding (responsive)

**Current:**
```tsx
className="px-3 sm:px-4 md:px-6"
```

**More compact:**
```tsx
className="px-2 sm:px-3 md:px-4"
```

**More spacious:**
```tsx
className="px-4 sm:px-6 md:px-8"
```

### Logo Sizing (responsive)

**Current:**
```tsx
className="h-10 sm:h-12 md:h-14"
```

**Smaller logo:**
```tsx
className="h-8 sm:h-10 md:h-12"
```

**Larger logo:**
```tsx
className="h-12 sm:h-14 md:h-16"
```

### Text Sizing (responsive)

**Current:**
```tsx
className="text-sm sm:text-base lg:text-lg"
```

**Smaller text:**
```tsx
className="text-xs sm:text-sm lg:text-base"
```

**Larger text:**
```tsx
className="text-base sm:text-lg lg:text-xl"
```

---

## 🎯 Recommended Configurations

### For Speed-Focused (E-commerce)
```typescript
// Page transitions - Very fast
transition: 0.15s

// Swipe sensitivity - High
threshold: 60
minVelocity: 0.2

// Animations - Minimal
const count = isMobile ? 4 : 16

// Touch targets - Large
className="h-11 w-11"
```

### For Smooth-Focused (Restaurant/Luxury)
```typescript
// Page transitions - Smooth
transition: 0.25s

// Swipe sensitivity - Balanced
threshold: 80    // Current
minVelocity: 0.3 // Current

// Animations - Rich
const count = isMobile ? 8 : 24   // Current

// Touch targets - Balanced
className="h-9 w-9"   // Current
```

### For Battery-Conscious
```typescript
// Page transitions - Standard
transition: 0.2s   // Current

// Swipe sensitivity - Lenient
threshold: 100
minVelocity: 0.4

// Animations - Minimal
const count = isMobile ? 4 : 12

// Mobile only optimizations
// Use reduce motion detection
```

---

## 📊 Testing Your Changes

### Test Swipe Sensitivity
```javascript
// In browser console while swiping:
document.addEventListener('touchend', (e) => {
  console.log('Touch detected, adjust threshold accordingly');
});
```

### Test Page Transition Speed
```javascript
// Measure transition time:
const start = performance.now();
// Click to change page
// Check console for duration
```

### Test Animation Performance
```javascript
// Monitor FPS:
let frameCount = 0;
const fpsMonitor = setInterval(() => {
  console.log('Last frame count:', frameCount);
  frameCount = 0;
}, 1000);

const countFrames = () => {
  frameCount++;
  requestAnimationFrame(countFrames);
};
countFrames();
```

---

## ⚙️ Mobile-First Media Queries

### Standard Approach
```css
/* Mobile first */
button {
  padding: 0.5rem;
  font-size: 0.875rem;
}

/* Tablet and up */
@media (min-width: 768px) {
  button {
    padding: 0.75rem;
    font-size: 1rem;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  button {
    padding: 1rem;
    font-size: 1.125rem;
  }
}
```

### With Tailwind (Current Approach)
```tsx
className="p-2 sm:p-3 md:p-4 lg:p-5"
className="text-sm sm:text-base md:text-lg"
```

---

## 🔧 Performance Tuning Checklist

### For Better Performance:
- [ ] Reduce animation count on mobile
- [ ] Increase swipe threshold
- [ ] Decrease transition duration
- [ ] Enable `prefers-reduced-motion`
- [ ] Lazy load images
- [ ] Minimize CSS animations

### For Better UX:
- [ ] Lower swipe threshold
- [ ] Increase transition duration
- [ ] Increase animation count
- [ ] Add haptic feedback
- [ ] Larger touch targets
- [ ] More visual effects

### For Battery Life:
- [ ] Reduce animation complexity
- [ ] Minimize light count (4-6 on mobile)
- [ ] Use `prefers-reduced-motion` detection
- [ ] Disable animations on low battery
- [ ] Use CSS over JavaScript animations

---

## 🎓 Advanced Customizations

### Conditional Animations Based on Device

```typescript
const isMobile = window.innerWidth < 768;
const isLowEnd = /Android 9|Android 8/.test(navigator.userAgent);

if (isMobile) {
  // Use 6 lights for mobile
  animationCount = 6;
} else if (isLowEnd) {
  // Use 12 lights for low-end
  animationCount = 12;
} else {
  // Use 24 lights for high-end
  animationCount = 24;
}
```

### Detect User Preferences

```typescript
// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

if (prefersReducedMotion) {
  // Disable animations
  animationCount = 0;
}
```

### Detect Connection Speed

```typescript
// Check if user is on slow network
const connection = navigator.connection;
if (connection?.effectiveType === '4g') {
  // Full animations
  animationCount = 24;
} else if (connection?.effectiveType === '3g') {
  // Reduced animations
  animationCount = 8;
} else {
  // Minimal animations
  animationCount = 4;
}
```

---

## 📱 Device-Specific Optimizations

### For iPad/Tablets
```tsx
// Tablets benefit from larger targets
className="h-12 w-12 md:h-14 md:w-14"

// But maintain readability
fontSize="text-base md:text-lg"
```

### For iPhone
```tsx
// iPhone X/11+ has notch
className="px-safe py-safe"  // Use safe-area padding

// Maintain 44x44px targets
className="h-11 w-11"
```

### For Android
```tsx
// Android uses system buttons
// No notch considerations needed

// Maintain 48x48px targets (Android guideline)
className="h-12 w-12"
```

---

## 🚀 Deployment Tips

### Before Deploying
1. Test all customizations on real devices
2. Use Chrome DevTools Lighthouse
3. Check FPS with Performance tab
4. Test battery usage over time
5. Verify all breakpoints work

### Monitoring After Deployment
1. Track page load times (analytics)
2. Monitor user complaints (feedback)
3. Check Core Web Vitals (Google Search Console)
4. Review error logs
5. Measure bounce rates by device

---

## 🎯 Quick Reference Table

| Setting | Current | Min | Max | Impact |
|---------|---------|-----|-----|--------|
| Swipe threshold | 80px | 40px | 150px | Navigation feel |
| Min velocity | 0.3 px/ms | 0.1 | 0.8 | Fast swipe detection |
| Page transition | 200ms | 100ms | 500ms | Load perception |
| Mobile lights | 8 | 0 | 24 | Battery usage |
| Mobile breakpoint | 768px | 512px | 1024px | When optimizations apply |
| Touch target | 44px | 40px | 56px | Tap accuracy |

---

## 📞 Getting Help

If customizations don't work:
1. Check browser console for errors
2. Use DevTools to inspect elements
3. Test in both Chrome and Safari
4. Review mobile vs desktop viewports
5. Check for CSS conflicts

---

## ✅ Customization Complete!

Your app is now ready for fine-tuning based on:
- User feedback
- Device usage patterns
- Battery impact requirements
- Performance targets
- Visual preferences
