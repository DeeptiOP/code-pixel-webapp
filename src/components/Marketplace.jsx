import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Check, ChevronLeft, ChevronRight, ExternalLink, LayoutDashboard, LoaderCircle, LockKeyhole, LogOut, Mail, Menu, Monitor, Search, Smartphone, Tablet, X } from 'lucide-react'
import { motion } from 'framer-motion'
import '../marketplace.css'

const API_BASE = `${(import.meta.env.VITE_API_URL || '').replace(/\/$/, '')}/api`
const templateTypes = [
  { value: '', label: 'All templates' },
  { value: 'website', label: 'Websites' },
  { value: 'admin-dashboard', label: 'Admin dashboards' },
  { value: 'web-application', label: 'Web applications' }
]
const enquiryStatuses = ['New', 'Contacted', 'Reviewing', 'Quotation Sent', 'Approved', 'Rejected', 'Converted']
const typeLabels = { website: 'Website', 'admin-dashboard': 'Admin dashboard', 'web-application': 'Web application' }

async function api(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers
    }
  })
  if (response.status === 204) return null
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new Error(payload.error || `Request failed (${response.status})`)
    error.details = payload.details || []
    throw error
  }
  return payload
}

function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem('codepixel-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('codepixel-theme', theme)
  }, [theme])
  return [theme, () => setTheme(value => value === 'dark' ? 'light' : 'dark')]
}

function MarketplaceHeader({ theme, toggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const links = [
    ['/templates', 'All templates'],
    ['/templates/websites', 'Websites'],
    ['/templates/admin-dashboards', 'Admin dashboards'],
    ['/templates/web-applications', 'Web applications'],
    ['/pricing', 'Pricing']
  ]
  return <header className="market-header">
    <Link className="market-brand" to="/" aria-label="CodePixel home"><img src="/images/codepixel-logo.png" alt="CodePixel"/></Link>
    <nav className={menuOpen ? 'market-nav open' : 'market-nav'} aria-label="Marketplace navigation">
      {links.map(([href, label]) => <Link key={href} to={href} onClick={() => setMenuOpen(false)}>{label}</Link>)}
      <a href="/#contact" onClick={() => setMenuOpen(false)}>Custom development</a>
    </nav>
    <div className="market-header-actions">
      <button className="market-theme" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>{theme === 'dark' ? 'Light' : 'Dark'}</button>
      <Link className="market-contact" to="/#contact">Let’s talk <ArrowUpRight size={15}/></Link>
      <button className="market-menu" type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(value => !value)}>{menuOpen ? <X/> : <Menu/>}</button>
    </div>
  </header>
}

function TemplateArtwork({ template, compact = false }) {
  const panels = template?.type === 'admin-dashboard' ? ['68%', '39%', '82%', '53%'] : ['44%', '74%', '57%']
  return <div className={`template-artwork ${compact ? 'compact' : ''} type-${template?.type || 'website'}`} aria-label={`Illustrative ${typeLabels[template?.type] || 'website'} interface preview`}>
    <div className="art-browser"><span/><span/><span/><i>{template?.category?.name || 'CODEPIXEL / TEMPLATE'}</i></div>
    <div className="art-layout">
      {template?.type === 'admin-dashboard' && <aside><b/><b/><b/><b/></aside>}
      <div className="art-canvas">
        <div className="art-copy"><b/><b/><i/></div>
        <div className="art-metrics">{panels.map((width, index) => <span key={index} style={{ width }} />)}</div>
        <div className="art-cards"><i/><i/><i/></div>
      </div>
    </div>
    {!compact && <span className="art-label">Illustrative interface concept · not a live demo</span>}
  </div>
}

function PriceLabel({ template }) {
  if (template.pricingType === 'free') return <>Free</>
  if (template.pricingType === 'fixed' && Number.isFinite(template.price)) return <>₹{new Intl.NumberFormat('en-IN').format(template.price)}</>
  return <>Custom quote</>
}

function TemplateCard({ template }) {
  return <motion.article className="template-card" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.28 }}>
    <Link className="template-card-art" to={`/template/${template.slug}`}>{template.thumbnail ? <img className="template-card-image" src={template.thumbnail} alt={`${template.name} preview`} loading="lazy" decoding="async"/> : <TemplateArtwork template={template} compact/>}<span className="template-type-pill">{typeLabels[template.type]}</span></Link>
    <div className="template-card-body">
      <div className="template-meta"><span>{template.category?.name || template.industry}</span><span>{template.responsive ? 'Responsive' : 'Desktop'}</span></div>
      <h3><Link to={`/template/${template.slug}`}>{template.name}</Link></h3>
      <p>{template.shortDescription}</p>
      <div className="template-card-stack">{template.technologies?.slice(0, 3).map(tech => <span key={tech}>{tech}</span>)}</div>
      <div className="template-card-footer"><strong><PriceLabel template={template}/></strong><Link to={`/template/${template.slug}`}>View details <ArrowUpRight size={15}/></Link></div>
    </div>
  </motion.article>
}

