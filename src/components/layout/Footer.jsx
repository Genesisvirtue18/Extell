import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div>
          <img src={logo} alt="Extell Systems" className="h-10 w-auto object-contain" />
          <p className="mt-3 text-sm text-slate-300">Enterprise-grade power electronics and ICT infrastructure partner.</p>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-electric">Products</p>
          <ul className="space-y-2 text-sm text-slate-300">
            <li><Link to="/category/fiber-cables">Fiber Cables</Link></li>
            <li><Link to="/category/ups-systems">UPS Systems</Link></li>
            <li><Link to="/category/data-center-solutions">Data Center</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-electric">Company</p>
          <ul className="space-y-2 text-sm text-slate-300">
            <li><Link to="/about">About</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/partner">Partner</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-electric">Contact</p>
          <p className="text-sm text-slate-300">sales@extellsystems.com</p>
          <p className="text-sm text-slate-300">+1 (202) 555-0148</p>
        </div>
      </div>
      <div className="border-t border-white/10 px-6 py-4 text-center text-xs text-slate-400">
        Copyright {new Date().getFullYear()} Extell Systems. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
