import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Menu, X, Sun, Moon, Code2, Layers3, ShoppingCart, Database, LayoutDashboard, Wrench, Globe2, Mail, Github, Linkedin, MessageCircle, Check, Sparkles, ChevronRight, ExternalLink, Braces, Server, Radio, GitBranch, Workflow, Palette, Rocket, Atom, Activity } from 'lucide-react'
import { projects, categories } from './data/projects'
import { services } from './data/services'
import { addOnServices, pricingCategories, pricingFaqs, pricingNotes, WHATSAPP_NUMBER } from './data/pricing'
import { Route, Routes, useLocation } from 'react-router-dom'
import MarketplacePage from './components/Marketplace'

const skills = [
  { name: 'React', icon: Atom },
  { name: 'JavaScript', icon: Braces },
  { name: 'Node.js', icon: Server },
  { name: 'Express.js', icon: Workflow },
  { name: 'MongoDB', icon: Database },
  { name: 'REST APIs', icon: Globe2 },
  { name: 'Socket.IO', icon: Radio },
  { name: 'HTML', icon: Code2 },
  { name: 'CSS', icon: Palette },
  { name: 'Git & GitHub', icon: GitBranch }
]
const initialForm = { name: '', email: '', type: 'Website Development', package: '', selectedPrice: '', budget: '', message: '' }
const CONTACT_EMAIL = 'thecodepixel01@gmail.com'
const formatPrice = price => `₹${new Intl.NumberFormat('en-IN').format(price)}`
const whatsappUrl = message => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
const packagePrice = item => item.price == null
  ? 'Custom quotation'
  : `${formatPrice(item.price)}${item.priceSuffix || ''}${item.billing === 'monthly' ? ' / month' : ''}`

function SectionHeading({ eyebrow, title, highlight, description, number }) {
  const reduceMotion = useReducedMotion()
  return <motion.div className="section-heading" initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .25 }} transition={{ duration: reduceMotion ? 0 : .45, ease: 'easeOut' }}>
    <div><div className="section-label">{number && <span>{number}</span>}{eyebrow}</div><h2>{title}<br/><span>{highlight}</span></h2></div>
    {description && <p>{description}</p>}
  </motion.div>
}

function Reveal({ children, className = '', delay = 0 }) {
  const reduceMotion = useReducedMotion()
  return <motion.div className={className} initial={{ opacity: 0, y: reduceMotion ? 0 : 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : delay, ease: 'easeOut' }}>{children}</motion.div>
}

function PageIntro() {
  const reduceMotion = useReducedMotion()
  const [visible, setVisible] = useState(!reduceMotion)
  useEffect(() => {
    if (!visible) return undefined
    const timer = window.setTimeout(() => setVisible(false), 720)
    return () => window.clearTimeout(timer)
  }, [visible])
  return <AnimatePresence>{visible && <motion.div className="page-intro" initial={{ opacity: 1 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .35 }} aria-hidden="true">
    <div className="intro-pixels"><i/><i/><i/><i/><i/></div>
    <motion.img src="/images/codepixel-logo.png" alt="" initial={{ opacity: 0, scale: .94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .32 }}/>
  </motion.div>}</AnimatePresence>
}

function ServiceVisual({ index, title, image, imageAlt }) {
  const Icon = [Globe2, LayoutDashboard, ShoppingCart, Workflow, Activity, Code2, Palette, Wrench][index]
  return <div className={`service-visual service-visual-${index + 1}`}>
    {image
      ? <img className="service-reference-image" src={image} alt={imageAlt || ''} loading="lazy" decoding="async" width="1417" height="768"/>
      : <div className="service-visual-window"><div className="service-window-bar"><i/><i/><i/><span>{['website.app', 'workspace.app', 'store.app', 'api.core', 'analytics.app', 'product.core', 'studio.design', 'monitor.live'][index]}</span></div>
      {index === 0 && <div className="service-browser"><div/><div/><div/><span/></div>}
      {index === 1 && <div className="service-dashboard"><span/><div/><div/><div/><i/><i/></div>}
      {index === 2 && <div className="service-products"><i/><i/><i/><span/></div>}
      {index === 3 && <div className="service-api"><span/><span/><span/><i/><i/><i/></div>}
      {index === 4 && <div className="service-chart"><i/><i/><i/><i/><i/><span/></div>}
      {index === 5 && <div className="service-code"><i/><i/><i/><i/></div>}
      {index === 6 && <div className="service-design"><i/><i/><span/><b/></div>}
      {index === 7 && <div className="service-monitor"><Activity size={20}/><span>ALL SYSTEMS OPERATIONAL</span></div>}
    </div>}
    <span className="service-visual-icon"><Icon size={16}/></span><span className="service-visual-pixel"/>
    <span className="sr-only">{title} illustration</span>
  </div>
}