function RequestForm({ template, onSubmitted }) {
  const [form, setForm] = useState({
    businessName: '', name: '', email: '', phone: '', businessDescription: '',
    pages: '', features: '', designPreferences: '', referenceUrls: '', domainHosting: '',
    budget: '', expectedDelivery: '', comments: ''
  })
  const [state, setState] = useState({ loading: false, error: '', reference: '' })
  const update = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }))
  const submit = async event => {
    event.preventDefault()
    setState({ loading: true, error: '', reference: '' })
    try {
      const result = await api('/template-enquiries', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          templateSlug: template?.slug || '',
          pages: form.pages.split('\n').map(value => value.trim()).filter(Boolean),
          features: form.features.split('\n').map(value => value.trim()).filter(Boolean),
          referenceUrls: form.referenceUrls.split('\n').map(value => value.trim()).filter(Boolean)
        })
      })
      setState({ loading: false, error: '', reference: result.reference })
      onSubmitted?.(result.reference)
    } catch (error) {
      setState({ loading: false, error: error.message, reference: '' })
    }
  }

  if (state.reference) return <div className="enquiry-success" role="status"><span><Check size={20}/></span><h2>Enquiry received</h2><p>Your reference is <strong>{state.reference}</strong>. The team can review your requirements in the marketplace admin.</p><p>No payment has been taken.</p><Link className="market-button secondary" to="/templates">Back to templates <ArrowUpRight size={15}/></Link></div>
  return <form className="market-form" onSubmit={submit}>
    <div className="market-form-heading"><span className="market-kicker">CUSTOMIZATION REQUEST</span><h2>{template ? `Customize ${template.name}` : 'Tell us about your project'}</h2><p>We save this enquiry securely so the CodePixel team can review it.</p></div>
    {state.error && <div className="market-alert error" role="alert">{state.error}</div>}
    <div className="market-form-grid">
      <label>Business name<input name="businessName" maxLength="120" value={form.businessName} onChange={update}/></label>
      <label>Your name<input name="name" autoComplete="name" maxLength="100" required value={form.name} onChange={update}/></label>
      <label>Email address<input name="email" type="email" autoComplete="email" maxLength="254" required value={form.email} onChange={update}/></label>
      <label>Phone number<input name="phone" type="tel" autoComplete="tel" maxLength="30" value={form.phone} onChange={update}/></label>
      <label className="market-form-wide">Business / project description<textarea name="businessDescription" minLength="10" maxLength="5000" rows="4" required value={form.businessDescription} onChange={update} placeholder="What are you building and who is it for?"/></label>
      <label>Required pages (one per line)<textarea name="pages" maxLength="2000" rows="3" value={form.pages} onChange={update}/></label>
      <label>Additional features (one per line)<textarea name="features" maxLength="3000" rows="3" value={form.features} onChange={update}/></label>
      <label>Design and colors<textarea name="designPreferences" maxLength="1000" rows="2" value={form.designPreferences} onChange={update}/></label>
      <label>Reference URLs (HTTPS, one per line)<textarea name="referenceUrls" maxLength="2000" rows="2" value={form.referenceUrls} onChange={update}/></label>
      <label>Domain / hosting requirements<input name="domainHosting" maxLength="500" value={form.domainHosting} onChange={update}/></label>
      <label>Budget<input name="budget" maxLength="80" value={form.budget} onChange={update} placeholder="e.g. ₹25,000–₹50,000"/></label>
      <label>Expected delivery date<input name="expectedDelivery" type="date" value={form.expectedDelivery} onChange={update}/></label>
      <label className="market-form-wide">Additional comments<textarea name="comments" maxLength="3000" rows="3" value={form.comments} onChange={update}/></label>
    </div>
    <p className="market-form-note">File attachments are not enabled until a secure storage provider is configured. Do not include sensitive credentials in this form.</p>
    <button className="market-button primary" type="submit" disabled={state.loading}>{state.loading ? <LoaderCircle className="spin" size={17}/> : null}{state.loading ? 'Submitting…' : 'Submit requirements'} <ArrowUpRight size={16}/></button>
  </form>
}

function useMarketplaceData() {
  const [categories, setCategories] = useState([])
  const [categoryError, setCategoryError] = useState('')
  useEffect(() => {
    let active = true
    api('/template-categories').then(data => {
      if (active) setCategories(data.categories)
    }).catch(error => {
      if (active) setCategoryError(error.message)
    })
    return () => { active = false }
  }, [])
  return { categories, categoryError }
}

