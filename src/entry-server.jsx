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

export const serviceRoutes = SERVICE_DETAILS.map(({ slug, title, seoDescription }) => ({
    path: `/services/${slug}`,
    title: `${title} at Home in Ocala, FL | Pierre Concierge Nursing`,
    description: seoDescription,
}))
