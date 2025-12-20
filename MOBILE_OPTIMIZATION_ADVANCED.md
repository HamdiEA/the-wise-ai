# Mobile Optimization - Configuration Details

## Swipe Hook Configuration

### Parameters
```typescript
interface SmoothSwipeOptions {
  nextPage?: string;      // Path to next page
  prevPage?: string;      // Path to previous page
  threshold?: number;     // Pixel distance to trigger (default: 80)
  minVelocity?: number;   // Min velocity to trigger (default: 0.3 px/ms)
}
```

### Usage Example
```tsx
const { getSwipeStyle } = useSmoothSwipe({ 
  nextPage: "/menu/appetizers",
  prevPage: "/menu",
  threshold: 80,
  minVelocity: 0.3
});

return (
  <div style={getSwipeStyle()}>
    {/* Content */}
  </div>
);
```

### Return Object
```typescript
{
  swipeOffset: number;           // Current X translation
  isSwiping: boolean;            // Is actively swiping
  getSwipeStyle: () => object;   // CSS style object
}
```

---

## Animation Configuration

### Page Transition
```css
opacity: 0.2s cubic-bezier(0.4, 0, 0.2, 1)
```
- Duration: 200ms (optimized for mobile)
- Easing: Ease-in-out cubic
- Property: Opacity only (no transforms for better performance)

### Swipe Animation
```css
transform: 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)
```
- Duration: 400ms
- Easing: Smooth curve for natural feel
- GPU accelerated with perspective

### Mobile Animations
```css
/* Reduced on mobile */
.snow-layer {
  animation: snowfall 22s linear infinite; /* vs 18s on desktop */
}
```

---

## Responsive Breakpoints

### CSS Breakpoints (Tailwind)
```
xs: 320px   - Extra small phones
sm: 640px   - Standard phones
md: 768px   - Tablets
lg: 1024px  - Large tablets
xl: 1280px  - Desktops
2xl: 1536px - Large desktops
```

### Header Responsive Classes
```tsx
// Logo sizing
h-10 sm:h-12 md:h-14

// Padding
px-3 sm:px-4 md:px-6
py-2.5 sm:py-4

// Text sizing
text-sm sm:text-base lg:text-lg

// Spacing
space-x-2 sm:space-x-3 md:space-x-6
```

---

## GPU Acceleration Configuration

### CSS Properties
```css
/* Transform acceleration */
transform: translate3d(0, 0, 0);
will-change: transform;

/* Drawing acceleration */
backfaceVisibility: hidden;
perspective: 1000;

/* Performance hints */
contain: layout style paint;
```

### When to Use
- Animated transforms: YES (use translate3d)
- Opacity changes: NO (pure opacity is fast)
- Color changes: NO (use CSS custom properties)
- Multiple animations: MAYBE (batch when possible)

---

## Mobile Touch Optimization

### Touch Event Handling
```typescript
document.addEventListener('touchstart', handler, { passive: true });
document.addEventListener('touchmove', handler, { passive: true, cancelable: false });
document.addEventListener('touchend', handler, { passive: true });
```

### Touch Target Sizes
```
Minimum: 44px × 44px (Apple guideline)
Recommended: 48px × 48px
Target: 56px × 56px

Our implementation:
- Buttons: ~44px height
- Menu items: ~48px height
- Logo touch area: ~50px height
```

### Tap Highlight Removal
```css
button, a, input {
  -webkit-tap-highlight-color: transparent;
}
```

---

## Performance Monitoring

### FPS Tracking
```javascript
// Check if animations are 60FPS
const fpsCounter = () => {
  let lastTime = performance.now();
  let frames = 0;
  
  const loop = () => {
    const currentTime = performance.now();
    frames++;
    
    if (currentTime >= lastTime + 1000) {
      console.log('FPS:', frames);
      frames = 0;
      lastTime = currentTime;
    }
    
    requestAnimationFrame(loop);
  };
  
  loop();
};
```

### Memory Usage
```javascript
// Check animation memory impact
if (performance.memory) {
  console.log({
    used: Math.round(performance.memory.usedJSHeapSize / 1048576) + 'MB',
    limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576) + 'MB'
  });
}
```