function CataloguePage({ type = '', categorySlug = '' }) {
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const [query, setQuery] = useState(params.get('q') || '')
  const [industry, setIndustry] = useState(params.get('industry') || '')
  const [pricingType, setPricingType] = useState(params.get('pricingType') || '')
  const [minPrice, setMinPrice] = useState(params.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(params.get('maxPrice') || '')
  const [technology, setTechnology] = useState(params.get('technology') || '')
  const [sort, setSort] = useState(params.get('sort') || 'latest')
  const [responsive, setResponsive] = useState(false)
  const [featured, setFeatured] = useState(false)
  const [popular, setPopular] = useState(false)
  const [page, setPage] = useState(1)
  const [result, setResult] = useState({ templates: [], pagination: { pages: 0, total: 0 } })
  const [featuredTemplates, setFeaturedTemplates] = useState([])
  const [popularTemplates, setPopularTemplates] = useState([])
  const [state, setState] = useState({ loading: true, error: '' })
  const [reloadCount, setReloadCount] = useState(0)
  const { categories, categoryError } = useMarketplaceData()
  const navigate = useNavigate()
  const activeCategory = categories.find(item => item.slug === categorySlug)
  const title = activeCategory?.name || templateTypes.find(item => item.value === type)?.label || 'Website & application templates'
  const paramsKey = useMemo(() => {
    const values = new URLSearchParams()
    if (query.trim()) values.set('q', query.trim())
    if (type) values.set('type', type)
    if (categorySlug) values.set('category', categorySlug)
    if (industry) values.set('industry', industry)
    if (pricingType) values.set('pricingType', pricingType)
    if (minPrice) values.set('minPrice', minPrice)
    if (maxPrice) values.set('maxPrice', maxPrice)
    if (technology.trim()) values.set('technologies', technology.trim())
    if (responsive) values.set('responsive', 'true')
    if (featured) values.set('featured', 'true')
    if (popular) values.set('popular', 'true')
    values.set('sort', sort)
    values.set('page', String(page))
    values.set('limit', '12')
    return values.toString()
  }, [query, type, categorySlug, industry, pricingType, minPrice, maxPrice, technology, responsive, featured, popular, sort, page])

  useEffect(() => {
    let active = true
    setState({ loading: true, error: '' })
    const timer = window.setTimeout(() => {
      api(`/templates?${paramsKey}`).then(data => {
        if (active) {
          setResult(data)
          setState({ loading: false, error: '' })
        }
      }).catch(error => {
        if (active) setState({ loading: false, error: error.message })
      })
    }, 180)
    return () => {
      active = false
      window.clearTimeout(timer)
    }
  }, [paramsKey, reloadCount])

  useEffect(() => {
    if (type || categorySlug) return undefined
    let active = true
    Promise.all([api('/templates/featured'), api('/templates/popular')]).then(([featuredData, popularData]) => {
      if (active) {
        setFeaturedTemplates(featuredData.templates)
        setPopularTemplates(popularData.templates)
      }
    }).catch(() => {
      if (active) {
        setFeaturedTemplates([])
        setPopularTemplates([])
      }
    })
    return () => { active = false }
  }, [type, categorySlug])

  const clearFilters = () => {
    setQuery('')
    setIndustry('')
    setPricingType('')
    setMinPrice('')
    setMaxPrice('')
    setTechnology('')
    setResponsive(false)
    setFeatured(false)
    setPopular(false)
    setPage(1)
  }
  return <div className="market-page">
    <section className="market-catalogue">
      <div className="market-breadcrumb"><Link to="/">Home</Link><ChevronRight size={14}/><span>Templates</span>{activeCategory && <><ChevronRight size={14}/><span>{activeCategory.name}</span></>}</div>
      <div className="market-catalogue-head"><div><span className="market-kicker">CODEPIXEL / TEMPLATE MARKETPLACE</span><h1>{title}<br/><em>Built around your next idea.</em></h1><p>Explore implementation starting points, compare scope and request a tailored quote. Interface previews are illustrative unless a live demo is explicitly available.</p></div><div className="market-catalogue-mark"><LayoutDashboard size={36}/><span>{result.pagination?.total || '—'} listed</span></div></div>
      <div className="market-type-links">{templateTypes.map(item => <Link key={item.value || 'all'} className={(type === item.value && !categorySlug) ? 'active' : ''} to={item.value ? `/templates/${item.value === 'admin-dashboard' ? 'admin-dashboards' : item.value === 'web-application' ? 'web-applications' : 'websites'}` : '/templates'}>{item.label}</Link>)}</div>
      {!type && !categorySlug && <div className="market-home-content">
        <section className="market-category-section"><div className="market-section-heading"><span className="market-kicker">EXPLORE BY CATEGORY</span><h2>Start with the kind of product you need.</h2></div><div className="market-category-grid">{categories.map(item => <Link key={item._id} to={`/templates/category/${item.slug}`}>{item.image ? <img src={item.image} alt="" loading="lazy"/> : <span>{item.type === 'admin-dashboard' ? <LayoutDashboard size={17}/> : <Monitor size={17}/>}</span>}<strong>{item.name}</strong><small>{typeLabels[item.type]}</small><ArrowUpRight size={14}/></Link>)}</div></section>
        {featuredTemplates.length > 0 && <section className="market-featured-section"><div className="market-section-heading"><span className="market-kicker">CURATED STARTING POINTS</span><h2>Featured templates</h2></div><div className="template-grid">{featuredTemplates.slice(0, 4).map(template => <TemplateCard key={template._id} template={template}/>)}</div></section>}
        {popularTemplates.length > 0 && <section className="market-featured-section"><div className="market-section-heading"><span className="market-kicker">POPULAR COLLECTION</span><h2>Popular starting points</h2></div><div className="template-grid">{popularTemplates.slice(0, 4).map(template => <TemplateCard key={template._id} template={template}/>)}</div></section>}
        <section className="market-promise"><div><span className="market-kicker">MADE FOR REAL PROJECTS</span><h2>Useful foundations.<br/><em>Thoughtful customization.</em></h2><p>Website development · Web applications · E-commerce · Admin dashboards · Ongoing maintenance</p><p>These listings describe development concepts. A live demo, price or external integration is shown only when it has been configured for that template.</p></div><Link className="market-button secondary" to="/#contact">Request custom development <ArrowUpRight size={16}/></Link></section>
      </div>}
      <div className="market-browse-layout">
        <aside className="market-filters">
          <div className="filter-heading"><h2>Filters</h2><button type="button" onClick={clearFilters}>Clear all</button></div>
          <label className="market-search"><Search size={16}/><input aria-label="Search templates" placeholder="Search templates" value={query} onChange={event => { setQuery(event.target.value); setPage(1) }}/></label>
          <label>Category<select value={categorySlug} onChange={event => { if (!event.target.value) navigate(type ? `/templates/${type === 'admin-dashboard' ? 'admin-dashboards' : type === 'web-application' ? 'web-applications' : 'websites'}` : '/templates'); else navigate(`/templates/category/${event.target.value}`) }}><option value="">All categories</option>{categories.filter(item => !type || item.type === type).map(item => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select></label>
          <label>Industry<input value={industry} maxLength="80" onChange={event => { setIndustry(event.target.value); setPage(1) }} placeholder="e.g. Education"/></label>
          <label>Technology<input value={technology} maxLength="40" onChange={event => { setTechnology(event.target.value); setPage(1) }} placeholder="e.g. React"/></label>
          <label>Pricing<select value={pricingType} onChange={event => { setPricingType(event.target.value); setPage(1) }}><option value="">Any pricing</option><option value="free">Free</option><option value="fixed">Fixed price</option><option value="custom">Custom quote</option></select></label>
          <label>Minimum price (₹)<input type="number" min="0" max="100000000" value={minPrice} onChange={event => { setMinPrice(event.target.value); setPage(1) }}/></label>
          <label>Maximum price (₹)<input type="number" min="0" max="100000000" value={maxPrice} onChange={event => { setMaxPrice(event.target.value); setPage(1) }}/></label>
          <div className="market-checks"><label><input type="checkbox" checked={responsive} onChange={event => { setResponsive(event.target.checked); setPage(1) }}/> Responsive availability</label><label><input type="checkbox" checked={featured} onChange={event => { setFeatured(event.target.checked); setPage(1) }}/> Featured</label><label><input type="checkbox" checked={popular} onChange={event => { setPopular(event.target.checked); setPage(1) }}/> Popular</label></div>
          {categoryError && <p className="market-inline-error">Category filters unavailable: {categoryError}</p>}
        </aside>
        <div className="market-results">
          <div className="market-results-toolbar"><span>{state.loading ? 'Loading templates…' : `${result.pagination?.total || 0} templates`}</span><label>Sort by<select value={sort} onChange={event => { setSort(event.target.value); setPage(1) }}><option value="latest">Latest</option><option value="popular">Most popular</option><option value="price-low">Price low to high</option><option value="price-high">Price high to low</option></select></label></div>
          {state.error && <div className="market-alert error" role="alert"><strong>Marketplace catalogue unavailable.</strong> {state.error} <button type="button" onClick={() => setReloadCount(value => value + 1)}>Retry</button></div>}
          {state.loading && <div className="template-grid">{Array.from({ length: 6 }, (_, index) => <div className="template-skeleton" key={index}><i/><b/><span/><span/></div>)}</div>}
          {!state.loading && !state.error && result.templates.length > 0 && <div className="template-grid">{result.templates.map(template => <TemplateCard key={template._id} template={template}/>)}</div>}
          {!state.loading && !state.error && result.templates.length === 0 && <div className="market-empty"><Search size={24}/><h2>No templates match those filters</h2><p>Try a different search or clear some filters.</p><button className="market-button secondary" onClick={clearFilters}>Clear filters</button></div>}
          {!state.loading && result.pagination?.pages > 1 && <div className="market-pagination"><button type="button" disabled={page <= 1} onClick={() => setPage(value => value - 1)}><ChevronLeft size={16}/> Previous</button><span>Page {page} of {result.pagination.pages}</span><button type="button" disabled={page >= result.pagination.pages} onClick={() => setPage(value => value + 1)}>Next <ChevronRight size={16}/></button></div>}
        </div>
      </div>
    </section>
  </div>
}

function TemplateDetailsPage({ slug }) {
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let active = true
    setLoading(true)
    api(`/templates/${encodeURIComponent(slug)}`).then(data => {
      if (active) {
        setResult(data)
        setError('')
        setLoading(false)
      }
    }).catch(err => {
      if (active) {
        setError(err.message)
        setLoading(false)
      }
    })
    return () => { active = false }
  }, [slug])
  if (loading) return <div className="market-state"><LoaderCircle className="spin"/> Loading template details…</div>
  if (error) return <div className="market-state"><h1>Template details unavailable</h1><p>{error}</p><Link className="market-button secondary" to="/templates">Back to catalogue</Link></div>
  const { template, related } = result
  return <div className="market-detail">
    <div className="market-breadcrumb"><Link to="/templates">Templates</Link><ChevronRight size={14}/><span>{template.name}</span></div>
    <div className="detail-hero"><div><div className="template-meta"><span>{template.category?.name}</span><span>{typeLabels[template.type]}</span></div><h1>{template.name}</h1><p>{template.fullDescription}</p><div className="detail-actions">{template.demoStatus === 'available' && template.demoUrl ? <Link className="market-button primary" to={`/template/${template.slug}/preview`}>Live Preview <ExternalLink size={16}/></Link> : <span className="demo-unavailable">Live demo not configured</span>}<Link className="market-button secondary" to={`/customize/${template.slug}`}>Request customization <ArrowUpRight size={16}/></Link></div></div>{template.thumbnail ? <img className="detail-thumbnail" src={template.thumbnail} alt={`${template.name} illustrative preview`} loading="eager"/> : <TemplateArtwork template={template}/>}</div>
    {template.gallery?.length > 0 && <section className="template-gallery"><div className="market-section-heading"><span className="market-kicker">GALLERY</span><h2>Preview images</h2></div><div>{template.gallery.map((image, index) => <img key={image} src={image} alt={`${template.name} preview ${index + 1}`} loading="lazy" decoding="async"/>)}</div></section>}
    <div className="detail-content-grid"><section><span className="market-kicker">WHAT’S INCLUDED</span><h2>Designed as a starting point</h2><ul className="market-feature-list">{template.features?.map(feature => <li key={feature}><Check size={16}/>{feature}</li>)}</ul><p className="market-detail-note">This listing describes a customizable development starting point. It is not a downloadable product or a completed client project.</p></section><aside className="detail-specs"><h2>Template information</h2><dl><div><dt>Category</dt><dd>{template.category?.name}</dd></div><div><dt>Industry</dt><dd>{template.industry}</dd></div><div><dt>Price</dt><dd><PriceLabel template={template}/></dd></div><div><dt>Responsive</dt><dd>{template.responsive ? 'Desktop, tablet and mobile' : 'Desktop layout'}</dd></div><div><dt>Demo</dt><dd>{template.demoStatus === 'available' ? 'Configured' : template.demoStatus === 'restricted' ? 'Restricted access' : 'Not available yet'}</dd></div></dl><h3>Technology</h3><div className="template-card-stack">{template.technologies?.map(value => <span key={value}>{value}</span>)}</div><h3>Integrations</h3><p>{template.integrations?.length ? template.integrations.join(', ') : 'Agreed during project scoping.'}</p><h3>Customization</h3><p>{template.customization?.join(', ') || 'Scope to be agreed.'}</p></aside></div>
    {related?.length > 0 && <section className="related-templates"><div className="market-section-heading"><span className="market-kicker">KEEP EXPLORING</span><h2>Related templates</h2></div><div className="template-grid">{related.map(item => <TemplateCard key={item._id} template={item}/>)}</div></section>}
  </div>
}

function PreviewPage({ slug }) {
  const [template, setTemplate] = useState(null)
  const [error, setError] = useState('')
  const [device, setDevice] = useState('desktop')
  const frame = useRef(null)
  useEffect(() => {
    let active = true
    api(`/templates/${encodeURIComponent(slug)}`).then(data => { if (active) setTemplate(data.template) }).catch(err => { if (active) setError(err.message) })
    return () => { active = false }
  }, [slug])
  if (error) return <div className="market-state"><h1>Preview unavailable</h1><p>{error}</p><Link to={`/template/${slug}`}>Back to template</Link></div>
  if (!template) return <div className="market-state"><LoaderCircle className="spin"/> Loading preview…</div>
  if (template.demoStatus !== 'available' || !template.demoUrl) return <div className="preview-unavailable"><span className="market-kicker">DEMO STATUS</span><h1>A live demo isn’t configured yet.</h1><p>{template.name} currently has an illustrative interface preview only. We won’t present a static image as a working demo.</p><TemplateArtwork template={template}/><Link className="market-button secondary" to={`/template/${template.slug}`}>Back to template details <ArrowLeft size={16}/></Link></div>
  const deviceOptions = [{ value: 'desktop', label: 'Desktop', icon: Monitor }, { value: 'tablet', label: 'Tablet', icon: Tablet }, { value: 'mobile', label: 'Mobile', icon: Smartphone }]
  return <div className="preview-page">
    <div className="preview-toolbar"><Link to={`/template/${template.slug}`}><ArrowLeft size={16}/> Back to details</Link><strong>{template.name}</strong><div className="preview-devices">{deviceOptions.map(({ value, label, icon: Icon }) => <button key={value} className={device === value ? 'active' : ''} aria-label={`${label} preview`} onClick={() => setDevice(value)}><Icon size={16}/></button>)}<button aria-label="Fullscreen preview" onClick={() => frame.current?.requestFullscreen?.()}><ExternalLink size={15}/></button></div></div>
    <div className="preview-frame-wrap"><iframe ref={frame} className={`preview-frame ${device}`} src={template.demoUrl} title={`${template.name} live demo`} sandbox="allow-scripts allow-forms allow-popups" referrerPolicy="no-referrer" loading="eager"/></div>
  </div>
}

function PricingPage() {
  const offerings = [
    ['Free templates', 'Available when listed as free; review each template details page for actual availability.'],
    ['Fixed-price templates', 'A configured one-time INR price, displayed only when explicitly set by an administrator.'],
    ['Custom quote', 'Most catalogue entries require a scope discussion and a tailored quotation.'],
    ['Custom development', 'See service starting prices and discuss your project with CodePixel.']
  ]
  return <div className="market-simple-page"><span className="market-kicker">PRICING / TRANSPARENT BY DESIGN</span><h1>Know what’s included<br/><em>before you enquire.</em></h1><p>Marketplace prices are configured per template. Project complexity, integrations and delivery scope affect custom quotations.</p><div className="pricing-offering-grid">{offerings.map(([title, copy]) => <article key={title}><span><Check size={16}/></span><h2>{title}</h2><p>{copy}</p></article>)}</div><h2>Custom development packages</h2><p>For current website, web application, e-commerce, backend, dashboard and maintenance packages, visit the main CodePixel pricing section.</p><Link className="market-button primary" to="/#pricing">View service pricing <ArrowUpRight size={16}/></Link></div>
}

function CustomizePage({ slug }) {
  const [template, setTemplate] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => {
    let active = true
    api(`/templates/${encodeURIComponent(slug)}`).then(data => { if (active) setTemplate(data.template) }).catch(err => { if (active) setError(err.message) })
    return () => { active = false }
  }, [slug])
  if (error) return <div className="market-state"><h1>Customization request unavailable</h1><p>{error}</p><Link to="/templates">Back to templates</Link></div>
  if (!template) return <div className="market-state"><LoaderCircle className="spin"/> Loading template…</div>
  return <div className="market-customize-page"><div className="market-breadcrumb"><Link to={`/template/${template.slug}`}>{template.name}</Link><ChevronRight size={14}/><span>Customization request</span></div><RequestForm template={template}/></div>
}

