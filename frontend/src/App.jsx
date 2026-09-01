import { Routes, Route } from 'react-router-dom';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Ventures from './pages/Ventures.jsx';
import Achievements from './pages/Achievements.jsx';
import Media from './pages/Media.jsx';
import Lifestyle from './pages/Lifestyle.jsx';
import Philanthropy from './pages/Philanthropy.jsx';
import Speaking from './pages/Speaking.jsx';
import Contact from './pages/Contact.jsx';

export default function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/ventures" element={<Ventures />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/media" element={<Media />} />
        <Route path="/lifestyle" element={<Lifestyle />} />
        <Route path="/philanthropy" element={<Philanthropy />} />
        <Route path="/speaking" element={<Speaking />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
    </>
  );
}