function PricingCard({ service, item, onSelect }) {
  const whatsappMessage = `Hi, I'm interested in ${service.name} — ${item.name} (${packagePrice(item)}). Please share the next steps.`
  const reduceMotion = useReducedMotion()
  return <motion.article className={`pricing-card${item.popular ? ' popular' : ''}`} initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: reduceMotion ? 0 : 0.3 }}>
    {item.popular && <div className="popular-badge"><Sparkles size={13}/> MOST POPULAR</div>}
    <div className="pricing-card-heading"><span>{service.name}</span><h3>{item.name}</h3><p>{item.description}</p></div>
    <div className="price-line"><strong>{packagePrice(item)}</strong><span>{item.billing === 'monthly' ? 'monthly plan' : 'introductory starting price'}</span></div>
    <div className="package-scope"><span>{item.scope}</span><span>{item.timeline}</span></div>
    <ul className="package-features">{item.features.map(feature => <li key={feature}><Check size={15}/>{feature}</li>)}</ul>
    <dl className="package-details">
      <div><dt>Integrations</dt><dd>{item.integrations}</dd></div>
      <div><dt>Revisions</dt><dd>{item.revisions}</dd></div>
      <div><dt>Support</dt><dd>{item.support}</dd></div>
    </dl>
    {item.note && <p className="package-note">{item.note}</p>}
    <div className="pricing-card-actions">
      <button className="btn primary" type="button" onClick={() => onSelect(service, item)}>{item.price == null ? 'Request a Quote' : 'Get Started'} <ArrowUpRight size={16}/></button>
      <a className="package-whatsapp" href={whatsappUrl(whatsappMessage)} target="_blank" rel="noreferrer" aria-label={`Ask about ${item.name} on WhatsApp`}><MessageCircle size={17}/> WhatsApp</a>
    </div>
  </motion.article>
}

function PricingComparison({ service, packages }) {
  const rows = [
    { key: 'price', label: 'Starting price', value: item => packagePrice(item) },
    ...service.comparisonRows.map(key => ({ key, label: ({
      scope: 'Pages / modules',
      design: 'Design',
      database: 'Database',
      authentication: 'Authentication',
      admin: 'Admin panel',
      integrations: 'Integrations',
      seo: 'SEO',
      revisions: 'Revisions',
      support: 'Bug-fix support',
      timeline: 'Delivery timeline'
    })[key], value: item => item[key] }))
  ]
  return <div className="comparison-wrap">
    <h3>{service.name} package comparison</h3>
    <div className="comparison-scroll"><table className="comparison-table">
      <thead><tr><th>Included</th>{packages.map(item => <th key={item.name}>{item.name}</th>)}</tr></thead>
      <tbody>{rows.map(row => <tr key={row.key}><th scope="row">{row.label}</th>{packages.map(item => <td key={item.name}>{row.value(item)}</td>)}</tr>)}</tbody>
    </table></div>
  </div>
}

function ServiceDetails({ service, onClose, onViewPackages }) {
  const reduceMotion = useReducedMotion()
  const pricing = pricingCategories.find(category => category.id === service.id)
  return <motion.div className="modal-backdrop service-modal-backdrop" role="presentation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : .18 }} onClick={onClose}>
    <motion.div className="service-detail-modal" role="dialog" aria-modal="true" aria-labelledby="service-detail-title" initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduceMotion ? 0 : 18 }} transition={{ duration: reduceMotion ? 0 : .2 }} onClick={event => event.stopPropagation()}>
      <button className="modal-close" onClick={onClose} aria-label="Close service details"><X/></button>
      <div className="service-detail-visual">
        <ServiceVisual index={service.visualIndex} title={service.name} image={service.image} imageAlt={service.imageAlt}/>
        <p className={service.imageIsProject ? 'service-detail-image-caption' : 'illustration-caption'}>{service.imageCaption}</p>
      </div>
      <div className="service-detail-content">
        <span className="section-label">SERVICE / WHAT’S INCLUDED</span><h2 id="service-detail-title">{service.name}</h2><p>{service.description}</p>
        <div className="service-detail-fit"><strong>Good fit for</strong><span>{service.bestFor}</span></div>
        <h3>Example projects</h3><div className="service-example-list">{service.examples.map(example => <span key={example}><Check size={14}/>{example}</span>)}</div>
        <h3>What you can expect</h3><div className="service-example-list">{service.features.map(feature => <span key={feature}><Check size={14}/>{feature}</span>)}</div>
        {pricing && <div className="service-detail-footer"><span>Packages from <strong>{packagePrice(pricing.packages[0])}</strong></span><button className="btn primary" onClick={() => onViewPackages(service.id)}>Compare packages <ArrowUpRight size={16}/></button></div>}
      </div>
    </motion.div>
  </motion.div>
}

