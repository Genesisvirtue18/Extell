import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
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

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#161b58]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="inline-flex items-center">
          <img src={logo} alt="Extell Systems" className="h-10 w-auto object-contain" />
        </Link>
        <button
          className="rounded-md border border-white/15 p-2 text-white md:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.filter((item) => item.label !== 'Downloads').map((item) =>
            item.label === 'Products' ? (
              <div key={item.path} className="relative" ref={productMenuRef}>
                <button
                  type="button"
                  onClick={() => setProductMenuOpen((prev) => !prev)}
                  className="inline-flex items-center gap-1 text-sm font-medium text-slate-200 hover:text-[#ff4a66]"
                >
                  Products <ChevronDown size={15} />
                </button>
                {productMenuOpen ? (
                  <div className="absolute left-0 top-8 w-72 rounded-xl border border-white/15 bg-[#07142f] p-3 text-left shadow-glow">
                    <Link
                      to="/products"
                      onClick={() => setProductMenuOpen(false)}
                      className="block rounded-md px-3 py-2 text-sm text-slate-200 hover:bg-white/10 hover:text-[#ff4a66]"
                    >
                      All Products
                    </Link>
                    {categories.map((category) => (
                      <Link
                        key={category.slug}
                        to={`/products?category=${category.slug}`}
                        onClick={() => setProductMenuOpen(false)}
                        className="block rounded-md px-3 py-2 text-sm text-slate-200 hover:bg-white/10 hover:text-[#ff4a66]"
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
                  `text-sm font-medium transition ${isActive ? 'text-electric' : 'text-slate-200 hover:text-[#ff4a66]'}`
                }
              >
                {item.label}
              </NavLink>
            )
          )}
        </nav>
      </div>

      {isOpen ? (
        <div className="space-y-4 border-t border-white/10 px-6 py-4 md:hidden">
          <SearchBar placeholder="Search" />
          <div className="grid gap-2">
            {navLinks.filter((item) => item.label !== 'Downloads').map((item) => (
              <div key={item.path}>
                <Link to={item.path} onClick={() => setIsOpen(false)} className="text-sm text-slate-200">
                  {item.label}
                </Link>
                {item.label === 'Products' && categories.length ? (
                  <div className="ml-3 mt-2 grid gap-1">
                    {categories.map((category) => (
                      <Link
                        key={category.slug}
                        to={`/products?category=${category.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="text-xs text-slate-300"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}

export default Navbar;
