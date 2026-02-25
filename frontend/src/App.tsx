import { useState, useEffect } from 'react'
import './App.css'

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[]
    [key: string]: unknown
  }
}

const MC_URL = 'https://lustrooms.us4.list-manage.com/subscribe/post-json'
const MC_U   = '5d82a55c65aa985a50b68c549'
const MC_ID  = '295b3c56cf'

const SPOTS_START = 312
const SPOTS_EPOCH = new Date('2026-02-25').getTime()
const spotsCount = Math.min(
  SPOTS_START + Math.floor((Date.now() - SPOTS_EPOCH) / 86400000) * 3,
  499
)

function App() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [cookieBanner, setCookieBanner] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('cookie_consent')) setCookieBanner(true)
  }, [])

  const acceptCookies = () => {
    localStorage.setItem('cookie_consent', 'accepted')
    setCookieBanner(false)
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event: 'cookie_consent_accepted' })
  }

  const declineCookies = () => {
    localStorage.setItem('cookie_consent', 'declined')
    setCookieBanner(false)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const cbName = 'mc_cb_' + Date.now()

    window[cbName] = (data: { result: string; msg: string }) => {
      delete window[cbName]
      document.getElementById(cbName)?.remove()
      setSubmitting(false)
      if (data.result === 'success') {
        window.dataLayer = window.dataLayer || []
        window.dataLayer.push({ event: 'early_bird_signup', user_email: email })
        setSubmitted(true)
      } else {
        const msg = data.msg?.includes('already subscribed')
          ? 'You\'re already on the list!'
          : 'Something went wrong — please try again.'
        setError(msg)
      }
    }

    const params = new URLSearchParams({ u: MC_U, id: MC_ID, EMAIL: email, c: cbName })
    const script = document.createElement('script')
    script.id = cbName
    script.src = `${MC_URL}?${params.toString()}`
    document.body.appendChild(script)
  }

  const scrollToForm = () => {
    document.getElementById('early-birds')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToNext = () => {
    document.querySelector('.how-it-works')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="page">

      {/* ── Cookie Banner ── */}
      {cookieBanner && (
        <div className="cookie-banner">
          <p className="cookie-text">
            We use cookies to analyse traffic and improve your experience.
            See our <a href="/privacy.html">Privacy Policy</a>.
          </p>
          <div className="cookie-actions">
            <button className="cookie-decline" onClick={declineCookies}>Decline</button>
            <button className="cookie-accept" onClick={acceptCookies}>Accept</button>
          </div>
        </div>
      )}

      {/* ── Hero ── */}
      <section className="hero">

        {/* Atmospheric orbs */}
        <div className="hero-atmosphere">
          <span className="orb orb-1" />
          <span className="orb orb-2" />
          <span className="orb orb-3" />
        </div>

        <div className="hero-content">
          <div className="logo-mark">LUSTROOMS</div>
          <h1 className="hero-headline">
            Where Desire<br />Meets the Future
          </h1>
          <p className="hero-sub">
            Intimate, always-available AI companions in live webcam experiences<br />
            crafted entirely for you.
          </p>
          <button className="cta-btn" onClick={scrollToForm}>
            Claim Your Lifetime Deal →
          </button>
        </div>

        {/* Scroll cue */}
        <button className="scroll-cue" onClick={scrollToNext} aria-label="Scroll down">
          <span className="scroll-label">scroll</span>
          <span className="scroll-line" />
        </button>

      </section>

      {/* ── The Journey ── */}
      <section className="how-it-works">
        <h2 className="section-title">The Journey</h2>
        <p className="section-sub">Three steps to your perfect experience</p>
        <div className="steps">
          <div className="step">
            <span className="step-number">01</span>
            <h3>Choose Your Companion</h3>
            <p>Browse our AI models — each with her own personality, look, and style. Find the one that speaks to you.</p>
          </div>
          <div className="step">
            <span className="step-number">02</span>
            <h3>Enter Your Room</h3>
            <p>Step into a private, immersive live experience built around your desires. No audience. Just you two.</p>
          </div>
          <div className="step">
            <span className="step-number">03</span>
            <h3>Feel the Connection</h3>
            <p>Real-time, personalized performances that learn what you love — and keep getting better over time.</p>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="features">
        <h2 className="section-title">Why lustrooms</h2>
        <p className="section-sub">Everything you've always wanted. Nothing you didn't.</p>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Completely Private</h3>
            <p>Zero judgment, total discretion. Your sessions are yours alone — nothing is ever shared, ever.</p>
          </div>
          <div className="feature-card">
            <h3>Always Available</h3>
            <p>No schedules, no waiting. Your companion is ready whenever you are — day or night.</p>
          </div>
          <div className="feature-card">
            <h3>Endlessly Beautiful</h3>
            <p>AI-crafted models that are stunning, unique, and captivating — designed to take your breath away.</p>
          </div>
        </div>
      </section>

      {/* ── Early Bird Form ── */}
      <section id="early-birds" className="early-birds">
        <div className="early-birds-inner">
          <div className="eb-badge">Limited Offer</div>
          <h2 className="eb-headline">Be Among the First</h2>
          <p className="eb-sub">
            Join the early bird list and lock in your founding member rate — <strong>40% off, for life.</strong>
          </p>

          {/* Scarcity counter */}
          <div className="spots-counter">
            <div className="spots-bar">
              <div className="spots-fill" style={{ width: `${(spotsCount / 500) * 100}%` }} />
            </div>
            <p className="spots-label"><strong>{spotsCount}</strong> of 500 founding spots claimed</p>
          </div>

          {submitted ? (
            <div className="success-message">
              <span className="success-icon">✓</span>
              <p>You're on the list. We'll be in touch soon.</p>
            </div>
          ) : (
            <form className="signup-form" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="submit-btn" disabled={submitting}>
                {submitting ? 'Securing...' : 'Secure My Lifetime Deal'}
              </button>
              {error && <p className="form-error">{error}</p>}
            </form>
          )}

          <p className="form-note">No spam. No sharing. Unsubscribe anytime.</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <p className="footer-logo">LUSTROOMS</p>
        <div className="footer-links">
          <a href="/privacy.html">Privacy Policy</a>
          <span>·</span>
          <a href="/terms.html">Terms of Service</a>
        </div>
        <p className="footer-disclaimer">
          18+ only · Adult content · All models are AI-generated — no real persons depicted
        </p>
        <p className="footer-copy">© {new Date().getFullYear()} lustrooms. All rights reserved.</p>
      </footer>

    </div>
  )
}

export default App