function PricingSection({ onSelect, activeServiceId, onServiceChange }) {
  const [comparisonOpen, setComparisonOpen] = useState(false)
  const activeService = services.find(service => service.id === activeServiceId)
  const activePricing = pricingCategories.find(category => category.id === activeServiceId)
  return <section className="section pricing-section" id="pricing">
    <div className="section-label">03 / INTRODUCTORY PRICING</div>
    <div className="section-heading pricing-heading"><div><h2>Transparent Pricing.<br/><span>Powerful Digital Solutions.</span></h2><p>Affordable introductory starting prices for individuals, startups and businesses in India. Every project is customized according to your requirements, features and complexity.</p></div></div>
    <div className="pricing-disclaimer"><Sparkles size={17}/><span>Choose a service to explore plans, compare inclusions and start an enquiry with your selected package.</span></div>
    <div className="pricing-filters" aria-label="Filter pricing by service">
      {services.map(service => <button key={service.id} className={activeServiceId === service.id ? 'filter active' : 'filter'} aria-pressed={activeServiceId === service.id} onClick={() => onServiceChange(service.id)}>{service.name}</button>)}
    </div>
    {activePricing && activeService && <motion.div key={activeService.id} className="pricing-category" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .22 }}>
      <div className="pricing-category-intro"><div><span className="section-label">PACKAGES / {activePricing.packages.length} OPTIONS</span><h3 className="pricing-category-title">{activeService.name}</h3><p>{activePricing.description}</p></div><span className="category-starting-price">From <strong>{packagePrice(activePricing.packages[0])}</strong></span></div>
      <div className="pricing-grid">{activePricing.packages.map(item => <PricingCard key={item.name} service={activeService} item={item} onSelect={onSelect}/>)}</div>
      <div className="comparison-toggle-row"><button type="button" className="btn secondary" aria-expanded={comparisonOpen} onClick={() => setComparisonOpen(open => !open)}>{comparisonOpen ? 'Hide Comparison' : 'Compare Plans'} <ChevronRight className={`comparison-chevron${comparisonOpen ? ' open' : ''}`} size={16}/></button><span>Compare scope, features, integrations, revisions, support and delivery.</span></div>
      <AnimatePresence>{comparisonOpen && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: .22 }} style={{ overflow: 'hidden' }}><PricingComparison service={activePricing} packages={activePricing.packages}/></motion.div>}</AnimatePresence>
    </motion.div>}
    <div className="pricing-addons">
      <div><span className="section-label">OPTIONAL EXTRAS</span><h3>Additional Services</h3><p>Extend your selected plan with these introductory add-ons.</p></div>
      <div className="addon-grid">{addOnServices.map(addOn => <article className="addon-card" key={addOn.name}><span>{addOn.name}</span><strong>From {formatPrice(addOn.price)}</strong>{addOn.note && <small>{addOn.note}</small>}</article>)}</div>
      <small className="addon-disclaimer">Add-on prices are introductory estimates and depend on scope and complexity.</small>
    </div>
    <div className="pricing-policy"><span className="section-label">PLEASE REVIEW BEFORE BOOKING</span><h3>Pricing Policy</h3><ul>{pricingNotes.map(note => <li key={note}><Check size={15}/>{note}</li>)}</ul></div>
    <div className="pricing-consultation"><span className="section-label">WE’RE HERE TO HELP</span><h3>Not Sure Which Plan Is Right for You?</h3><p>Tell us about your business, and we’ll recommend the right solution according to your requirements and budget.</p><div><button className="btn primary" type="button" onClick={() => onSelect({ name: 'Custom project / quote' }, { name: 'Project discussion', price: null, billing: 'custom' })}>Discuss Your Project <ArrowUpRight size={16}/></button><button className="btn secondary" type="button" onClick={() => onSelect({ name: 'Free consultation' }, { name: 'Free consultation', price: null, billing: 'custom' })}>Get a Free Consultation</button></div></div>
    <div className="pricing-faq"><div className="section-label">PRICING FAQ</div><h3>Good to know.</h3><div className="faq-grid">{pricingFaqs.map(item => <article className="faq-item" key={item.question}><h4>{item.question}</h4><p>{item.answer}</p></article>)}</div></div>
  </section>
}

const initialQuoteForm = { name: '', email: '', phone: '', company: '', service: '', package: '', description: '', budget: '', timeline: '' }

function QuoteRequestModal({ form, onChange, onClose, onSubmit }) {
  return <motion.div className="modal-backdrop quote-modal-backdrop" role="presentation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
    <motion.div className="quote-modal" role="dialog" aria-modal="true" aria-labelledby="quote-modal-title" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 18 }} onClick={event => event.stopPropagation()}>
      <button className="modal-close" type="button" onClick={onClose} aria-label="Close quotation request"><X/></button>
      <div className="quote-modal-heading"><span className="section-label">PROJECT ENQUIRY</span><h2 id="quote-modal-title">Request My Quotation</h2><p>Share a few details so we can understand your project and recommend the right next step.</p></div>
      <form className="quote-form" onSubmit={onSubmit}>
        <label>Full Name<input name="name" value={form.name} onChange={onChange} autoComplete="name" required/></label>
        <label>Email Address<input name="email" type="email" value={form.email} onChange={onChange} autoComplete="email" required/></label>
        <label>Phone Number<input name="phone" type="tel" value={form.phone} onChange={onChange} autoComplete="tel" required/></label>
        <label>Business / Company Name<input name="company" value={form.company} onChange={onChange} autoComplete="organization" placeholder="Optional"/></label>
        <label>Selected Service<select name="service" value={form.service} onChange={onChange} required><option value="">Select a service</option>{services.map(service => <option key={service.id}>{service.name}</option>)}<option>Custom project / quote</option><option>Free consultation</option></select></label>
        <label>Selected Package<input name="package" value={form.package} onChange={onChange} required/></label>
        <label className="quote-form-wide">Project Description<textarea name="description" value={form.description} onChange={onChange} rows="4" required placeholder="What are you looking to build?"/></label>
        <label>Estimated Budget<select name="budget" value={form.budget} onChange={onChange} required><option value="">Select a budget</option><option>Under ₹25,000</option><option>₹25,000–₹50,000</option><option>₹50,000–₹1,00,000</option><option>₹1,00,000+</option><option>Not sure yet</option></select></label>
        <label>Preferred Timeline<select name="timeline" value={form.timeline} onChange={onChange} required><option value="">Select a timeline</option><option>As soon as possible</option><option>Within 1 month</option><option>Within 2–3 months</option><option>Flexible</option></select></label>
        <p className="quote-form-notice">This opens your email app with the enquiry details. The request is not sent until you review and send that email.</p>
        <button className="btn primary quote-submit" type="submit">Request My Quotation <ArrowUpRight size={16}/></button>
      </form>
    </motion.div>
  </motion.div>
}

