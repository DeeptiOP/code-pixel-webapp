export const WHATSAPP_NUMBER = '917992662726'

export const pricingCategories = [
  {
    id: 'website',
    name: 'Website Development',
    description: 'For individuals, professionals, startups, cafes, restaurants and local businesses.',
    comparisonRows: ['scope', 'design', 'integrations', 'seo', 'revisions', 'support', 'timeline'],
    packages: [
      {
        name: 'Landing Page', price: 3999, billing: 'one-time',
        description: 'A professional single-page website for promotions, personal branding and business introductions.',
        scope: '1 responsive landing page', design: 'Professional responsive layout', database: 'Not included', authentication: 'Not included', admin: 'Not included', seo: 'Basic on-page SEO',
        integrations: 'WhatsApp, contact links and social links', timeline: '5–7 business days', revisions: '1 design revision', support: '7 days of launch bug-fix support',
        features: ['Hero section', 'About or service section', 'Contact section', 'WhatsApp contact button', 'Mobile and desktop optimization', 'Basic on-page SEO', 'Social media links']
      },
      {
        name: 'Basic Website', price: 9999, billing: 'one-time',
        description: 'A professional online presence for individuals and small businesses.',
        scope: 'Up to 4 pages: Home, About, Services and Contact', design: 'Responsive design with basic animations', database: 'Not included', authentication: 'Not included', admin: 'Not included', seo: 'Basic SEO setup',
        integrations: 'Contact form, WhatsApp, social links and Google Maps', timeline: '7–10 business days', revisions: '2 design revisions', support: '7 days of launch bug-fix support',
        features: ['Up to 4 pages', 'Responsive design', 'Contact form', 'WhatsApp integration', 'Basic animations', 'Social media integration', 'Basic SEO setup', 'Google Maps integration']
      },
      {
        name: 'Business Website', price: 11999, billing: 'one-time', popular: true,
        description: 'A modern business website designed to showcase services, build trust and generate customer enquiries.',
        scope: 'Up to 7 pages', design: 'Custom UI/UX and advanced page sections', database: 'Not included', authentication: 'Not included', admin: 'Not included', seo: 'SEO-friendly structure',
        integrations: 'Enquiry forms, WhatsApp, Google Maps and social media', timeline: '10–14 business days', revisions: '2 design revisions', support: '14 days of launch bug-fix support',
        features: ['Up to 7 pages', 'Custom UI/UX design and responsive layout', 'Advanced page sections', 'Service and product showcase', 'Contact and enquiry forms', 'WhatsApp, Google Maps and social media integration', 'SEO-friendly structure', 'Basic performance optimization']
      },
      {
        name: 'Premium Website', price: 17999, billing: 'one-time',
        description: 'A high-quality, customized website for established businesses and growing brands.',
        scope: 'Up to 10 pages', design: 'Premium custom design, animations and interactive components', database: 'As agreed in scope', authentication: 'As agreed in scope', admin: 'As agreed in scope', seo: 'SEO optimization',
        integrations: 'Third-party and Google Analytics integrations as agreed', timeline: '2–3 weeks', revisions: '3 design revisions', support: '14 days of launch bug-fix support',
        features: ['Up to 10 pages', 'Premium custom design', 'Advanced animations and transitions', 'Interactive components', 'Advanced service and product sections', 'Custom enquiry forms', 'Performance optimization', 'Google Analytics and agreed third-party integrations']
      }
    ]
  },
  {
    id: 'application',
    name: 'Web Application Development',
    description: 'For businesses that need interactive software, user accounts, database management and automated processes.',
    comparisonRows: ['scope', 'design', 'database', 'authentication', 'admin', 'integrations', 'revisions', 'support', 'timeline'],
    packages: [
      {
        name: 'Starter Web App', price: 14999, priceSuffix: '+', billing: 'one-time',
        description: 'A starter application for one core workflow and essential user management.',
        scope: 'Basic web application and dashboard', design: 'Responsive interface', database: 'Database connectivity', authentication: 'Registration and login', admin: 'Basic admin functionality', seo: 'Not applicable',
        integrations: 'Scoped API integrations', timeline: '2–3 weeks', revisions: '2 revisions', support: '14 days of bug-fix support',
        features: ['User registration and login', 'Basic dashboard', 'Database connectivity and CRUD operations', 'Basic form validation', 'Basic admin functionality']
      },
      {
        name: 'Business Web App', price: 29999, priceSuffix: '+', billing: 'one-time', popular: true,
        description: 'A custom application for business workflows, users and day-to-day operations.',
        scope: 'Custom application with user and admin dashboards', design: 'Responsive custom UI', database: 'Database management', authentication: 'Secure authentication and basic roles', admin: 'User and admin dashboards', seo: 'Not applicable',
        integrations: 'One scoped API integration', timeline: '3–5 weeks', revisions: '2 revisions', support: '21 days of bug-fix support',
        features: ['Secure authentication', 'User and admin dashboards', 'CRUD functionality', 'Basic role-based access', 'Search and filtering', 'API integration and form validation', 'Basic reports']
      },
      {
        name: 'Advanced Web App', price: 49999, priceSuffix: '+', billing: 'one-time',
        description: 'A multi-module product for complex workflows, roles and integrations.',
        scope: 'Multiple modules and workflows', design: 'Custom responsive application', database: 'Complex database operations', authentication: 'Multiple roles and permissions', admin: 'Advanced admin dashboard', seo: 'Not applicable',
        integrations: 'Advanced APIs and notification services, scoped to requirements', timeline: '5–8 weeks', revisions: '3 revisions', support: '30 days of bug-fix support',
        features: ['Multiple roles and permissions', 'Automated workflows and notification system', 'Advanced search and filtering', 'Data export, reports and analytics', 'Security implementation', 'Performance optimization']
      },
      {
        name: 'Enterprise Web Application', price: null, billing: 'custom',
        description: 'Custom enterprise architecture for large-scale products and connected systems.',
        scope: 'Defined after discovery', design: 'Custom enterprise architecture', database: 'Scalable database architecture', authentication: 'Multi-user and multi-role systems', admin: 'Custom business dashboards', seo: 'Not applicable',
        integrations: 'Existing software and third-party services', timeline: 'Based on project scope', revisions: 'Defined in project scope', support: 'Dedicated maintenance options available',
        features: ['Advanced business logic and security', 'Cloud deployment', 'Custom reporting', 'Integration with existing software', 'Dedicated maintenance options'],
        note: 'Request a custom quotation after project discovery.'
      }
    ]
  },
  {
    id: 'ecommerce',
    name: 'E-commerce Development',
    description: 'For businesses planning to sell products or services online.',
    comparisonRows: ['scope', 'design', 'database', 'authentication', 'admin', 'integrations', 'seo', 'support', 'timeline'],
    packages: [
      {
        name: 'Starter Store', price: 19999, priceSuffix: '+', billing: 'one-time',
        description: 'A small online store with product discovery and a straightforward order flow.',
        scope: 'Up to 25 initial products', design: 'Responsive storefront', database: 'Product and order data', authentication: 'Not included', admin: 'Basic product management', seo: 'Basic SEO',
        integrations: 'WhatsApp ordering; no payment gateway by default', timeline: '3–4 weeks', revisions: '2 design revisions', support: '14 days of bug-fix support',
        features: ['Product listing and detail pages', 'Shopping cart', 'Customer enquiry or order flow', 'Basic admin product management', 'WhatsApp integration']
      },
      {
        name: 'Business E-commerce', price: 34999, priceSuffix: '+', billing: 'one-time', popular: true,
        description: 'A complete storefront with customer accounts, checkout and order management.',
        scope: 'Up to 100 initial products', design: 'Custom storefront and responsive UI', database: 'Products, customers, orders and inventory', authentication: 'Customer registration and login', admin: 'Admin dashboard and management', seo: 'Basic SEO',
        integrations: 'Payment gateway and order notifications', timeline: '4–6 weeks', revisions: '2 design revisions', support: '21 days of bug-fix support',
        features: ['Shopping cart and checkout', 'Payment gateway integration', 'Order management and notifications', 'Product, category and inventory management', 'Search and filters']
      },
      {
        name: 'Advanced E-commerce', price: 59999, priceSuffix: '+', billing: 'one-time',
        description: 'A feature-rich commerce platform for larger catalogs and fulfillment workflows.',
        scope: 'Up to 300 initial products', design: 'Premium storefront', database: 'Advanced inventory and customer data', authentication: 'Customer accounts', admin: 'Advanced admin dashboard', seo: 'SEO setup',
        integrations: 'Payment, shipping and email notifications', timeline: '6–8 weeks', revisions: '3 design revisions', support: '30 days of bug-fix support',
        features: ['Advanced product filters and secure checkout', 'Order tracking and shipping integration', 'Coupons and discounts', 'Inventory and customer management', 'Sales reports and email notifications']
      },
      {
        name: 'Enterprise E-commerce', price: null, billing: 'custom',
        description: 'A scalable commerce platform for large catalogs and custom operations.',
        scope: 'Large-scale product catalogue', design: 'Custom enterprise storefront', database: 'Scalable inventory architecture', authentication: 'Custom customer and vendor access', admin: 'Advanced operations and analytics', seo: 'Scoped to requirements',
        integrations: 'Advanced payments, shipping, logistics and APIs', timeline: 'Based on requirements', revisions: 'Defined in project scope', support: 'Enterprise support options',
        features: ['Multi-vendor functionality if required', 'Custom order workflows', 'Advanced analytics', 'Scalable architecture', 'Custom API integrations'],
        note: 'Payment gateway transaction fees and third-party provider charges are separate.'
      }
    ]
  },
  {
    id: 'backend',
    name: 'Backend & API Development',
    description: 'For businesses requiring server-side functionality, integrations and database connectivity.',
    comparisonRows: ['scope', 'database', 'authentication', 'integrations', 'revisions', 'support', 'timeline'],
    packages: [
      {
        name: 'Basic API Development', price: 9999, priceSuffix: '+', billing: 'one-time',
        description: 'A tested API foundation for a focused data workflow.',
        scope: 'REST API and CRUD endpoints', design: 'Not applicable', database: 'Database connectivity and basic design', authentication: 'Basic authentication', admin: 'Not included', seo: 'Not applicable',
        integrations: 'Scoped REST API endpoints', timeline: 'Defined after scoping', revisions: 'Defined in scope', support: 'Bug-fix support defined in scope',
        features: ['REST API development', 'CRUD endpoints', 'Input validation', 'API testing', 'Basic documentation']
      },
      {
        name: 'Business Backend', price: 19999, priceSuffix: '+', billing: 'one-time', popular: true,
        description: 'A custom backend for connected application features and business data.',
        scope: 'Multiple API endpoints', design: 'Not applicable', database: 'Database design', authentication: 'Secure authentication and role-based authorization', admin: 'Backend administration as scoped', seo: 'Not applicable',
        integrations: 'File uploads and scoped API integrations', timeline: 'Defined after scoping', revisions: 'Defined in scope', support: 'Bug-fix support defined in scope',
        features: ['Custom backend architecture', 'Multiple API endpoints', 'File upload functionality', 'Error handling and API documentation', 'Testing']
      },
      {
        name: 'Advanced Backend', price: 34999, priceSuffix: '+', billing: 'one-time',
        description: 'A robust backend for advanced business logic and integrations.',
        scope: 'Advanced architecture and workflows', design: 'Not applicable', database: 'Advanced database operations', authentication: 'Advanced authentication and permissions', admin: 'As scoped', seo: 'Not applicable',
        integrations: 'Third-party integrations', timeline: 'Defined after scoping', revisions: 'Defined in scope', support: 'Bug-fix support defined in scope',
        features: ['Complex business logic', 'Background processing where required', 'Security implementation', 'Performance optimization', 'API documentation, testing and deployment']
      },
      {
        name: 'Enterprise Backend', price: null, billing: 'custom',
        description: 'Scalable API infrastructure for high-volume or interconnected systems.',
        scope: 'Scalable backend architecture', design: 'Not applicable', database: 'High-volume data handling', authentication: 'Advanced security', admin: 'Monitoring tools as scoped', seo: 'Not applicable',
        integrations: 'Complex integrations and microservices where appropriate', timeline: 'Based on project scope', revisions: 'Defined in project scope', support: 'Custom support options',
        features: ['Cloud deployment', 'Monitoring and optimization', 'Advanced API infrastructure'],
        note: 'Architecture and service boundaries are defined during project discovery.'
      }
    ]
  },
  {
    id: 'dashboard',
    name: 'Admin Dashboard & Management Systems',
    description: 'For organizations that want to manage their business operations digitally.',
    comparisonRows: ['scope', 'design', 'database', 'authentication', 'admin', 'integrations', 'revisions', 'support', 'timeline'],
    packages: [
      {
        name: 'Basic Management System', price: 14999, priceSuffix: '+', billing: 'one-time',
        description: 'A clear starting point for managing key business records.',
        scope: 'Basic dashboard and record management', design: 'Responsive interface', database: 'Database integration', authentication: 'Admin login', admin: 'Basic dashboard', seo: 'Not applicable',
        integrations: 'Scoped data source', timeline: 'Defined after scoping', revisions: 'Defined in scope', support: 'Bug-fix support defined in scope',
        features: ['Add, edit and delete records', 'Basic search', 'Responsive interface']
      },
      {
        name: 'Business Management System', price: 29999, priceSuffix: '+', billing: 'one-time', popular: true,
        description: 'A connected workspace for teams, customer records and everyday operations.',
        scope: 'Multiple user and data modules', design: 'Responsive dashboard UI', database: 'Business data management', authentication: 'Multiple accounts and role-based access', admin: 'Admin dashboard', seo: 'Not applicable',
        integrations: 'API integration as scoped', timeline: 'Defined after scoping', revisions: 'Defined in scope', support: 'Bug-fix support defined in scope',
        features: ['Customer and employee management', 'Search and filtering', 'Basic reports and data export']
      },
      {
        name: 'Advanced Management System', price: 49999, priceSuffix: '+', billing: 'one-time',
        description: 'A tailored operations system with automation, reports and custom modules.',
        scope: 'Custom modules and workflows', design: 'Advanced admin dashboard', database: 'Advanced database management', authentication: 'Multiple roles and permissions', admin: 'Advanced analytics and reports', seo: 'Not applicable',
        integrations: 'Scoped integrations and notifications', timeline: 'Defined after scoping', revisions: 'Defined in scope', support: 'Bug-fix support defined in scope',
        features: ['Inventory or workflow management', 'Automated operations and notifications', 'Advanced reports and data export']
      },
      {
        name: 'Enterprise Management System', price: null, billing: 'custom',
        description: 'A custom ERP or CRM for multi-department operations and connected workflows.',
        scope: 'Custom multi-department modules', design: 'Custom system design', database: 'Scalable architecture', authentication: 'Advanced roles and access', admin: 'Custom enterprise reporting', seo: 'Not applicable',
        integrations: 'Third-party and existing systems', timeline: 'Based on project scope', revisions: 'Defined in project scope', support: 'Custom support options',
        features: ['Complex workflows', 'Custom business automation', 'Advanced reporting and scalable architecture'],
        note: 'Final modules and integrations are confirmed before quotation.'
      }
    ]
  },
  {
    id: 'maintenance',
    name: 'Website Maintenance',
    description: 'Monthly care with defined service hours, backup checks and response windows.',
    comparisonRows: ['scope', 'integrations', 'support', 'timeline'],
    packages: [
      {
        name: 'Basic Maintenance', price: 999, billing: 'monthly',
        description: 'Essential monthly checks and small updates for an existing website.',
        scope: 'Up to 1 update hour / month', design: 'Minor existing-site changes', database: 'Existing site only', authentication: 'Not included', admin: 'Not included', seo: 'Basic technical checks',
        integrations: 'Monthly backup check; no new integrations', timeline: 'Monthly subscription', revisions: 'Within included hours', support: 'Response within 3 business days',
        features: ['Basic website health checks', 'Minor content updates and broken-link checks', 'Basic technical support', 'Monthly backup check; unused hours do not roll over']
      },
      {
        name: 'Standard Maintenance', price: 1999, billing: 'monthly', popular: true,
        description: 'Regular website care with updates, backups and priority support.',
        scope: 'Up to 2 update hours / month', design: 'Minor existing-site changes', database: 'Existing site only', authentication: 'Not included', admin: 'Not included', seo: 'Performance checks',
        integrations: 'Dependency updates and backup management', timeline: 'Monthly subscription', revisions: 'Within included hours', support: 'Priority response within 2 business days',
        features: ['Everything in Basic', 'Regular content updates', 'Plugin and dependency updates where applicable', 'Security and performance checks', 'Backup management; unused hours do not roll over']
      },
      {
        name: 'Premium Maintenance', price: 3999, billing: 'monthly',
        description: 'More frequent monitoring and priority technical support.',
        scope: 'Up to 4 update hours / month', design: 'Minor UI changes', database: 'Existing site only', authentication: 'Not included', admin: 'Not included', seo: 'Advanced performance monitoring',
        integrations: 'Regular backup management and security monitoring', timeline: 'Monthly subscription', revisions: 'Within included hours', support: 'Priority response within 1 business day',
        features: ['Everything in Standard', 'More frequent maintenance checks', 'Advanced performance and security monitoring', 'Regular backup management', 'Priority technical support; unused hours do not roll over']
      },
      {
        name: 'Custom Maintenance', price: null, billing: 'custom',
        description: 'A dedicated support plan for applications, servers and business-critical systems.',
        scope: 'Custom hours and service-level agreement', design: 'As agreed', database: 'Database maintenance as scoped', authentication: 'As agreed', admin: 'Application monitoring', seo: 'As agreed',
        integrations: 'Server, deployment and monitoring support', timeline: 'Monthly agreement', revisions: 'As agreed', support: 'Response times defined in the service-level agreement',
        features: ['Dedicated maintenance plan', 'Advanced security maintenance', 'Server and deployment support'],
        note: 'Update hours, backup frequency, response times and scope are confirmed in the maintenance agreement.'
      }
    ]
  }
]

