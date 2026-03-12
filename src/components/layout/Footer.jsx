import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import logoWhite from '../../assets/logowhite.png';

function Footer({ theme = 'light' }) {
  return (
    <footer className="ui-surface-1 mt-16 border-t">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div>
          <img
            src={theme === 'light' ? logoWhite : logo}
            alt="Extell Systems"
            className="h-10 w-auto object-contain"
          />
          <p className="mt-3 text-sm ui-text-muted">Enterprise-grade power electronics and ICT infrastructure partner.</p>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#ed2125]">Products</p>
          <ul className="space-y-2 text-sm ui-text-muted">
            <li><Link className="ui-nav-link" to="/category/fiber-cables">Fiber Cables</Link></li>
            <li><Link className="ui-nav-link" to="/category/ups-systems">UPS Systems</Link></li>
            <li><Link className="ui-nav-link" to="/category/data-center-solutions">Data Center</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#ed2125]">Company</p>
          <ul className="space-y-2 text-sm ui-text-muted">
            <li><Link className="ui-nav-link" to="/about">About</Link></li>
            <li><Link className="ui-nav-link" to="/careers">Careers</Link></li>
            <li><Link className="ui-nav-link" to="/partner">Partner</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#ed2125]">Contact</p>
          <p className="text-sm ui-text-muted">sales@extellsystems.com</p>
          <p className="text-sm ui-text-muted">+1 (202) 555-0148</p>
          <div className="mt-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider ui-text-muted">Newsletter</p>
            <form className="flex flex-col gap-2 sm:flex-row" onSubmit={(event) => event.preventDefault()}>
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="ui-input ui-focus-ring w-full rounded-md px-3 py-2 text-sm outline-none"
              />
              <button
                type="submit"
                className="ui-focus-ring rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white hover:!bg-[#d91f23]"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="border-t ui-border px-6 py-4 text-center text-xs ui-text-muted">
        Copyright {new Date().getFullYear()} Extell Systems. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
