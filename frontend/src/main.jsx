import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

class ErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = { error: null }
    }
    static getDerivedStateFromError(error) {
        return { error: error.message }
    }
    componentDidCatch(error, info) {
        console.error('React Error:', error, info.componentStack)
    }
    render() {
        if (this.state.error) {
            return (
                <div style={{ padding: 40, fontFamily: 'sans-serif', maxWidth: 430, margin: '0 auto' }}>
                    <h2 style={{ color: '#EF4444' }}>⚠️ App Error</h2>
                    <pre style={{ background: '#FEE2E2', padding: 16, borderRadius: 12, fontSize: 13, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{this.state.error}</pre>
                    <button style={{ marginTop: 16, padding: '10px 20px', background: '#FF6B9D', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}
                        onClick={() => { localStorage.clear(); location.reload() }}>
                        🔄 Reset & Reload
                    </button>
                </div>
            )
        }
        return this.props.children
    }
}

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    </StrictMode>,
)
