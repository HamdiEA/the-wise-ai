# Quick Reference - Mobile Performance & Deployment

## Build & Deploy in 2 Minutes

```bash
# 1. Build locally
npm install
npm run build

# 2. Preview locally
npm run preview
# Visit http://localhost:4173

# 3. Deploy to Vercel
npm install -g vercel
vercel login
vercel --prod
```

## Performance Checklist

Before each deployment, verify:

- [ ] Swipe navigation is smooth
- [ ] No layout shifts while scrolling
- [ ] Page transitions are fast
- [ ] Images load properly
- [ ] Mobile responsiveness works
- [ ] Touch events feel responsive
- [ ] No console errors
- [ ] Lighthouse score > 80

## Monitor After Deployment

```bash
# Check deployment logs
vercel logs --follow

# View all deployments
vercel ls

# Check environment variables
vercel env ls
```

## Key Performance Metrics

| Metric | Target | How to Check |
|--------|--------|------------|
| LCP | < 2.5s | Lighthouse |
| FID | < 100ms | Chrome DevTools |
| CLS | < 0.1 | Lighthouse |
| Load Time (4G) | < 5s | WebPageTest.org |

## Most Important Files

| File | Purpose |
|------|---------|
| `vite.config.ts` | Build optimization |
| `src/hooks/use-smooth-swipe.ts` | Smooth animations |
| `src/index.css` | GPU acceleration |
| `vercel.json` | Vercel configuration |
| `src/index.html` | Viewport settings |

## Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Slow swipes | Already optimized with RAF |
| Layout shift | Check for size-dependent renders |
| Jank on scroll | Check `will-change: auto` (not overused) |
| Mobile not responsive | Verify viewport meta tag |
| Build fails | Run `npm install` and `npm run build` locally |

## Environment Variables Template

For API endpoints, create `.env.local`:
```
VITE_API_URL=https://api.thewise.tn
VITE_CHAT_API=https://deepseek-api.com
```

Then add to Vercel:
```bash
vercel env add VITE_API_URL
vercel env add VITE_CHAT_API
```

## Custom Domain Setup

1. Buy domain (e.g., thewise.tn)
2. Add to Vercel: Dashboard → Domains → Add Domain
3. Update DNS or add CNAME
4. Wait 24-48 hours for propagation
5. Automatic HTTPS provisioning

## Performance Optimization Hierarchy

1. **Critical** (Already done):
   - ✅ Smooth swipe animations
   - ✅ GPU acceleration
   - ✅ Fast transitions
   - ✅ Mobile viewport settings

2. **Important** (Consider next):
   - 📌 Image optimization (WebP)
   - 📌 Lazy loading components
   - 📌 Code splitting per route

3. **Nice to have** (Future):
   - 📌 Service Worker caching
   - 📌 Push notifications
   - 📌 Offline support

## Useful Commands

```bash
# Local development
npm run dev              # Start dev server on localhost:8080

# Building
npm run build           # Production build
npm run build:dev      # Development build with source maps
npm run preview        # Preview production build

# Deployment
vercel                 # Deploy to staging
vercel --prod         # Deploy to production
vercel env pull       # Pull environment variables locally

# Monitoring
vercel logs            # View production logs
vercel analytics       # View performance metrics
```

## Mobile Testing URLs

**Responsive test**:
- Chrome DevTools: F12 → Toggle device toolbar (Ctrl+Shift+M)
- Desktop: http://localhost:8080/?mobile=true

**Real device**:
- Find your local IP: `ipconfig getifaddr en0` (Mac) or `ipconfig` (Windows)
- Visit: `http://<YOUR_IP>:8080` on phone

## Performance Hooks Available

```tsx
// Check device capabilities
import { useMobilePerformance } from '@/hooks/use-mobile-performance';
const { fps, isLowEndDevice, shouldReduceAnimations } = useMobilePerformance();

// Detect responsive breakpoints
import { useResponsive, useIsTouchDevice } from '@/hooks/use-responsive';
const { isMobile, isTablet, isDesktop } = useResponsive();
const isTouchCapable = useIsTouchDevice();

// Smooth swipe navigation
import { useSmoothSwipe } from '@/hooks/use-smooth-swipe';
const { getSwipeStyle } = useSmoothSwipe({ nextPage: '/menu' });
```

## Analytics Dashboard

After deploying, view insights at:
- **Vercel**: https://vercel.com/dashboard → Analytics
- **Lighthouse**: Chrome DevTools → Lighthouse tab
- **Real Devices**: https://www.webpagetest.org

## Rollback Procedure

If something breaks:
```bash
# List recent deployments
vercel ls

# Rollback to previous version
vercel rollback <deployment-id>

# Or through web dashboard: Click deployment → Make Production
```

## Next Steps

1. ✅ Deploy to production
2. 📊 Monitor Vercel Analytics
3. 🔍 Run Lighthouse audit
4. 📱 Test on real devices
5. 🎯 Aim for Lighthouse 90+
6. 🚀 Share with users!

---

**Remember**: Mobile users are your priority. Always test on real devices before considering a feature complete!
