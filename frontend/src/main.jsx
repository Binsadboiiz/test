import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

// Import Bootstrap CSS 
import 'bootstrap/dist/css/bootstrap.min.css' 
// Import Bootstrap Icons CSS 
import 'bootstrap-icons/font/bootstrap-icons.css'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App/>
  </BrowserRouter>
)