function AdminPage() {
  const [admin, setAdmin] = useState(null)
  const [login, setLogin] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [overview, setOverview] = useState(null)
  const [templates, setTemplates] = useState([])
  const [categories, setCategories] = useState([])
  const [enquiries, setEnquiries] = useState([])
  const [tab, setTab] = useState('overview')
  const [busy, setBusy] = useState(false)
  const [draft, setDraft] = useState(null)
  const [categoryDraft, setCategoryDraft] = useState(null)
  const [note, setNote] = useState('')
  const [search, setSearch] = useState('')

  const loadAdminData = useCallback(async () => {
    const [stats, templateData, categoryData, enquiryData] = await Promise.all([
      api('/admin/overview'), api('/admin/templates?limit=100'), api('/admin/categories'), api('/admin/enquiries?limit=100')
    ])
    setOverview(stats)
    setTemplates(templateData.templates)
    setCategories(categoryData.categories)
    setEnquiries(enquiryData.enquiries)
  }, [])

  useEffect(() => {
    api('/admin/session').then(data => setAdmin(data.admin)).catch(() => {})
  }, [])
  useEffect(() => {
    if (admin) loadAdminData().catch(err => setError(err.message))
  }, [admin, loadAdminData])

  const submitLogin = async event => {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const result = await api('/admin/login', { method: 'POST', body: JSON.stringify(login) })
      setAdmin(result.admin)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }
  const signOut = async () => {
    await api('/admin/logout', { method: 'POST' })
    setAdmin(null)
  }
  const saveTemplate = async event => {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const body = {
        name: draft.name,
        slug: draft.slug,
        shortDescription: draft.shortDescription,
        fullDescription: draft.fullDescription,
        type: draft.type,
        category: draft.category,
        industry: draft.industry || 'General',
        thumbnail: draft.thumbnail || '',
        gallery: draft.gallery.split('\n').map(value => value.trim()).filter(Boolean),
        features: draft.features.split('\n').map(value => value.trim()).filter(Boolean),
        technologies: draft.technologies.split(',').map(value => value.trim()).filter(Boolean),
        integrations: [],
        customization: [],
        pricingType: draft.pricingType,
        price: draft.pricingType === 'custom' ? null : Number(draft.price || 0),
        currency: 'INR',
        demoUrl: draft.demoUrl || null,
        demoStatus: draft.demoUrl ? draft.demoStatus : 'unavailable',
        responsive: true,
        featured: draft.featured,
        popular: draft.popular,
        published: draft.published,
        seoTitle: draft.seoTitle || '',
        seoDescription: draft.seoDescription || ''
      }
      const endpoint = draft._id ? `/admin/templates/${draft._id}` : '/admin/templates'
      await api(endpoint, { method: draft._id ? 'PUT' : 'POST', body: JSON.stringify(body) })
      setDraft(null)
      await loadAdminData()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }
  const saveCategory = async event => {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const endpoint = categoryDraft._id ? `/admin/categories/${categoryDraft._id}` : '/admin/categories'
      const body = {
        name: categoryDraft.name, slug: categoryDraft.slug, description: categoryDraft.description || '',
        type: categoryDraft.type, image: categoryDraft.image || '', order: Number(categoryDraft.order || 0), active: categoryDraft.active
      }
      await api(endpoint, { method: categoryDraft._id ? 'PUT' : 'POST', body: JSON.stringify(body) })
      setCategoryDraft(null)
      await loadAdminData()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }
  const updateEnquiry = async (item, status) => {
    setError('')
    try {
      const result = await api(`/admin/enquiries/${item._id}`, { method: 'PATCH', body: JSON.stringify({ status, ...(note.trim() ? { internalNote: note } : {}) }) })
      setEnquiries(current => current.map(enquiry => enquiry._id === item._id ? result.enquiry : enquiry))
      setNote('')
    } catch (err) {
      setError(err.message)
    }
  }
  const deleteTemplate = async item => {
    if (!window.confirm(`Delete “${item.name}”? This cannot be undone.`)) return
    try {
      await api(`/admin/templates/${item._id}`, { method: 'DELETE' })
      await loadAdminData()
    } catch (err) { setError(err.message) }
  }
  const deleteCategory = async item => {
    if (!window.confirm(`Delete “${item.name}”? Categories with templates cannot be removed.`)) return
    try {
      await api(`/admin/categories/${item._id}`, { method: 'DELETE' })
      await loadAdminData()
    } catch (err) { setError(err.message) }
  }

  if (!admin) return <div className="admin-login-wrap"><form className="admin-login" onSubmit={submitLogin}><span className="market-kicker"><LockKeyhole size={15}/> MARKETPLACE ADMIN</span><h1>Sign in</h1><p>Use the administrator credentials configured on the API server.</p>{error && <div className="market-alert error">{error}</div>}<label>Email<input type="email" autoComplete="username" required value={login.email} onChange={event => setLogin(current => ({ ...current, email: event.target.value }))}/></label><label>Password<input type="password" autoComplete="current-password" required value={login.password} onChange={event => setLogin(current => ({ ...current, password: event.target.value }))}/></label><button className="market-button primary" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'} <ArrowUpRight size={16}/></button><Link to="/templates">Back to marketplace</Link></form></div>

  const visibleEnquiries = enquiries.filter(item => `${item.reference} ${item.name} ${item.email} ${item.templateName}`.toLowerCase().includes(search.toLowerCase()))
  const newDraft = () => setDraft({
    name: '', slug: '', shortDescription: '', fullDescription: '', type: 'website', category: categories.find(item => item.type === 'website')?._id || '',
    industry: 'General', thumbnail: '', features: '', technologies: 'React, Node.js, MongoDB', pricingType: 'custom', price: '',
    gallery: '',
    demoUrl: '', demoStatus: 'unavailable', featured: false, popular: false, published: false, responsive: true, seoTitle: '', seoDescription: ''
  })
  const makeDraft = item => setDraft({
    _id: item._id, name: item.name, slug: item.slug, shortDescription: item.shortDescription, fullDescription: item.fullDescription,
    type: item.type, category: item.category?._id || item.category, industry: item.industry, thumbnail: item.thumbnail || '',
    features: item.features?.join('\n') || '', technologies: item.technologies?.join(', ') || '', gallery: item.gallery?.join('\n') || '', pricingType: item.pricingType,
    price: item.price ?? '', demoUrl: item.demoUrl || '', demoStatus: item.demoStatus, featured: item.featured, popular: item.popular,
    published: item.published, responsive: item.responsive, seoTitle: item.seoTitle || '', seoDescription: item.seoDescription || ''
  })

  return <div className="admin-page">
    <header className="admin-header"><Link to="/templates"><img src="/images/codepixel-logo.png" alt="CodePixel"/></Link><div><span>{admin.email}</span><button onClick={signOut}><LogOut size={15}/> Sign out</button></div></header>
    <div className="admin-shell"><aside className="admin-sidebar"><span className="market-kicker">MARKETPLACE MANAGEMENT</span>{[['overview', 'Overview'], ['templates', 'Templates'], ['categories', 'Categories'], ['enquiries', 'Enquiries']].map(([value, label]) => <button key={value} className={tab === value ? 'active' : ''} onClick={() => setTab(value)}>{label}</button>)}</aside>
      <main className="admin-main">
        <div className="admin-title-row"><div><span className="market-kicker">CODEPIXEL / ADMIN</span><h1>{tab === 'overview' ? 'Marketplace overview' : `${tab[0].toUpperCase()}${tab.slice(1)} management`}</h1></div>{tab === 'templates' && <button className="market-button primary" onClick={newDraft}>Add template <ArrowUpRight size={15}/></button>}{tab === 'categories' && <button className="market-button primary" onClick={() => setCategoryDraft({ name: '', slug: '', description: '', type: 'website', image: '', order: categories.length, active: true })}>Add category <ArrowUpRight size={15}/></button>}</div>
        {error && <div className="market-alert error" role="alert">{error}<button onClick={() => setError('')} aria-label="Dismiss error"><X size={15}/></button></div>}
        {tab === 'overview' && <><div className="admin-stat-grid">{Object.entries({ 'All templates': overview?.totalTemplates, Published: overview?.publishedTemplates, Drafts: overview?.draftTemplates, Websites: overview?.websiteTemplates, Dashboards: overview?.dashboardTemplates, Applications: overview?.webApplications, Enquiries: overview?.totalEnquiries, 'Pending enquiries': overview?.pendingEnquiries }).map(([label, count]) => <article key={label}><span>{label}</span><strong>{count ?? '—'}</strong></article>)}</div><p className="admin-note">Revenue and order metrics are omitted because no payment gateway or order-processing integration is configured.</p></>}
        {tab === 'templates' && <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Template</th><th>Type</th><th>Status</th><th>Demo</th><th>Actions</th></tr></thead><tbody>{templates.map(item => <tr key={item._id}><td><strong>{item.name}</strong><small>{item.slug}</small></td><td>{typeLabels[item.type]}</td><td><span className={item.published ? 'admin-status published' : 'admin-status'}>{item.published ? 'Published' : 'Draft'}</span></td><td>{item.demoStatus === 'available' ? 'Configured' : 'Unavailable'}</td><td><button onClick={() => makeDraft(item)}>Edit</button><button onClick={() => deleteTemplate(item)}>Delete</button></td></tr>)}</tbody></table></div>}
        {tab === 'categories' && <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Category</th><th>Type</th><th>Status</th><th>Order</th><th>Actions</th></tr></thead><tbody>{categories.map(item => <tr key={item._id}><td><strong>{item.name}</strong><small>{item.slug}</small></td><td>{typeLabels[item.type]}</td><td>{item.active ? 'Active' : 'Inactive'}</td><td>{item.order}</td><td><button onClick={() => setCategoryDraft(item)}>Edit</button><button onClick={() => deleteCategory(item)}>Delete</button></td></tr>)}</tbody></table></div>}
        {tab === 'enquiries' && <><div className="admin-enquiry-search"><Search size={15}/><input placeholder="Search name, email or reference" value={search} onChange={event => setSearch(event.target.value)}/></div><div className="admin-enquiry-list">{visibleEnquiries.map(item => <article key={item._id}><div className="admin-enquiry-top"><div><strong>{item.name}</strong><span>{item.reference} · {item.templateName || 'Custom development'}</span></div><a href={`mailto:${encodeURIComponent(item.email)}?subject=${encodeURIComponent(`CodePixel enquiry ${item.reference}`)}`}><Mail size={15}/> {item.email}</a></div><p>{item.businessDescription}</p><details><summary>Full requirements</summary><dl><div><dt>Business</dt><dd>{item.businessName || 'Not provided'}</dd></div><div><dt>Phone</dt><dd>{item.phone || 'Not provided'}</dd></div><div><dt>Pages</dt><dd>{item.pages?.join(', ') || 'Not specified'}</dd></div><div><dt>Features</dt><dd>{item.features?.join(', ') || 'Not specified'}</dd></div><div><dt>Budget</dt><dd>{item.budget || 'Not specified'}</dd></div><div><dt>Delivery</dt><dd>{item.expectedDelivery || 'Not specified'}</dd></div></dl><p>{item.comments}</p></details><div className="admin-enquiry-actions"><select aria-label={`Update status for ${item.reference}`} value={item.status} onChange={event => updateEnquiry(item, event.target.value)}>{enquiryStatuses.map(status => <option key={status}>{status}</option>)}</select><input aria-label={`Internal note for ${item.reference}`} value={note} onChange={event => setNote(event.target.value)} placeholder="Add internal note"/><button onClick={() => updateEnquiry(item, item.status)}>Save note</button></div></article>)}{visibleEnquiries.length === 0 && <div className="market-empty"><p>No enquiries found.</p></div>}</div></>}
      </main>
    </div>
    {draft && <div className="market-modal-backdrop" role="presentation" onClick={() => setDraft(null)}><form className="market-edit-modal" onSubmit={saveTemplate} onClick={event => event.stopPropagation()}><button type="button" className="market-modal-close" onClick={() => setDraft(null)} aria-label="Close"><X/></button><span className="market-kicker">TEMPLATE RECORD</span><h2>{draft._id ? 'Edit template' : 'Create template'}</h2><div className="market-form-grid">
      <label>Name<input required maxLength="120" value={draft.name} onChange={event => setDraft({ ...draft, name: event.target.value })}/></label><label>Slug<input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={draft.slug} onChange={event => setDraft({ ...draft, slug: event.target.value })}/></label>
      <label>Type<select value={draft.type} onChange={event => { const type = event.target.value; setDraft({ ...draft, type, category: categories.find(item => item.type === type)?._id || '' }) }}><option value="website">Website</option><option value="admin-dashboard">Admin dashboard</option><option value="web-application">Web application</option></select></label><label>Category<select required value={draft.category} onChange={event => setDraft({ ...draft, category: event.target.value })}><option value="">Choose category</option>{categories.filter(item => item.type === draft.type && item.active).map(item => <option key={item._id} value={item._id}>{item.name}</option>)}</select></label>
      <label className="market-form-wide">Short description<textarea required maxLength="280" value={draft.shortDescription} onChange={event => setDraft({ ...draft, shortDescription: event.target.value })}/></label><label className="market-form-wide">Full description<textarea required maxLength="4000" rows="3" value={draft.fullDescription} onChange={event => setDraft({ ...draft, fullDescription: event.target.value })}/></label>
      <label>Industry<input maxLength="80" value={draft.industry} onChange={event => setDraft({ ...draft, industry: event.target.value })}/></label><label>Pricing type<select value={draft.pricingType} onChange={event => setDraft({ ...draft, pricingType: event.target.value })}><option value="custom">Custom quote</option><option value="fixed">Fixed price</option><option value="free">Free</option></select></label>
      {draft.pricingType === 'fixed' && <label>Price (INR)<input type="number" min="0" required value={draft.price} onChange={event => setDraft({ ...draft, price: event.target.value })}/></label>}
      <label>Thumbnail URL (HTTPS)<input type="url" placeholder="https://…" value={draft.thumbnail} onChange={event => setDraft({ ...draft, thumbnail: event.target.value })}/></label>
      <label className="market-form-wide">Gallery image URLs (HTTPS, one per line)<textarea rows="3" value={draft.gallery} onChange={event => setDraft({ ...draft, gallery: event.target.value })}/></label>
      <label>Demo URL (HTTPS)<input type="url" placeholder="https://…" value={draft.demoUrl} onChange={event => setDraft({ ...draft, demoUrl: event.target.value, demoStatus: event.target.value ? 'available' : 'unavailable' })}/></label>
      <label>Demo access<select value={draft.demoStatus} onChange={event => setDraft({ ...draft, demoStatus: event.target.value })}><option value="unavailable">Unavailable</option><option value="available">Available</option><option value="restricted">Restricted</option></select></label>
      <label className="market-form-wide">Features (one per line)<textarea rows="4" value={draft.features} onChange={event => setDraft({ ...draft, features: event.target.value })}/></label><label className="market-form-wide">Technologies (comma separated)<input value={draft.technologies} onChange={event => setDraft({ ...draft, technologies: event.target.value })}/></label>
      <label className="market-check-label"><input type="checkbox" checked={draft.published} onChange={event => setDraft({ ...draft, published: event.target.checked })}/> Published</label><label className="market-check-label"><input type="checkbox" checked={draft.featured} onChange={event => setDraft({ ...draft, featured: event.target.checked })}/> Featured</label><label className="market-check-label"><input type="checkbox" checked={draft.popular} onChange={event => setDraft({ ...draft, popular: event.target.checked })}/> Popular</label>
    </div><button className="market-button primary" disabled={busy}>{busy ? 'Saving…' : 'Save template'} <Check size={16}/></button></form></div>}
    {categoryDraft && <div className="market-modal-backdrop" role="presentation" onClick={() => setCategoryDraft(null)}><form className="market-edit-modal category-edit" onSubmit={saveCategory} onClick={event => event.stopPropagation()}><button type="button" className="market-modal-close" onClick={() => setCategoryDraft(null)} aria-label="Close"><X/></button><span className="market-kicker">CATEGORY</span><h2>{categoryDraft._id ? 'Edit category' : 'Create category'}</h2><label>Name<input required maxLength="80" value={categoryDraft.name} onChange={event => setCategoryDraft({ ...categoryDraft, name: event.target.value })}/></label><label>Slug<input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={categoryDraft.slug} onChange={event => setCategoryDraft({ ...categoryDraft, slug: event.target.value })}/></label>    <label>Type<select value={categoryDraft.type} onChange={event => setCategoryDraft({ ...categoryDraft, type: event.target.value })}><option value="website">Website</option><option value="admin-dashboard">Admin dashboard</option><option value="web-application">Web application</option></select></label><label>Description<input maxLength="300" value={categoryDraft.description} onChange={event => setCategoryDraft({ ...categoryDraft, description: event.target.value })}/></label><label>Category image URL (HTTPS)<input type="url" value={categoryDraft.image} onChange={event => setCategoryDraft({ ...categoryDraft, image: event.target.value })}/></label><label>Display order<input type="number" min="0" value={categoryDraft.order} onChange={event => setCategoryDraft({ ...categoryDraft, order: Number(event.target.value) })}/></label><label className="market-check-label"><input type="checkbox" checked={categoryDraft.active} onChange={event => setCategoryDraft({ ...categoryDraft, active: event.target.checked })}/> Active</label><button className="market-button primary" disabled={busy}>{busy ? 'Saving…' : 'Save category'} <Check size={16}/></button></form></div>}
  </div>
}