### Scrolling Performance
```javascript
// Detect jank during scroll
let lastTime = performance.now();
window.addEventListener('scroll', () => {
  const now = performance.now();
  const fps = 1000 / (now - lastTime);
  if (fps < 50) console.warn('Scroll jank detected:', fps, 'FPS');
  lastTime = now;
}, { passive: true });
```

---

## Build Configuration

### Vite Optimization
```typescript
build: {
  target: 'esnext',
  minify: 'terser',
  terserOptions: {
    compress: {
      drop_console: true,
      drop_debugger: true,
    },
  },
  rollupOptions: {
    output: {
      manualChunks: {
        'vendor': ['react', 'react-dom', 'react-router-dom'],
      },
    },
  },
}
```

### Chunk Sizes
```
Main bundle: < 200KB
Vendor bundle: < 150KB
CSS: < 50KB
Total: < 400KB (gzipped)
```

---

## CSS Custom Properties

### Used Variables
```css
--transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
--transition-bounce: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
--glow-effect: 0 0 20px hsl(0 75% 50% / 0.4);
--card-hover: 0 8px 30px hsl(0 0% 0% / 0.12);
```

### Mobile Overrides
```css
@media (max-width: 768px) {
  html {
    scroll-behavior: auto;  /* Faster on mobile */
  }
  
  .amber-light {
    animation-duration: calc(var(--duration) * 1.2);  /* Slower */
  }
}
```

---

## Testing Checklist

### Before Deploying
- [ ] Swipe on real iPhone (iOS 15+)
- [ ] Swipe on real Android phone
- [ ] Test page transitions (no black flashes)
- [ ] Verify responsive layout on 320px width
- [ ] Check animations are 60FPS
- [ ] Test in Chrome DevTools mobile mode
- [ ] Verify touch targets are 44x44px minimum
- [ ] Check scroll smoothness with -webkit-overflow-scrolling

### DevTools Checks
```javascript
// In console while swiping:
console.log(window.getComputedStyle(document.body).webkitOverflowScrolling);
// Should show: "touch" on mobile

// Check GPU acceleration:
console.log(document.querySelector('[style*="perspective"]')?.style);
// Should show: perspective: 1000

// Monitor animations:
// DevTools → Performance → Record during swipe
// Should see consistent 60FPS bars
```

---

## Troubleshooting

### Swipe Not Working
```
1. Check if useSmoothSwipe is applied to root element
2. Verify nextPage/prevPage props are passed
3. Check if event listeners are registered
4. Test with different threshold values
```

### Janky Animations
```
1. Check DevTools Performance tab
2. Look for long tasks > 50ms
3. Reduce animation count on mobile
4. Enable GPU acceleration (backfaceVisibility)
5. Check for layout thrashing
```

### Black Flash on Page Load
```
1. Ensure PageTransition wraps Routes
2. Check if content renders immediately
3. Verify opacity transition timing
4. Test in actual browser (not just DevTools)
```

### Poor Scroll Performance
```
1. Enable -webkit-overflow-scrolling: touch
2. Check for heavy calculations on scroll
3. Reduce animation complexity
4. Use will-change sparingly
5. Profile with DevTools Performance tab
```

---

## Advanced Optimizations

### Preload Next Page
```typescript
const preloadPage = (path: string) => {
  fetch(path).catch(() => {});
};

// On swipe start:
const handleTouchStart = () => {
  preloadPage(nextPage);
};
```

### Haptic Feedback
```typescript
const triggerHaptic = () => {
  if ('vibrate' in navigator) {
    navigator.vibrate(10); // 10ms buzz
  }
};
```

### Scroll Position Restoration
```typescript
useEffect(() => {
  // Save scroll position
  sessionStorage.setItem(`scroll-${location.pathname}`, window.scrollY);
  
  // Restore scroll position
  const saved = sessionStorage.getItem(`scroll-${location.pathname}`);
  if (saved) {
    window.scrollTo(0, parseInt(saved));
  }
}, [location.pathname]);
```

---

## References

- [Web Vitals](https://web.dev/vitals/)
- [Optimizing Animation Performance](https://web.dev/animations-guide/)
- [Touch Event Performance](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Touch_events)
- [CSS will-change](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change)
- [GPU Acceleration](https://web.dev/gpu-animations/)
