import React from 'react';
import { createRoot } from 'react-dom/client';
import Root from './Root.jsx';
import { AccessibilityProvider } from './accessibility/AccessibilityContext.jsx';
import './styles.css';
createRoot(document.getElementById('root')).render(<React.StrictMode><AccessibilityProvider><Root/></AccessibilityProvider></React.StrictMode>);
