const webStack = ['React', 'Node.js', 'MongoDB']
const dashboardStack = ['React', 'Node.js', 'MongoDB', 'Chart.js']
const features = ['Responsive layout', 'Reusable page sections', 'Accessible navigation', 'Customization-ready components']

const websiteTemplates = [
  ['Ecommerce Website', 'ecommerce-website', 'E-commerce', 'Online retail', 'A storefront concept for product discovery, category browsing and a clear shopping journey.', ['Product catalog', 'Product detail layout', 'Cart and checkout UI']],
  ['SaaS Landing Page', 'saas-landing-page', 'SaaS', 'Software', 'A focused SaaS landing page structure for explaining product value and guiding visitors to sign up.', ['Feature sections', 'Pricing layout', 'Lead capture UI']],
  ['Digital Agency Website', 'digital-agency-website', 'Business', 'Professional services', 'A polished agency layout for presenting capabilities, selected work and enquiry paths.', ['Service pages', 'Portfolio grid', 'Project inquiry UI']],
  ['Real Estate Website', 'real-estate-website', 'Real Estate', 'Property', 'A property discovery layout with listing cards, search controls and property detail pages.', ['Property listings', 'Search and filters UI', 'Property detail layout']],
  ['Restaurant Website', 'restaurant-website', 'Restaurant', 'Food and hospitality', 'A restaurant website concept for menus, location information and reservation enquiries.', ['Digital menu layout', 'Reservation inquiry UI', 'Location and hours']],
  ['Healthcare Website', 'healthcare-website', 'Healthcare', 'Healthcare', 'A healthcare information layout with service details, practitioner profiles and appointment enquiries.', ['Care service pages', 'Provider profiles', 'Appointment inquiry UI']],
  ['Education Website', 'education-website', 'Education', 'Education', 'An education website structure for programs, instructors, learning resources and admissions.', ['Course catalog layout', 'Instructor profiles', 'Admissions inquiry UI']],
  ['Logistics Website', 'logistics-website', 'Logistics', 'Transportation', 'A logistics services website structure for explaining shipping, operations and quote requests.', ['Service overview', 'Shipment inquiry UI', 'Operations highlights']],
  ['Portfolio Website', 'portfolio-website', 'Portfolio', 'Creative', 'A personal portfolio structure for presenting selected work, skills and contact information.', ['Project gallery', 'Profile and skills', 'Contact section']],
  ['Hotel Booking Website', 'hotel-booking-website', 'Hospitality', 'Hotel and travel', 'A hotel presentation concept with room details, property highlights and booking enquiries.', ['Room listings', 'Amenities overview', 'Booking inquiry UI']],
  ['Construction Website', 'construction-website', 'Construction', 'Construction', 'A construction business website for showcasing services, project experience and quote requests.', ['Project gallery', 'Service pages', 'Quote inquiry UI']],
  ['CCTV & Security Website', 'cctv-security-website', 'Security', 'Security', 'A security services website layout for product categories, installation services and consultation requests.', ['Product category layout', 'Installation services', 'Consultation inquiry UI']]
]

const dashboardTemplates = [
  ['Ecommerce Admin Dashboard', 'ecommerce-admin-dashboard', 'E-commerce Admin', 'Online retail', 'An ecommerce operations dashboard concept for products, orders and sales management.', ['Orders overview', 'Product table layout', 'Sales summary UI']],
  ['CRM Dashboard', 'crm-dashboard', 'CRM', 'Business operations', 'A customer relationship workspace concept for contacts, sales pipelines and follow-up activity.', ['Customer records layout', 'Pipeline overview', 'Activity summary UI']],
  ['Inventory Management Dashboard', 'inventory-management-dashboard', 'Inventory Management', 'Inventory', 'An inventory dashboard concept for stock tracking, item records and low-stock workflows.', ['Stock status layout', 'Inventory table UI', 'Low-stock overview']],
  ['School Management Dashboard', 'school-management-dashboard', 'School Management', 'Education', 'A school operations workspace concept for students, classes and attendance.', ['Students and classes layout', 'Attendance overview', 'Academic summary UI']],
  ['Hospital Management Dashboard', 'hospital-management-dashboard', 'Hospital Management', 'Healthcare', 'A hospital administration dashboard concept for departments, appointments and patient records.', ['Department overview', 'Appointment layout', 'Patient record UI']],
  ['Hotel Management Dashboard', 'hotel-management-dashboard', 'Hotel Management', 'Hospitality', 'A hotel operations dashboard concept for reservations, room status and occupancy.', ['Reservations overview', 'Room status layout', 'Occupancy summary UI']],
  ['Logistics Dashboard', 'logistics-dashboard', 'Logistics Dashboard', 'Transportation', 'A logistics operations dashboard concept for shipments, fleet status and deliveries.', ['Shipment status layout', 'Fleet overview', 'Delivery summary UI']],
  ['SaaS Management Dashboard', 'saas-management-dashboard', 'SaaS Management', 'Software', 'A SaaS administration dashboard concept for subscriptions, usage and accounts.', ['Subscription overview', 'Usage summary UI', 'Account management layout']]
]

const applicationTemplates = [
  ['Task Management Application', 'task-management-application', 'Project Management', 'Business operations', 'A task management product concept for planning work, assigning owners and tracking progress.', ['Task board layout', 'Assignment workflow UI', 'Progress summary']],
  ['Booking Application', 'booking-application', 'Booking', 'Services', 'A booking product concept for checking availability, collecting requests and organizing customer details.', ['Availability calendar UI', 'Booking request workflow', 'Customer details layout']],
  ['Employee Management System', 'employee-management-system', 'Human Resources', 'Business operations', 'An employee management product concept for staff records, leave workflows and team operations.', ['Employee records layout', 'Leave request workflow UI', 'Team summary']],
  ['Learning Management Application', 'learning-management-application', 'Learning Management', 'Education', 'A learning management product concept for course content, learner progress and online study.', ['Course workspace layout', 'Learner progress UI', 'Learning catalog']]
]

const toRecord = ([name, slug, categoryName, industry, description, highlights], type) => ({
  name,
  slug,
  categoryName,
  type,
  industry,
  shortDescription: description,
  fullDescription: `${description} This catalogue entry is a starting point for a scoped custom implementation; it is not a downloadable product or a live demo.`,
  features: [...highlights, ...features.slice(0, 2)],
  technologies: type === 'admin-dashboard' ? dashboardStack : webStack,
  integrations: [],
  customization: ['Brand colors and typography', 'Content and page structure', 'Additional features scoped on request'],
  pricingType: 'custom',
  price: null,
  demoUrl: null,
  demoStatus: 'unavailable',
  responsive: true,
  featured: ['ecommerce-website', 'digital-agency-website', 'crm-dashboard', 'saas-management-dashboard'].includes(slug),
  popular: ['ecommerce-website', 'crm-dashboard', 'saas-management-dashboard'].includes(slug),
  published: true,
  seoTitle: `${name} | CodePixel`,
  seoDescription: description.slice(0, 160)
})

export const initialCategories = [
  ...websiteTemplates.map(([, slug, name]) => ({ name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), type: 'website' })),
  ...dashboardTemplates.map(([, slug, name]) => ({ name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), type: 'admin-dashboard' })),
  ...applicationTemplates.map(([, slug, name]) => ({ name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), type: 'web-application' }))
]

export const initialTemplates = [
  ...websiteTemplates.map(item => toRecord(item, 'website')),
  ...dashboardTemplates.map(item => toRecord(item, 'admin-dashboard')),
  ...applicationTemplates.map(item => toRecord(item, 'web-application'))
]
