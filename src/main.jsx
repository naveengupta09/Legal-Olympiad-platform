import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App'
import './index.css'

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const app = (
	<React.StrictMode>
		<App clerkEnabled={Boolean(clerkPublishableKey)} />
	</React.StrictMode>
)

if (clerkPublishableKey) {
	ReactDOM.createRoot(document.getElementById('root')).render(
		<ClerkProvider publishableKey={clerkPublishableKey}>{app}</ClerkProvider>,
	)
} else {
	ReactDOM.createRoot(document.getElementById('root')).render(app)
}
