import './CatModel.css'

import MyHelmet from "./components/Helmet.tsx";
import Switcher from "./components/Switcher.tsx";
import Navbar from "./components/Navbar.tsx";
import Header from "./components/Header.tsx";
import About from "./components/About.tsx";
import Portfolio from "./components/Portfolio.tsx";
import Contact from "./components/Contact.tsx";
import Footer from "./components/Footer.tsx";

import { useSmoothScroll } from './ts/useSmoothScroll.ts';

function CatModel() {
  useSmoothScroll(); // Enable smooth scrolling

  return (
    <>
    <MyHelmet />
    <Switcher />
    <div className="black">
    <Navbar />
    {/* Page Content */}
    <div className="padding-large" id="main">
    <Header />
    <About />
    <Portfolio />
    <Contact />
    <Footer />
    </div>
    </div>
    </>
  );
}


export default CatModel;