export default function MarketplacePage() {
  const location = useLocation()
  const { slug } = useParams()
  const [theme, toggleTheme] = useTheme()
  const routeType = location.pathname === '/templates/websites' ? 'website' : location.pathname === '/templates/admin-dashboards' ? 'admin-dashboard' : location.pathname === '/templates/web-applications' ? 'web-application' : ''
  let content
  if (location.pathname.startsWith('/template/') && location.pathname.endsWith('/preview')) content = <PreviewPage slug={slug}/>
  else if (location.pathname === '/templates' || location.pathname.startsWith('/templates/') && !location.pathname.startsWith('/templates/category/')) content = <CataloguePage type={routeType}/>
  else if (location.pathname.startsWith('/templates/category/')) content = <CataloguePage categorySlug={slug}/>
  else if (location.pathname.startsWith('/template/')) content = <TemplateDetailsPage slug={slug}/>
  else if (location.pathname.startsWith('/customize/')) content = <CustomizePage slug={slug}/>
  else if (location.pathname === '/pricing') content = <PricingPage/>
  else content = <AdminPage/>

  return <div className="marketplace-shell"><MarketplaceHeader theme={theme} toggleTheme={toggleTheme}/><main className="marketplace-main">{content}</main><footer className="market-footer"><Link to="/" className="market-footer-brand"><img src="/images/codepixel-logo.png" alt="CodePixel"/></Link><p>Website and software development by CodePixel.</p><div><Link to="/templates">Templates</Link><Link to="/pricing">Pricing</Link><Link to="/admin/marketplace">Admin</Link><a href="/#contact">Contact</a></div><small>Template cards are development concepts. Demo availability is shown per listing; no customer ratings are displayed without verified reviews.</small></footer></div>
}
