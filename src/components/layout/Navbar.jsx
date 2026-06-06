'use client';

import { useEffect, useRef, useState } from 'react';

import Link from 'next/link';

import { useRouter } from 'next/navigation';

import {
  ChevronDown,
  Linkedin,
  Menu,
  Moon,
  Phone,
  Sun,
  X,
} from 'lucide-react';

import { navLinks } from '../../data/siteData';

import SearchBar from '../ui/SearchBar';

import {
  getCategories,
  getProducts,
} from '../../lib/api';

import { getProductPath } from '../../lib/productUrl';

const logo = '/assets/logo.png';
const logoWhite = '/assets/logowhite.jpg';

function Navbar({
  theme = 'light',
  onToggleTheme,
}) {
  const router = useRouter();
  const isDarkTheme = theme === 'dark';

  const formatLabel = (value) => {
    if (!value) return '';

    const lower = String(value).toLowerCase();

    return (
      lower.charAt(0).toUpperCase() +
      lower.slice(1)
    );
  };

  const [isOpen, setIsOpen] =
    useState(false);

  const [
    productMenuOpen,
    setProductMenuOpen,
  ] = useState(false);

  const [categories, setCategories] =
    useState([]);

  const [searchTerm, setSearchTerm] =
    useState('');

  const [searchResults, setSearchResults] =
    useState({
      products: [],
      categories: [],
    });

  const [searchLoading, setSearchLoading] =
    useState(false);

  const productMenuRef = useRef(null);

  const searchPanelRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    getCategories()
      .then((response) => {
        if (!mounted) return;

        setCategories(
          response?.items || []
        );
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
    const handleOutsideClick = (
      event
    ) => {
      if (
        productMenuRef.current &&
        !productMenuRef.current.contains(
          event.target
        )
      ) {
        setProductMenuOpen(false);
      }
    };

    document.addEventListener(
      'mousedown',
      handleOutsideClick
    );

    return () =>
      document.removeEventListener(
        'mousedown',
        handleOutsideClick
      );
  }, []);

  useEffect(() => {
    const handleOutsideClick = (
      event
    ) => {
      if (
        searchPanelRef.current &&
        !searchPanelRef.current.contains(
          event.target
        )
      ) {
        setSearchResults({
          products: [],
          categories: [],
        });
      }
    };

    document.addEventListener(
      'mousedown',
      handleOutsideClick
    );

    return () =>
      document.removeEventListener(
        'mousedown',
        handleOutsideClick
      );
  }, []);

  useEffect(() => {
    const term = searchTerm.trim();

    if (!term) {
      setSearchResults({
        products: [],
        categories: [],
      });

      setSearchLoading(false);

      return;
    }

    const timeout = setTimeout(
      async () => {
        try {
          setSearchLoading(true);

          const response =
            await getProducts({
              q: term,
              limit: 5,
              page: 1,
            });

          const categoryMatches =
            categories.filter(
              (category) =>
                String(
                  category.name ||
                    category.label ||
                    ''
                )
                  .toLowerCase()
                  .includes(
                    term.toLowerCase()
                  )
            );

          setSearchResults({
            products:
              response?.items || [],
            categories:
              categoryMatches,
          });
        } catch {
          setSearchResults({
            products: [],
            categories: [],
          });
        } finally {
          setSearchLoading(false);
        }
      },
      250
    );

    return () =>
      clearTimeout(timeout);
  }, [searchTerm, categories]);

  const filteredNavLinks =
    navLinks.filter(
      (item) =>
        item.label !== 'Downloads' &&
        item.label !==
          'Case Studies' &&
        item.label !==
          'Certifications'
    );

  const resetSearch = () => {
    setSearchTerm('');

    setSearchResults({
      products: [],
      categories: [],
    });

    setSearchLoading(false);
  };

  const handleSearchSubmit = (
    event
  ) => {
    event.preventDefault();

    const term = searchTerm.trim();

    if (!term) return;

    router.push(
      `/products?q=${encodeURIComponent(
        term
      )}`
    );

    setIsOpen(false);

    setProductMenuOpen(false);

    resetSearch();
  };

  const handleCategorySelect = (
    slug
  ) => {
    router.push(
      `/products?category=${slug}`
    );

    setIsOpen(false);

    setProductMenuOpen(false);

    resetSearch();
  };

  const handleProductSelect = (
    product
  ) => {
    router.push(
      getProductPath(product)
    );

    setIsOpen(false);

    setProductMenuOpen(false);

    resetSearch();
  };

  const renderSearchResults = (
    variant = 'desktop'
  ) => {
    const hasResults =
      searchResults.products.length ||
      searchResults.categories.length;

    if (
      !searchTerm.trim() &&
      !searchLoading
    )
      return null;

    return (
      <div
        className={`ui-menu-panel absolute left-0 right-0 ${
          variant === 'desktop'
            ? 'top-[110%]'
            : 'top-full'
        } z-50 rounded-2xl border bg-white p-3 shadow-2xl`}
      >
        {searchLoading ? (
          <p className="text-xs text-slate-500">
            Searching...
          </p>
        ) : null}

        {!searchLoading &&
        !hasResults ? (
          <p className="text-xs text-slate-500">
            No matches found.
          </p>
        ) : null}

        {searchResults.categories
          .length ? (
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Categories
            </p>

            <div className="grid gap-1">
              {searchResults.categories.map(
                (category) => (
                  <button
                    type="button"
                    key={category.slug}
                    onClick={() =>
                      handleCategorySelect(
                        category.slug
                      )
                    }
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition hover:bg-slate-100"
                  >
                    <span>
                      {formatLabel(
                        category.name
                      )}
                    </span>

                    <span className="text-[11px] text-slate-400">
                      View
                    </span>
                  </button>
                )
              )}
            </div>
          </div>
        ) : null}

        {searchResults.products.length ? (
          <div className="mt-3 space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Products
            </p>

            <div className="grid gap-1">
              {searchResults.products.map(
                (product) => {
                  const name =
                    product.Name ||
                    product.name ||
                    product.model ||
                    'Product';

                  const sku =
                    product.SKU ||
                    product.sku ||
                    '';

                  const category =
                    formatLabel(
                      product.topCategory ||
                        product.category ||
                        product.Categories ||
                        ''
                    );

                  return (
                    <button
                      type="button"
                      key={
                        product.id ||
                        product._id ||
                        product.sku ||
                        name
                      }
                      onClick={() =>
                        handleProductSelect(
                          product
                        )
                      }
                      className="flex flex-col rounded-lg px-3 py-2 text-left transition hover:bg-slate-100"
                    >
                      <span className="text-sm font-medium">
                        {name}
                      </span>

                      <span className="text-xs text-slate-500">
                        {sku
                          ? `${sku} • `
                          : ''}
                        {category ||
                          'Product'}
                      </span>
                    </button>
                  );
                }
              )}
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <header className="ui-header fixed inset-x-0 top-0 z-50 border-b bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-8 px-6 py-4">
        {/* LOGO */}
        <Link
          href="/"
          className="shrink-0"
        >
          <img
            src={
              theme === 'light'
                ? logoWhite
                : logo
            }
            alt="Extell Systems"
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* MOBILE BUTTON */}
        <button
          className="ml-auto rounded-lg border p-2 md:hidden"
          onClick={() =>
            setIsOpen((prev) => !prev)
          }
          aria-label="Toggle navigation"
        >
          {isOpen ? (
            <X size={20} />
          ) : (
            <Menu size={20} />
          )}
        </button>

        {/* DESKTOP NAV */}
        <nav className="hidden flex-1 items-center justify-between gap-6 md:flex">
          {/* NAV LINKS */}
          <div className="flex items-center gap-6">
            {filteredNavLinks.map(
              (item) =>
                item.label ===
                'Products' ? (
                  <div
                    key={item.path}
                    className="relative"
                    ref={
                      productMenuRef
                    }
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setProductMenuOpen(
                          (prev) =>
                            !prev
                        )
                      }
                      className="inline-flex items-center gap-1 text-sm font-medium text-slate-700 transition hover:text-[#fc3725]"
                    >
                      Products

                      <ChevronDown
                        size={15}
                      />
                    </button>

                    {productMenuOpen ? (
                      <div
                        className={`absolute left-0 top-10 w-72 rounded-2xl border p-3 shadow-2xl ${
                          isDarkTheme
                            ? 'border-slate-800 bg-black text-slate-100'
                            : 'border-slate-200 bg-white text-slate-900'
                        }`}
                      >
                        <Link
                          href="/products"
                          onClick={() =>
                            setProductMenuOpen(
                              false
                            )
                          }
                          className={`block rounded-lg px-3 py-2 text-sm transition ${
                            isDarkTheme
                              ? 'text-slate-100 hover:bg-slate-900'
                              : 'text-slate-900 hover:bg-slate-100'
                          }`}
                        >
                          All Products
                        </Link>

                        {categories.map(
                          (
                            category
                          ) => (
                            <Link
                              key={
                                category.slug
                              }
                              href={`/products?category=${category.slug}`}
                              onClick={() =>
                                setProductMenuOpen(
                                  false
                                )
                              }
                              className={`block rounded-lg px-3 py-2 text-sm transition ${
                                isDarkTheme
                                  ? 'text-slate-100 hover:bg-slate-900'
                                  : 'text-slate-900 hover:bg-slate-100'
                              }`}
                            >
                              {formatLabel(
                                category.name
                              )}
                            </Link>
                          )
                        )}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <Link
                    key={item.path}
                    href={item.path}
                    className="text-sm font-medium text-slate-700 transition hover:text-[#fc3725]"
                  >
                    {item.label}
                  </Link>
                )
            )}
          </div>

          {/* SEARCH */}
          <div
            className="relative w-full max-w-[320px]"
            ref={searchPanelRef}
          >
            <form
              onSubmit={
                handleSearchSubmit
              }
            >
              <SearchBar
                placeholder="Search products & categories"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
              />
            </form>

            {renderSearchResults(
              'desktop'
            )}
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex shrink-0 items-center gap-3">
            <a
              href="tel:+13658895555"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-[#fc3725] hover:text-[#fc3725]"
            >
              <Phone size={14} />
              +1 365 889 5555
            </a>

            <a
              href="https://portal.extellsystems.com/login"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full bg-[#fc3725] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#e72f1d]"
            >
              Login
            </a>

            <a
              href="https://www.linkedin.com/company/extellsystems/?viewAsMember=true"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Extell on LinkedIn"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border text-slate-700 transition hover:border-[#fc3725] hover:text-[#fc3725]"
            >
              <Linkedin
                size={16}
              />
            </a>

            <button
              type="button"
              onClick={
                onToggleTheme
              }
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-[#fc3725] hover:text-[#fc3725]"
            >
              {theme ===
              'light' ? (
                <Moon size={14} />
              ) : (
                <Sun size={14} />
              )}

              {theme ===
              'light'
                ? 'Dark'
                : 'Light'}
            </button>
          </div>
        </nav>
      </div>

      {/* MOBILE MENU */}
      {isOpen ? (
        <div className="border-t bg-white px-6 py-4 md:hidden">
          <div
            className="relative"
            ref={searchPanelRef}
          >
            <form
              onSubmit={
                handleSearchSubmit
              }
            >
              <SearchBar
                placeholder="Search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
              />
            </form>

            {renderSearchResults(
              'mobile'
            )}
          </div>

          <div className="mt-4 grid gap-2">
            {filteredNavLinks.map(
              (item) => (
                <div
                  key={item.path}
                >
                  <Link
                    href={item.path}
                    onClick={() =>
                      setIsOpen(
                        false
                      )
                    }
                    className="block rounded-lg px-2 py-2 text-sm font-medium text-slate-700"
                  >
                    {item.label}
                  </Link>

                  {item.label ===
                    'Products' &&
                  categories.length ? (
                    <div className="ml-3 mt-1 grid gap-1">
                      {categories.map(
                          (
                          category
                        ) => (
                          <Link
                            key={
                              category.slug
                            }
                            href={`/products?category=${category.slug}`}
                            onClick={() =>
                              setIsOpen(
                                false
                              )
                            }
                            className={`rounded-md px-2 py-1 text-xs transition ${
                              isDarkTheme
                                ? 'text-slate-300 hover:bg-slate-900 hover:text-white'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                          >
                            {formatLabel(
                              category.name
                            )}
                          </Link>
                        )
                      )}
                    </div>
                  ) : null}
                </div>
              )
            )}

            <a
              href="tel:+13658895555"
              className="mt-2 inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-slate-700"
            >
              <Phone size={14} />
              +1 365 889 5555
            </a>

            <a
              href="https://www.linkedin.com/company/extellsystems/?viewAsMember=true"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-slate-700"
            >
              <Linkedin
                size={14}
              />
              LinkedIn
            </a>

            <a
              href="https://portal.extellsystems.com/login"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-lg px-2 py-2 text-sm font-semibold text-[#fc3725]"
            >
              Login
            </a>

            <button
              type="button"
              onClick={
                onToggleTheme
              }
              className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-slate-700"
            >
              {theme ===
              'light' ? (
                <Moon size={14} />
              ) : (
                <Sun size={14} />
              )}

              {theme ===
              'light'
                ? 'Dark mode'
                : 'Light mode'}
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
}

export default Navbar;
