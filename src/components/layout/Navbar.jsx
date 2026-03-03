import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ChevronDown, Linkedin, Menu, Phone, X } from 'lucide-react';
import { navLinks } from '../../data/siteData';
import SearchBar from '../ui/SearchBar';
import logo from '../../assets/logo.png';
import { getCategories } from '../../lib/api';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [productMenuOpen, setProductMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const productMenuRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    getCategories()
      .then((response) => {
        if (!mounted) return;
        setCategories(response.items || []);
      })
      .catch(() => {
        if (!mounted) return;
        setCategories([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!productMenuRef.current) return;
      if (!productMenuRef.current.contains(event.target)) {
        setProductMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const filteredNavLinks = navLinks.filter(
    (item) =>
      item.label !== 'Downloads' &&
      item.label !== 'Case Studies' &&
      item.label !== 'Certifications'
  );

  return (
    <header className="ui-header fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="inline-flex items-center">
          <img src={logo} alt="Extell Systems" className="h-10 w-auto object-contain" />
        </Link>
        <button
          className="ui-surface-1 ui-focus-ring rounded-md p-2 text-white md:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <nav className="hidden items-center gap-6 md:flex">
          {filteredNavLinks.map((item) =>
            item.label === 'Products' ? (
              <div key={item.path} className="relative" ref={productMenuRef}>
                <button
                  type="button"
                  onClick={() => setProductMenuOpen((prev) => !prev)}
                  className="ui-nav-link ui-focus-ring inline-flex items-center gap-1 rounded-md px-1 py-1 text-sm font-medium"
                >
                  Products <ChevronDown size={15} />
                </button>
                {productMenuOpen ? (
                  <div className="ui-menu-panel absolute left-0 top-10 w-72 rounded-xl p-3 text-left">
                    <Link
                      to="/products"
                      onClick={() => setProductMenuOpen(false)}
                      className="ui-menu-item ui-focus-ring block rounded-md px-3 py-2 text-sm"
                    >
                      All Products
                    </Link>
                    {categories.map((category) => (
                      <Link
                        key={category.slug}
                        to={`/products?category=${category.slug}`}
                        onClick={() => setProductMenuOpen(false)}
                        className="ui-menu-item ui-focus-ring block rounded-md px-3 py-2 text-sm"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setProductMenuOpen(false)}
                className={({ isActive }) =>
                  `ui-focus-ring rounded-md px-1 py-1 text-sm font-medium transition ${isActive ? 'text-[#67e8f9]' : 'ui-nav-link'}`
                }
              >
                {item.label}
              </NavLink>
            )
          )}
          <a
            href="tel:+13658895555"
            className="ui-surface-1 ui-focus-ring inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-neutral-200 hover:border-cyan-300 hover:text-cyan-200"
          >
            <Phone size={14} />
            +1 365 889 5555
          </a>
          <a
            href="https://www.linkedin.com/company/extellsystems/?viewAsMember=true"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Extell on LinkedIn"
            className="ui-surface-1 ui-focus-ring inline-flex h-9 w-9 items-center justify-center rounded-full text-neutral-200 hover:border-cyan-300 hover:text-cyan-200"
          >
            <Linkedin size={16} />
          </a>
        </nav>
      </div>

      {isOpen ? (
        <div className="ui-surface-2 space-y-4 border-t px-6 py-4 md:hidden">
          <SearchBar placeholder="Search" />
          <div className="grid gap-2">
            {filteredNavLinks.map((item) => (
              <div key={item.path}>
                <Link to={item.path} onClick={() => setIsOpen(false)} className="ui-nav-link ui-focus-ring inline-block rounded-md px-2 py-1 text-sm">
                  {item.label}
                </Link>
                {item.label === 'Products' && categories.length ? (
                  <div className="ml-3 mt-2 grid gap-1">
                    {categories.map((category) => (
                      <Link
                        key={category.slug}
                        to={`/products?category=${category.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="ui-menu-item ui-focus-ring rounded-md px-2 py-1 text-xs"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            <a
              href="tel:+13658895555"
              className="ui-nav-link ui-focus-ring mt-1 inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm"
            >
              <Phone size={14} />
              +1 365 889 5555
            </a>
            <a
              href="https://www.linkedin.com/company/extellsystems/?viewAsMember=true"
              target="_blank"
              rel="noopener noreferrer"
              className="ui-nav-link ui-focus-ring inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm"
            >
              <Linkedin size={14} />
              LinkedIn
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}

export default Navbar;