function ProjectVisual({ type, image, title = 'Project preview' }) {
  const visuals = {
    commerce: { index: '01', word: 'Commerce', symbol: '01—05', note: 'DISCOVER / SELECT / CHECKOUT' },
    portal: { index: '02', word: 'People', symbol: 'TEAM / 24', note: 'PEOPLE / PROJECTS / PROGRESS' },
    service: { index: '03', word: 'Service', symbol: '→', note: 'REQUEST / ASSIGN / RESOLVE' },
    vision: { index: '04', word: 'Vision', symbol: '◉', note: 'SENSE / INTERPRET / RESPOND' },
    cloud: { index: '05', word: 'Cloud', symbol: '01 : 03', note: 'DEPLOY / OBSERVE / SCALE' }
  }
  const visual = visuals[type] || visuals.commerce
  return <div className={`project-visual ${type}`}>
    {image
      ? <img className="project-preview-image" src={image} alt={`${title} website screenshot`} loading="lazy" decoding="async" width="1417" height="768"/>
      : <>
        <div className="visual-topline"><span>INDEPENDENT DIGITAL STUDIO</span><span>{visual.index} / 05</span></div>
        <div className="visual-orbit orbit-a"/><div className="visual-orbit orbit-b"/>
        <div className="visual-content"><span className="visual-symbol">{visual.symbol}</span><span className="visual-word">{visual.word}</span><span className="visual-note">{visual.note}</span></div>
        <div className="visual-bottomline"><span>PRODUCT / SYSTEMS / EXPERIENCE</span><ArrowUpRight size={17}/></div>
      </>}
    <span className="project-image-action">View case study <ArrowUpRight size={15}/></span>
  </div>
}

