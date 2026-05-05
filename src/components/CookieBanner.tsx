const CookieBanner = () => (
  <div className="cookie-banner" role="status" aria-live="polite">
    <span className="cookie-banner__dot" aria-hidden="true" />
    Ce site utilise des cookies Google Analytics pour améliorer votre expérience.&nbsp;
    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
      En savoir plus
    </a>
  </div>
);

export default CookieBanner;