export const addOnServices = [
  { name: 'Extra website page', price: 800 },
  { name: 'Website redesign', price: 3999 },
  { name: 'Additional content upload', price: 499 },
  { name: 'SEO setup', price: 2000 },
  { name: 'Google Analytics setup', price: 999 },
  { name: 'Payment gateway integration', price: 3000 },
  { name: 'Additional API integration', price: 2000 },
  { name: 'Advanced animation', price: 1500 },
  { name: 'Domain and hosting setup', price: 1500, note: 'Provider charges excluded' }
]

export const pricingNotes = [
  'All displayed prices are introductory starting prices in INR; final pricing depends on confirmed project scope and requirements.',
  'Domain registration and hosting charges are separate unless explicitly included.',
  'Paid APIs, third-party subscriptions and external service charges are separate.',
  'Payment gateway transaction charges are paid to the gateway provider.',
  'GST, if applicable, is charged separately.',
  'Additional pages, modules or features may increase project cost; anything outside the agreed scope requires a separate quotation.',
  'Delivery timelines begin after advance payment and receipt of required content and materials.',
  'Bug-fix support covers issues in the delivered scope, not new features or redesigns.',
  'Maintenance subscriptions are separate from initial development. Maintenance hours, backup frequency, response time and scope are defined in the agreement.'
]

export const pricingFaqs = [
  {
    question: 'Are the listed prices fixed?',
    answer: 'They are introductory starting prices for the listed scope. A final quote is confirmed after reviewing requirements, content and integrations.'
  },
  {
    question: 'Are hosting, domains and paid services included?',
    answer: 'No, unless a written scope says otherwise. Domain, hosting, payment provider, paid API and subscription fees are charged by their providers.'
  },
  {
    question: 'What does bug-fix support cover?',
    answer: 'The stated post-launch period covers bugs in the delivered scope. New features, redesigns and ongoing maintenance are quoted separately.'
  },
  {
    question: 'Can I request enterprise or custom work?',
    answer: 'Yes. Choose Request a Quote or discuss your requirements to receive a custom quotation for enterprise and other open-scope projects.'
  },
  {
    question: 'When do delivery timelines begin?',
    answer: 'The estimate begins after advance payment and receipt of the required content and materials. The final timeline is agreed with the confirmed scope.'
  }
]
