import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import first from '../src/assets/first.mp4'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className='con'>
    <video src ={first} autoPlay loop muted />
    <div className='main'>
    <App />
    </div>
    </div>
  </StrictMode>,
)
