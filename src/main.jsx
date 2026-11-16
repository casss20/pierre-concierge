import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const root = document.getElementById('root')
const app = (
    <React.StrictMode>
        <App />
    </React.StrictMode>
)

// Hydrate when the page was prerendered at build time, otherwise render normally (dev server).
if (root.hasChildNodes()) {
    ReactDOM.hydrateRoot(root, app)
} else {
    ReactDOM.createRoot(root).render(app)
}
