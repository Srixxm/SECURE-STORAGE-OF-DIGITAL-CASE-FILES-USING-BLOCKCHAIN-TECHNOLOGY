import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Share from "./pages/Share";
import './App.css'
import first from '../src/assets/first.mp4'

function App() {
    return (
      <Router>
        
            <div className="con"> 
                <nav className="horizontal-navbar">
                    <ul className="nav-list">
                        <li className="nav-item"><Link to="/">Home</Link></li>
                        <li className="nav-item"><Link to="/upload">Upload</Link></li>
                        <li className="nav-item"><Link to="/share">Share</Link></li>
                    </ul>
                </nav>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/upload" element={<Upload />} />
                    <Route path="/share" element={<Share />} />
                </Routes>
            </div>
        
        </Router>
    );
}

export default App;