function PortfolioApp() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = window.localStorage.getItem('codepixel-theme')
    return savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  })
  const [active, setActive] = useState('All')
  const [selected, setSelected] = useState(null)
  const [serviceDetail, setServiceDetail] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [quoteOpen, setQuoteOpen] = useState(false)
  const [quoteForm, setQuoteForm] = useState(initialQuoteForm)
  const [sent, setSent] = useState(false)
  const filtered = useMemo(() => active === 'All' ? projects : projects.filter(p => p.category === active), [active])
  const [activeSection, setActiveSection] = useState('home')
  const [activePricingService, setActivePricingService] = useState(services[0].id)
  const reduceMotion = useReducedMotion()
  const nav = [['Home', '#home'], ['About', '#about'], ['Services', '#services'], ['Projects', '#projects'], ['Templates', '/templates'], ['Pricing', '#pricing'], ['Contact', '#contact']]
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('codepixel-theme', theme)
  }, [theme])
  useEffect(() => {
    const sections = nav.filter(([, href]) => href.startsWith('#')).map(([, href]) => document.querySelector(href)).filter(Boolean)
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActiveSection(visible.target.id)
    }, { rootMargin: '-20% 0px -65% 0px', threshold: [0, 0.1, 0.25, 0.5] })
    sections.forEach(section => observer.observe(section))
    return () => observer.disconnect()
  }, [])
  const update = e => setForm(current => ({ ...current, [e.target.name]: e.target.value, ...(e.target.name === 'type' ? { package: '', selectedPrice: '' } : {}) }))
  const selectPackage = (service, item) => {
    const serviceName = typeof service === 'string' ? service : service.name
    const price = item.price ? packagePrice(item) : ''
    const description = price
      ? `I'm interested in the ${item.name} package for ${serviceName} (starting at ${price}). Please contact me to discuss my requirements.`
      : `I'd like a custom quotation for ${serviceName}. Please contact me to discuss the requirements.`
    setForm(current => ({
      ...current,
      type: serviceName,
      package: item.name,
      selectedPrice: price,
      message: description
    }))
    setQuoteForm(current => ({ ...current, service: serviceName, package: item.name, description }))
    setQuoteOpen(true)
  }
  const updateQuoteForm = event => setQuoteForm(current => ({ ...current, [event.target.name]: event.target.value }))
  const submitQuote = event => {
    event.preventDefault()
    const subject = encodeURIComponent(`Quotation request: ${quoteForm.service} — ${quoteForm.package}`)
    const body = encodeURIComponent([
      `Name: ${quoteForm.name}`,
      `Email: ${quoteForm.email}`,
      `Phone: ${quoteForm.phone}`,
      `Business / Company: ${quoteForm.company || 'Not provided'}`,
      `Service: ${quoteForm.service}`,
      `Package: ${quoteForm.package}`,
      `Estimated budget: ${quoteForm.budget}`,
      `Preferred timeline: ${quoteForm.timeline}`,
      '',
      'Project description:',
      quoteForm.description
    ].join('\n'))
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
  }
  const viewServicePackages = serviceId => {
    setActivePricingService(serviceId)
    setServiceDetail(null)
    window.setTimeout(() => document.getElementById('pricing')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }), 0)
  }
  const contactWhatsAppMessage = `Hi, I'm ${form.name || 'interested in a project'}.\nEmail: ${form.email || 'not provided'}\nService: ${form.type}${form.package ? `\nPackage: ${form.package}` : ''}${form.selectedPrice ? `\nStarting price: ${form.selectedPrice}` : ''}${form.budget ? `\nBudget: ${form.budget}` : ''}\n\nProject details:\n${form.message || 'I would like to discuss my project.'}`
  const submit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Project enquiry from ${form.name}`)
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nService: ${form.type}\nPackage: ${form.package || 'Not selected'}\nStarting price: ${form.selectedPrice || 'Custom quotation / to be scoped'}\nBudget: ${form.budget || 'Not specified'}\n\nProject details:\n${form.message}`)
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
    setSent(true)
  }
  return <div className="site-shell">
    <PageIntro/>
    <header className="header">
      <a className="brand" href="#home" aria-label="CodePixel home"><img className="brand-logo" src="/images/codepixel-logo.png" alt="CodePixel — Build, Innovate, Grow"/></a>
      <nav className="nav" aria-label="Main navigation">
        {nav.map(([label, href]) => <a key={label} className={href.startsWith('#') && activeSection === href.slice(1) ? 'active' : ''} aria-current={href.startsWith('#') && activeSection === href.slice(1) ? 'page' : undefined} href={href} onClick={() => setMobileOpen(false)}>{label}</a>)}
      </nav>
      <button className="theme-toggle" type="button" onClick={() => setTheme(current => current === 'dark' ? 'light' : 'dark')} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
        {theme === 'dark' ? <Sun size={17}/> : <Moon size={17}/>}<span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
      </button>
      <a className="header-cta" href="#contact">Let’s talk <ArrowUpRight size={16}/></a>
      <button className="menu-btn" onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen}>{mobileOpen ? <X/> : <Menu/>}</button>
      <AnimatePresence>{mobileOpen && <motion.nav className="mobile-nav" aria-label="Mobile navigation" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: reduceMotion ? 0 : 0.2 }}>{nav.map(([label, href]) => <a key={label} className={href.startsWith('#') && activeSection === href.slice(1) ? 'active' : ''} aria-current={href.startsWith('#') && activeSection === href.slice(1) ? 'page' : undefined} href={href} onClick={() => setMobileOpen(false)}>{label}<ArrowUpRight size={15}/></a>)}</motion.nav>}</AnimatePresence>
    </header>

    <main>
      <section className="hero section" id="home">
        <div className="hero-copy">
          <div className="eyebrow"><span className="live-dot"/> AVAILABLE FOR SELECT PROJECTS</div>
          <motion.h1 initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: reduceMotion ? 0 : .12, delayChildren: reduceMotion ? 0 : .35 } } }}>
            {['Building Digital', 'Experiences That'].map(line => <motion.span className="hero-title-line" key={line} variants={{ hidden: { opacity: 0, y: reduceMotion ? 0 : 22 }, visible: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : .5 } } }}>{line}</motion.span>)}
            <motion.span className="hero-title-line hero-title-highlight" variants={{ hidden: { opacity: 0, y: reduceMotion ? 0 : 22 }, visible: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : .5 } } }}>Drive Business.</motion.span>
          </motion.h1>
          <p className="hero-text">CodePixel is your technology partner for modern websites, intelligent web applications, e-commerce platforms and innovative software solutions.</p>
          <motion.div className="hero-actions" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduceMotion ? 0 : .62, duration: reduceMotion ? 0 : .4 }}><a className="btn primary" href="#projects">Explore my work <ArrowUpRight size={17}/></a><a className="btn secondary" href="#contact">Let’s work together</a></motion.div>
          <div className="hero-note"><span className="hero-note-line"/><span>Build. Innovate. Grow.</span></div>
        </div>
        <div className="hero-art" aria-label="Abstract digital product illustration">
          <div className="hero-art-glow"/>
          <div className="hero-art-ring ring-one"/><div className="hero-art-ring ring-two"/>
          <div className="pixel-field" aria-hidden="true">{Array.from({ length: 7 }, (_, index) => <i key={index}/>)}</div>
          <motion.img className="hero-illustration" src="/images/codepixel-hero-illustration.svg" alt="CodePixel illustration of a laptop with a code editor, live website preview, and performance dashboard" width="900" height="720" loading="eager" decoding="async" initial={{ opacity: 0, y: reduceMotion ? 0 : 24, scale: reduceMotion ? 1 : .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: reduceMotion ? 0 : .7, delay: reduceMotion ? 0 : .25 }}/>
          <div className="floating-badge badge-react"><Atom size={15}/> React</div>
          <div className="floating-badge badge-api"><Server size={15}/> Node.js</div>
          <div className="floating-badge badge-launch"><Database size={15}/> MongoDB</div>
          <div className="floating-badge badge-js"><Braces size={15}/> JavaScript</div>
          <div className="art-caption">IDEAS / CODE / OUTCOMES</div>
        </div>
      </section>

      <section className="trust-strip"><span>BUILD. INNOVATE. GROW.</span>{['REACT', 'NODE.JS', 'MONGODB', 'JAVASCRIPT', 'REST API'].map(tech => <div key={tech}>{tech}</div>)}</section>

      <section className="section about-section" id="about">
        <SectionHeading number="01" eyebrow="A LITTLE ABOUT THE STUDIO" title="Where creativity" highlight="meets technology." description="CodePixel is a technology and software development studio focused on practical, modern and scalable digital solutions."/>
        <div className="about-grid">
          <Reveal className="about-visual" delay={0.05}><div className="about-visual-frame"><span className="about-visual-label"><Sparkles size={14}/> DIGITAL CRAFT / 01</span><img src="/images/codepixel-about-illustration.svg" alt="Illustration of the CodePixel process: discovering a need, designing an experience, and building a digital product" loading="lazy" decoding="async" width="1417" height="768"/><span className="about-visual-orbit orbit-a"/><span className="about-visual-orbit orbit-b"/></div><div className="about-visual-caption"><span><Atom size={16}/> Ideas into interfaces</span><span className="caption-pixels"><i/><i/><i/></span></div></Reveal>
          <Reveal className="about-editorial"><span className="about-mark">“</span><p className="lead">We bring product thinking and full-stack development together to make digital work feel effortless.</p><p className="muted">From the first conversation through launch, CodePixel focuses on understanding the real problem, making thoughtful choices and delivering software that’s useful, reliable and ready to grow.</p><a className="text-link" href="#contact">Tell us about your project <ArrowUpRight size={16}/></a></Reveal>
          <Reveal className="about-panel" delay={0.12}><div className="about-panel-top"><span>HOW WE THINK ABOUT THE WORK</span><Sparkles size={18}/></div><div className="approach-list"><div><span>01</span><p><strong>Start with people</strong><small>Understand the users and the everyday need.</small></p></div><div><span>02</span><p><strong>Keep it considered</strong><small>Make the useful path clear and intuitive.</small></p></div><div><span>03</span><p><strong>Build for what’s next</strong><small>Choose dependable foundations that can evolve.</small></p></div></div><div className="stats-row"><div><strong>{String(projects.length).padStart(2, '0')}</strong><span>PROJECT SHOWCASES</span></div><div><strong>01—06</strong><span>BUILD PROCESS</span></div><div><strong>FULL</strong><span>STACK DELIVERY</span></div></div></Reveal>
        </div>
      </section>

      <section className="section services-section" id="services">
        <SectionHeading number="02" eyebrow="WHAT I CAN HELP WITH" title="One thoughtful partner," highlight="many ways to build." description="From a first web presence to the systems behind your business, get the right level of development support."/>
        <div className="service-grid">{services.map((service, index) => {
          const ServiceIcon = [Globe2, Layers3, ShoppingCart, Database, LayoutDashboard, Wrench][index]
          const servicePricing = pricingCategories.find(category => category.id === service.id)
          return <Reveal className="service-card" key={service.id} delay={(index % 3) * 0.06}>
            <button type="button" className="service-card-main" onClick={() => setServiceDetail(service)} aria-label={`View ${service.name} details`}>
              <ServiceVisual index={service.visualIndex} title={service.name} image={service.image} imageAlt={service.imageAlt}/>
              <div className="service-card-top"><div className="service-icon"><ServiceIcon size={20}/></div><span>0{index + 1}</span></div>
              <h3>{service.name}</h3><p>{service.description}</p>
              <span className="service-reference-label">{service.imageIsProject ? 'Portfolio example' : 'Illustrative UI preview'}</span>
              <span className="service-examples">{service.examples.slice(0, 3).map(example => <i key={example}>{example}</i>)}</span>
              <span className="service-feature-list">{service.features.slice(0, 2).map(feature => <i key={feature}><Check size={13}/>{feature}</i>)}</span>
            </button>
            <div className="service-card-footer"><span>From <strong>{packagePrice(servicePricing.packages[0])}</strong></span><div><button type="button" className="service-detail-link" onClick={() => setServiceDetail(service)}>View details</button><button type="button" className="service-link" onClick={() => viewServicePackages(service.id)}>View Packages <ArrowUpRight size={14}/></button></div></div>
          </Reveal>
        })}</div>
      </section>

      <PricingSection onSelect={selectPackage} activeServiceId={activePricingService} onServiceChange={setActivePricingService}/>

      <section className="projects-section" id="projects">
        <div className="section projects-inner">
          <SectionHeading number="04" eyebrow="SELECTED WORK" title="A few things" highlight="made with purpose." description="A selection of product ideas, platforms and systems shaped around real-world workflows."/>
          <div className="project-toolbar"><div className="filters" aria-label="Filter projects">{categories.map(category => <button key={category} className={active === category ? 'filter active' : 'filter'} onClick={() => setActive(category)}>{category}</button>)}</div><span className="project-count">{String(filtered.length).padStart(2, '0')} / {String(projects.length).padStart(2, '0')} PROJECTS</span></div>
          <div className="project-grid">{filtered.map((project, index) => <motion.article layout={!reduceMotion} className={`project-card${project.featured ? ' project-featured' : ''}`} key={project.id} initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.3, delay: reduceMotion ? 0 : index * 0.04 }}>
            <button className="project-open" onClick={() => setSelected(project)} aria-label={`View details for ${project.title}`}>
              <ProjectVisual type={project.visual} image={project.image} title={project.title}/>
              <div className="project-info"><div className="project-topline"><span>{project.category}</span><span className="project-status">{project.status}</span></div><h3>{project.title}<ArrowUpRight size={19}/></h3><p>{project.description}</p>{project.stack.length > 0 && <div className="tag-list">{project.stack.slice(0, 4).map(tech => <span key={tech}>{tech}</span>)}</div>}{project.highlights?.length > 0 && <div className="tag-list">{project.highlights.map(highlight => <span key={highlight}>{highlight}</span>)}</div>}<span className="project-detail-link">View project details <ArrowUpRight size={15}/></span></div>
            </button>
            {project.url && <a className="project-live-link" href={project.url} target="_blank" rel="noreferrer">Visit live website <ExternalLink size={14}/></a>}
          </motion.article>)}</div>
        </div>
      </section>

      <section className="skills-section">
        <div className="section skills-inner"><div className="skills-intro"><div className="section-label"><span>05</span> THE TOOLKIT</div><h2>Powered by<br/><span>modern technology.</span></h2><p className="muted">A practical, modern stack for building useful digital products end to end.</p></div><div className="skill-grid">{skills.map((skill, index) => <Reveal className="skill-card" key={skill.name} delay={(index % 5) * 0.04}><span className={`skill-icon skill-icon-${index}`}><skill.icon size={20}/></span><span>{skill.name}</span></Reveal>)}</div></div>
      </section>

      <section className="section why-section">
        <SectionHeading number="06" eyebrow="WHY CODEPIXEL" title="Thoughtful work," highlight="built to last." description="A practical partner for teams that value clear communication, considered design and dependable engineering."/>
        <div className="why-grid">{[
          [Layers3, 'Modern by design', 'Responsive experiences with a clear focus on the people using them.'],
          [Code2, 'Built around your needs', 'Custom solutions shaped around real requirements, not one-size-fits-all templates.'],
          [Database, 'Ready to grow', 'Scalable foundations and maintainable code make the next step easier.'],
          [MessageCircle, 'Clear communication', 'Transparent project updates and a collaborative process from start to launch.'],
          [Check, 'Quality at every step', 'Careful implementation and testing keep the important details in view.'],
          [Wrench, 'Support beyond launch', 'Practical technical support to help your product keep moving forward.']
        ].map(([Icon, title, description], index) => <Reveal className="why-card" key={title} delay={(index % 3) * 0.05}><span className="why-icon"><Icon size={20}/></span><h3>{title}</h3><p>{description}</p></Reveal>)}</div>
      </section>

      <section className="testimonials-section">
        <div className="section testimonials-inner"><div className="section-label"><span>07</span> CLIENT STORIES</div><h2>Good work is built<br/><span>on good partnerships.</span></h2><div className="testimonial-placeholder"><MessageCircle size={21}/><p>Client stories are being gathered. Check back soon for feedback from the people behind the projects.</p></div></div>
      </section>

      <section className="section process-section" id="process">
        <SectionHeading number="08" eyebrow="A CLEAR WAY OF WORKING" title="A good process makes" highlight="good work repeatable." description="Stay close to the work, know what happens next and make decisions with confidence."/>
        <div className="process-grid">{[['01', 'Discover', 'Understand your goals, users and requirements before defining the right scope.'], ['02', 'Design', 'Shape the experience and technical plan before development begins.'], ['03', 'Develop', 'Build the product in focused steps and integrate the right features.'], ['04', 'Test', 'Verify key flows and refine the details across devices.'], ['05', 'Launch', 'Deploy with care and prepare for a smooth handover.'], ['06', 'Support', 'Keep improving with practical maintenance and assistance.']].map(([number, title, description], index) => <Reveal className="process-item" key={number} delay={index * 0.04}><span className="process-number">{number}</span><span className="process-line"/><h3>{title}</h3><p>{description}</p></Reveal>)}</div>
      </section>

      <section className="contact-section" id="contact">
        <div className="section contact-inner"><div className="contact-copy"><div className="section-label"><span>09</span> LET’S MAKE SOMETHING USEFUL</div><h2>Let’s build<br/><span>something great.</span></h2><p>Tell us what you have in mind. We can work out the right scope, timeline and next step together.</p><div className="contact-links"><a href={`mailto:${CONTACT_EMAIL}`}><Mail size={17}/> {CONTACT_EMAIL}</a><a href={whatsappUrl('Hi, I would like to discuss a project.')} target="_blank" rel="noreferrer"><MessageCircle size={17}/> Start a WhatsApp chat <ArrowUpRight size={14}/></a></div><div className="social-links"><a href="https://github.com/" aria-label="GitHub profile"><Github size={18}/></a><a href="https://linkedin.com/" aria-label="LinkedIn profile"><Linkedin size={18}/></a></div></div>
          <form className="contact-form" onSubmit={submit} id="project-inquiry-form"><div className="form-title"><span>START A CONVERSATION</span><ArrowUpRight size={18}/></div>
            <label>Your name<input name="name" value={form.name} onChange={update} placeholder="Jane Smith" required/></label>
            <label>Email address<input name="email" type="email" value={form.email} onChange={update} placeholder="you@company.com" required/></label>
            <label>What do you need?<select name="type" value={form.type} onChange={update}>{services.map(service => <option key={service.id}>{service.name}</option>)}<option>Custom project / quote</option></select></label>
            <label>Selected package<input name="package" value={form.package} onChange={update} placeholder="Choose a package above or enter one"/></label>
            {form.selectedPrice && <div className="selected-package-summary"><span>Selected starting price</span><strong>{form.selectedPrice}</strong></div>}
            <label>Budget range<select name="budget" value={form.budget} onChange={update}><option value="">Select a budget range</option><option>Under ₹25,000</option><option>₹25,000 – ₹75,000</option><option>₹75,000 – ₹1,50,000</option><option>₹1,50,000+</option><option>Not sure yet</option></select></label>
            <label>Project details<textarea name="message" value={form.message} onChange={update} placeholder="What are you looking to build?" rows="4" required/></label>
            <button className="btn primary submit-btn" type="submit">Send project inquiry <ArrowUpRight size={17}/></button>
            <a className="contact-whatsapp" href={whatsappUrl(contactWhatsAppMessage)} target="_blank" rel="noreferrer"><MessageCircle size={16}/> Or send this inquiry on WhatsApp</a>
            <small>{sent ? 'Your email app should open with the inquiry filled in.' : 'This form opens your email app with the details filled in.'}</small>
          </form>
        </div>
      </section>
    </main>
    <AnimatePresence>{quoteOpen && <QuoteRequestModal form={quoteForm} onChange={updateQuoteForm} onClose={() => setQuoteOpen(false)} onSubmit={submitQuote}/>}</AnimatePresence>
    <footer className="footer">
      <div className="footer-main"><a className="brand" href="#home" aria-label="CodePixel home"><img className="brand-logo" src="/images/codepixel-logo.png" alt="CodePixel — Build, Innovate, Grow"/></a><p>CodePixel builds modern websites, web applications and software that help businesses move forward.</p></div>
      <div className="footer-links"><span>EXPLORE</span>{[['Home', '#home'], ['About', '#about'], ['Services', '#services'], ['Projects', '#projects'], ['Pricing', '#pricing'], ['Process', '#process'], ['Contact', '#contact']].map(([label, href]) => <a key={label} href={href}>{label}</a>)}</div>
      <div className="footer-links"><span>GET IN TOUCH</span><a href="#contact">Start a project <ArrowUpRight size={14}/></a><a href={`mailto:${CONTACT_EMAIL}`}><Mail size={14}/>{CONTACT_EMAIL}</a><a href={whatsappUrl('Hi, I would like to discuss a project.')} target="_blank" rel="noreferrer"><MessageCircle size={14}/> WhatsApp <ArrowUpRight size={13}/></a></div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} CodePixel. Build. Innovate. Grow.</span><a className="footer-top" href="#home">Back to top ↑</a></div>
    </footer>

    <AnimatePresence>{selected && <motion.div className="modal-backdrop" role="presentation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.2 }} onClick={() => setSelected(null)}><motion.div className="project-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" initial={{ y: reduceMotion ? 0 : 25, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: reduceMotion ? 0 : 25, opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.2 }} onClick={event => event.stopPropagation()}><button className="modal-close" onClick={() => setSelected(null)} aria-label="Close project details"><X/></button><ProjectVisual type={selected.visual} image={selected.image} title={selected.title}/><div className="modal-content"><span className="section-label">{selected.category} / {selected.status}</span><h2 id="modal-title">{selected.title}</h2><p>{selected.details}</p>{selected.stack.length > 0 && <><h4>Technology stack</h4><div className="tag-list">{selected.stack.map(tech => <span key={tech}>{tech}</span>)}</div></>}{selected.highlights?.length > 0 && <><h4>Project highlights</h4><div className="tag-list">{selected.highlights.map(highlight => <span key={highlight}>{highlight}</span>)}</div></>}<div className="outcome"><b>Project focus</b><p>{selected.outcome}</p></div><div className="modal-actions">{selected.url && <a className="btn primary" href={selected.url} target="_blank" rel="noreferrer">Visit live website <ExternalLink size={15}/></a>}<a className="btn secondary" href="#contact" onClick={() => setSelected(null)}>Discuss a similar project <ArrowUpRight size={16}/></a></div></div></motion.div></motion.div>}</AnimatePresence>
    <AnimatePresence>{serviceDetail && <ServiceDetails service={serviceDetail} onClose={() => setServiceDetail(null)} onViewPackages={viewServicePackages}/>}</AnimatePresence>
  </div>
}
function App() {
  const location = useLocation()
  const isMarketplace = location.pathname.startsWith('/templates')
    || location.pathname.startsWith('/template/')
    || location.pathname.startsWith('/customize/')
    || location.pathname === '/pricing'
    || location.pathname.startsWith('/admin/')
  return isMarketplace
    ? <Routes>
      <Route path="/templates" element={<MarketplacePage/>}/>
      <Route path="/templates/websites" element={<MarketplacePage/>}/>
      <Route path="/templates/admin-dashboards" element={<MarketplacePage/>}/>
      <Route path="/templates/web-applications" element={<MarketplacePage/>}/>
      <Route path="/templates/category/:slug" element={<MarketplacePage/>}/>
      <Route path="/template/:slug" element={<MarketplacePage/>}/>
      <Route path="/template/:slug/preview" element={<MarketplacePage/>}/>
      <Route path="/customize/:slug" element={<MarketplacePage/>}/>
      <Route path="/pricing" element={<MarketplacePage/>}/>
      <Route path="/admin/marketplace" element={<MarketplacePage/>}/>
      <Route path="*" element={<MarketplacePage/>}/>
    </Routes>
    : <PortfolioApp/>
}
export default App