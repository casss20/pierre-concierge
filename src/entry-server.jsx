import React from 'react'
import { renderToString } from 'react-dom/server'
import App from './App.jsx'
import { SERVICE_DETAILS } from './serviceDetails.js'

export function render(path = '/') {
    return renderToString(
        <React.StrictMode>
            <App path={path} />
        </React.StrictMode>,
    )
}

export const pageRoutes = [
    { path: '/services', title: 'Home Nursing Services in Ocala, FL | Pierre Concierge Nursing', description: 'Post-surgery care, wound care, IV therapy, medication management, and more. Private pay mobile RN services in Ocala and Marion County, FL.' },
    { path: '/pricing', title: 'Pricing | Pierre Concierge Nursing, Ocala, FL', description: 'Transparent per visit pricing from $150 and a $450 monthly Care Plan for mobile nursing at home in Ocala, FL.' },
    { path: '/about', title: 'About Elda Pierre, RN, BSN | Pierre Concierge Nursing', description: 'Meet Elda Marie Pierre, a Registered Nurse with a BSN and more than 20 years in patient care, serving Ocala and Marion County, FL.' },
    { path: '/privacy-practices', title: 'HIPAA Notice of Privacy Practices | Pierre Concierge Nursing', description: 'How Pierre Concierge Nursing uses, shares, and protects your health information, and the privacy rights you have.' },
    { path: '/faq', title: 'FAQ | Pierre Concierge Nursing, Ocala, FL', description: 'Answers about insurance, payment, physician orders, service areas, and how concierge nursing differs from Medicare home health.' },
]

export const serviceRoutes = SERVICE_DETAILS.map(({ slug, title, seoDescription }) => ({
    path: `/services/${slug}`,
    title: `${title} at Home in Ocala, FL | Pierre Concierge Nursing`,
    description: seoDescription,
}))
