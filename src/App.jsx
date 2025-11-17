import React from 'react'
import Navbar from './components/Navbar/Navbar.jsx'
import Upcoming from './pages/Upcoming.jsx'
import Live from './pages/Live.jsx'
import Footer from './components/Footer/Footer.jsx'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Admin from './pages/Admin.jsx'
import Login from './pages/Login.jsx'
import RequireAdmin from './routes/RequireAdmin.jsx'
import Register from './pages/Register.jsx'
import Watch from './pages/Watch.jsx'
import './index.css'

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/upcoming" element={<Upcoming />} />
        <Route path="/live" element={<Live />} />
        <Route path="/admin" element={<RequireAdmin><Admin /></RequireAdmin>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/watch/:id" element={<Watch />} />
      </Routes>
      <Upcoming />
      <Footer />
    </>
  )
}

export default App
