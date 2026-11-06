'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Trash2, Pencil, Send, Sparkles } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import StatCard from '../components/StatCard';
import {
  createPartner,
  deletePartner,
  fetchAdminProducts,
  fetchPartnerQuotes,
  fetchPartners,
  generatePartnerQuote,
  updatePartner
} from '../services/api';
import { formatDate } from '../utils/date';

const defaultValues = {
  name: '',
  contactName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  country: '',
  slug: '',
  status: 'active',
  partnerMarkupPercent: 15,
  loginEmail: '',
  portalNote: ''
};

const slugify = (value) =>
  String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const toArray = (response) => {
  const candidates = [
    response,
    response?.items,
    response?.partners,
    response?.quotes,
    response?.quote,
    response?.products,
    response?.results,
    response?.data,
    response?.data?.items,
    response?.data?.partners,
    response?.data?.quotes,
    response?.data?.quote,
    response?.data?.quotations,
    response?.data?.products,
    response?.data?.results
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate.filter(Boolean);
  }

  return [];
};

const normalizeProduct = (item = {}) => {
  const record = item || {};
  const id = record._id || record.id || record.sku || record.SKU || record.slug || record.name;
  return {
    id: id == null ? '' : String(id),
    name: record.Name || record.name || record.title || 'Product',
    sku: record.SKU || record.sku || record.id || '',
    price: Number(record.salePrice ?? record.price ?? record.basePrice ?? record.mrp ?? 0) || 0
  };
};

const toPositiveInteger = (value, fallback = 1) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.max(1, Math.floor(parsed));
};

const extractPartnerProductIds = (partner) => {
  const rawSources = [
    partner?.productIds,
    partner?.assignedProductIds,
    partner?.products,
    partner?.productList,
    partner?.catalog,
    partner?.assignedProducts
  ];

  return rawSources.flatMap((source) => {
    if (!Array.isArray(source)) return [];

    return source
      .map((entry) => {
        if (entry == null) return '';
        if (typeof entry === 'string' || typeof entry === 'number') return entry;
        return (
          entry._id ||
          entry.id ||
          entry.productId ||
          entry.product?._id ||
          entry.product?.id ||
          entry.sku ||
          entry.SKU ||
          ''
        );
      })
      .filter((value) => value != null && value !== '')
      .map(String);
  });
};

const extractPartnerProductQuantities = (partner) => {
  const quantityMap = {};
  const assignQuantity = (productId, quantity) => {
    const normalizedId = String(productId || '').trim();
    if (!normalizedId) return;
    quantityMap[normalizedId] = toPositiveInteger(quantity, 1);
  };

  const objectSources = [partner?.productQuantities, partner?.assignedProductQuantities, partner?.quantities];
  objectSources.forEach((source) => {
    if (!source || Array.isArray(source)) return;
    Object.entries(source).forEach(([productId, quantity]) => assignQuantity(productId, quantity));
  });

  const arraySources = [partner?.productDetails, partner?.assignedProducts, partner?.products];
  arraySources.forEach((source) => {
    if (!Array.isArray(source)) return;
    source.forEach((entry) => {
      if (!entry || typeof entry !== 'object') return;
      const productId =
        entry.productId ||
        entry._id ||
        entry.id ||
        entry.product?._id ||
        entry.product?.id ||
        entry.sku ||
        entry.SKU;
      assignQuantity(productId, entry.quantity || entry.qty || entry.count || 1);
    });
  });

  return quantityMap;
};

const normalizeQuoteLine = (line, fallbackProducts = []) => {
  const productId = line.productId || line.id || line.product?._id || line.product?.id || '';
  const matchedProduct = fallbackProducts.find((product) => String(product.id) === String(productId));

  return {
    id: line._id || line.id || `${productId}-${line.quantity || 0}`,
    productId,
    productName: line.productName || line.name || matchedProduct?.name || 'Product',
    sku: line.sku || line.productSku || matchedProduct?.sku || '',
    quantity: Number(line.quantity || line.qty || 1) || 1,
    price: Number(line.price ?? line.unitPrice ?? matchedProduct?.price ?? 0) || 0
  };
};

const normalizeQuote = (quote, fallbackProducts = []) => {
  const lineItems = Array.isArray(quote.lineItems)
    ? quote.lineItems
    : Array.isArray(quote.items)
      ? quote.items
      : Array.isArray(quote.products)
        ? quote.products
        : [];

  const normalizedLines = lineItems.map((line) => normalizeQuoteLine(line, fallbackProducts));

  return {
    id: quote._id || quote.id || quote.quoteNumber || `${quote.partnerId || 'quote'}-${quote.createdAt || Date.now()}`,
    partnerId: quote.partnerId || quote.partner?._id || quote.partner?.id || quote.partner || '',
    partnerName: quote.partnerName || quote.partner?.name || '',
    status: quote.status || 'draft',
    createdAt: quote.createdAt || quote.updatedAt || null,
    lineItems: normalizedLines,
    total: Number(
      quote.total ??
        quote.partnerTotal ??
        normalizedLines.reduce((sum, line) => sum + line.price * line.quantity, 0)
    ) || 0
  };
};

const toCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Number(value || 0));

const PartnersPage = () => {
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [catalogError, setCatalogError] = useState('');
  const [actionError, setActionError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [saveError, setSaveError] = useState('');
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState('');
  const [quotePartner, setQuotePartner] = useState(null);
  const [quoteItems, setQuoteItems] = useState([]);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset
  } = useForm({ defaultValues });

  const loadData = async () => {
    setLoading(true);
    setLoadError('');
    setCatalogError('');
    const [partnersResult, productsResult] = await Promise.allSettled([
      fetchPartners({ page: 1, limit: 500 }),
      fetchAdminProducts({ limit: 200 })
    ]);

    if (partnersResult.status === 'fulfilled') {
      setItems(toArray(partnersResult.value));
    } else {
      setItems([]);
      setLoadError(
        partnersResult.reason?.response?.data?.message ||
          partnersResult.reason?.message ||
          'Unable to load partners.'
      );
    }

    if (productsResult.status === 'fulfilled') {
      setProducts(toArray(productsResult.value).map(normalizeProduct).filter((product) => product.id));
    } else {
      setProducts([]);
      setCatalogError(
        productsResult.reason?.response?.data?.message ||
          productsResult.reason?.message ||
          'The product catalog could not be loaded.'
      );
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setActiveItem(null);
    setSaveError('');
    reset({
      ...defaultValues,
      partnerMarkupPercent: 15,
      loginEmail: '',
      slug: ''
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setActiveItem(item);
    setSaveError('');
    reset({
      name: item.name || item.partnerName || '',
      contactName: item.contactName || '',
      email: item.email || '',
      phone: item.phone || '',
      address: item.address || '',
      city: item.city || '',
      country: item.country || '',
      slug: item.slug || '',
      status: item.status || 'active',
      partnerMarkupPercent: item.partnerMarkupPercent ?? 15,
      loginEmail: item.loginEmail || item.email || '',
      portalNote: item.portalNote || ''
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setActiveItem(null);
    setSaveError('');
  };

  const onSubmit = async (values) => {
    const payload = {
      ...values,
      slug: activeItem?.slug || values.slug || slugify(values.name),
      website: '',
      partnerMarkupPercent: Number(values.partnerMarkupPercent || 0)
    };

    try {
      setSaving(true);
      setActionError('');
      if (activeItem?._id || activeItem?.id) {
        await updatePartner(activeItem._id || activeItem.id, payload);
      } else {
        await createPartner(payload);
      }
      closeModal();
      await loadData();
    } catch (error) {
      setSaveError(error?.response?.data?.message || error?.message || 'Unable to save partner.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete partner "${item.name || item.partnerName || 'this partner'}"?`)) return;
    const partnerId = item._id || item.id;
    if (!partnerId) return;
    setDeletingId(String(partnerId));
    setActionError('');
    try {
      await deletePartner(partnerId);
      await loadData();
    } catch (error) {
      setActionError(error?.response?.data?.message || error?.message || 'Unable to delete partner.');
    } finally {
      setDeletingId('');
    }
  };

  const partnerStats = useMemo(() => {
    const totalPartners = items.length;
    const activePartners = items.filter((item) => (item.status || 'active') === 'active').length;
    return { totalPartners, activePartners };
  }, [items]);

  const openPartnerQuote = async (partner) => {
    const partnerId = partner?._id || partner?.id || '';
    if (!partnerId) return;

    const partnerName = partner?.name || partner?.partnerName || 'Partner';
    const customerName = partner?.contactName || partner?.name || partner?.partnerName || partner?.email || 'Partner';
    const partnerMarkupPercent = Math.max(0, Number(partner?.partnerMarkupPercent ?? 15) || 0);
    const partnerProductIds = extractPartnerProductIds(partner);
    const partnerQuantities = extractPartnerProductQuantities(partner);
    const quoteProducts = partnerProductIds
      .map((productId) => products.find((entry) => String(entry.id) === String(productId)))
      .filter(Boolean);
    const quoteLineItems = quoteProducts.map((product) => ({
      id: product.id,
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      quantity: toPositiveInteger(partnerQuantities[product.id], 1),
      price: Number(product.price || 0)
    }));
    const draftLineItems = quoteLineItems.map((line) => ({
      ...line,
      price: Math.round(line.price * (1 + partnerMarkupPercent / 100) * 100) / 100
    }));

    setQuoteLoading(true);
    setQuoteError('');
    setQuotePartner(partner);
    setQuoteItems([]);
    setQuoteModalOpen(true);

    try {
      try {
        const generatedResponse = await generatePartnerQuote({
          partnerId,
          partner: partnerId,
          id: partnerId,
          partnerName,
          customerName,
          fullName: customerName,
          companyName: partnerName,
          email: partner?.email || '',
          partnerMarkupPercent,
          productIds: partnerProductIds,
          assignedProductIds: partnerProductIds,
          products: quoteProducts,
          lineItems: quoteLineItems,
          limit: 25
        });

        const generatedQuotes = toArray(generatedResponse).map((quote) => normalizeQuote(quote, products));
        const generatedMatch = generatedQuotes.filter((quote) => String(quote.partnerId) === String(partnerId));
        if (generatedMatch.length || generatedQuotes.length) {
          setQuoteItems(generatedMatch.length ? generatedMatch : generatedQuotes);
          setQuoteModalOpen(true);
          return;
        }
      } catch (generateError) {
        // Fall back to the persisted quote list or a draft if the generate endpoint
        // expects a different payload shape. We still want the admin panel to be useful.
        console.warn('Unable to generate partner quote directly:', generateError);
      }

      const response = await fetchPartnerQuotes({
        partnerId,
        partner: partnerId,
        id: partnerId,
        partnerMarkupPercent,
        limit: 25
      });

      const quotes = toArray(response).map((quote) => normalizeQuote(quote, products));
      const matchingQuotes = quotes.filter((quote) => String(quote.partnerId) === String(partnerId));
      if (matchingQuotes.length || quotes.length) {
        setQuoteItems(matchingQuotes.length ? matchingQuotes : quotes);
        setQuoteModalOpen(true);
        return;
      }

      setQuoteItems([
        {
          id: `${partnerId}-draft`,
          partnerId,
          partnerName,
          status: 'draft',
          createdAt: null,
          lineItems: draftLineItems,
          total: draftLineItems.reduce((sum, line) => sum + line.price * line.quantity, 0)
        }
      ]);
      setQuoteModalOpen(true);
    } catch (error) {
      setQuoteError(error?.response?.data?.message || error?.message || 'Unable to load partner quotes.');
    } finally {
      setQuoteLoading(false);
    }
  };

  const latestQuote = quoteItems[0] || null;
  const quotePartnerProducts = useMemo(() => {
    const productIds = extractPartnerProductIds(quotePartner);
    return products.filter((product) => productIds.some((id) => String(id) === String(product.id)));
  }, [products, quotePartner]);
  const quotePartnerQuantities = useMemo(() => extractPartnerProductQuantities(quotePartner), [quotePartner]);

  const handlePrintQuote = () => {
    window.print();
  };

  const closeQuoteModal = () => {
    setQuoteModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Partners"
        subtitle="Manage partner accounts, contacts, and quote generation."
        actions={
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
          >
            <Plus size={16} />
            Add Partner
          </button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        <StatCard label="Total Partners" value={partnerStats.totalPartners} helper="Reseller accounts" />
        <StatCard label="Active Partners" value={partnerStats.activePartners} helper="Can log in now" />
      </div>

      {actionError ? (
        <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {actionError}
        </p>
      ) : null}

      {catalogError ? (
        <p role="status" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Partner records are available, but the product catalog could not be loaded. Quote totals may be incomplete. {catalogError}
        </p>
      ) : null}

      <div className="grid gap-6">
        <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Partner registry</h2>
              <p className="text-sm text-gray-500">Admin list of partner accounts and contact details.</p>
            </div>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              <Plus size={16} />
              New partner
            </button>
          </div>

          {loading ? (
            <p className="mt-4 text-sm text-gray-500">Loading partners...</p>
          ) : loadError ? (
            <div role="alert" className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              <span>{loadError}</span>
              <button type="button" onClick={loadData} className="rounded-lg border border-rose-300 px-3 py-1.5 font-semibold hover:bg-rose-100">
                Retry
              </button>
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase tracking-wide text-gray-400">
                    <th className="pb-3">Partner</th>
                    <th className="pb-3">Contact</th>
                    <th className="pb-3">Markup</th>
                    <th className="pb-3">Created</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length ? items.map((item) => {
                    return (
                      <tr key={item._id || item.id} className="border-b last:border-0">
                        <td className="py-4">
                          <div className="font-medium text-gray-900">{item.name || item.partnerName}</div>
                          <div className="text-xs text-gray-500">{item.status || 'active'}</div>
                        </td>
                        <td className="py-4 text-gray-600">
                          <div>{item.contactName || '--'}</div>
                          <div className="text-xs text-gray-400">{item.email || '--'}</div>
                        </td>
                        <td className="py-4 text-gray-600">{item.partnerMarkupPercent ?? 15}%</td>
                        <td className="py-4 text-gray-500">{formatDate(item.createdAt)}</td>
                        <td className="py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openEditModal(item)}
                              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                            >
                              <Pencil size={14} />
                              Edit
                            </button>
                            <button
                              onClick={() => openPartnerQuote(item)}
                              className="inline-flex items-center gap-1 rounded-lg border border-gray-900 bg-gray-900 px-3 py-2 text-xs font-semibold text-white transition hover:border-gray-700 hover:bg-gray-700 hover:text-white"
                            >
                              <Sparkles size={14} />
                              Get Quote
                            </button>
                            <button
                              onClick={() => handleDelete(item)}
                              disabled={deletingId === String(item._id || item.id)}
                              className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:cursor-wait disabled:opacity-50"
                            >
                              <Trash2 size={14} />
                              {deletingId === String(item._id || item.id) ? 'Deleting…' : 'Delete'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-sm text-gray-500">No partners found. Add a partner to get started.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Modal
        open={modalOpen}
        title={activeItem ? 'Edit Partner' : 'Add Partner'}
        onClose={closeModal}
        footer={
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-rose-600">{saveError}</p>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={closeModal} className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button
                type="submit"
                form="partner-form"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:cursor-wait disabled:opacity-60"
              >
                <Send size={14} />
                {saving ? 'Saving…' : activeItem ? 'Update Partner' : 'Add Partner'}
              </button>
            </div>
          </div>
        }
      >
        <form id="partner-form" onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-gray-600">
            Partner name
            <input className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2" {...register('name', { required: true })} />
          </label>
          <label className="text-sm text-gray-600">
            Contact person
            <input className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2" {...register('contactName')} />
          </label>
          <label className="text-sm text-gray-600">
            Email
            <input className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2" type="email" {...register('email', { required: true })} />
          </label>
          <label className="text-sm text-gray-600">
            Phone
            <input className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2" {...register('phone')} />
          </label>
          <label className="text-sm text-gray-600">
            Partner profile slug
            <input className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2" placeholder="partnername" {...register('slug')} />
          </label>
          <label className="text-sm text-gray-600 md:col-span-2">
            Address
            <textarea className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2" rows={3} {...register('address')} />
          </label>
          <label className="text-sm text-gray-600">
            City
            <input className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2" {...register('city')} />
          </label>
          <label className="text-sm text-gray-600">
            Country
            <input className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2" {...register('country')} />
          </label>
          <label className="text-sm text-gray-600">
            Login email
            <input className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2" type="email" {...register('loginEmail')} />
          </label>
          <label className="text-sm text-gray-600">
            Status
            <select className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2" {...register('status')}>
              <option value="active">active</option>
              <option value="pending">pending</option>
              <option value="suspended">suspended</option>
            </select>
          </label>
          <label className="text-sm text-gray-600">
            Partner markup %
            <input className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2" type="number" min="0" step="1" {...register('partnerMarkupPercent')} />
          </label>
          <label className="text-sm text-gray-600 md:col-span-2">
            Portal note
            <textarea className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2" rows={3} placeholder="Shown to partner inside their dashboard" {...register('portalNote')} />
          </label>
        </form>

      </Modal>

      <Modal
        open={quoteModalOpen}
        title="Partner Quote Slip"
        onClose={closeQuoteModal}
        footer={
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-gray-500">
              {quotePartner ? `Quote for ${quotePartner.name || quotePartner.partnerName || 'Partner'}` : 'No partner selected'}
            </p>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={closeQuoteModal} className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                Close
              </button>
              <button
                type="button"
                onClick={handlePrintQuote}
                className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700"
              >
                Print Slip
              </button>
            </div>
          </div>
        }
      >
        <div className="partner-quote-print-area space-y-4">
          {quoteLoading ? (
            <p className="text-sm text-gray-500">Loading quote details...</p>
          ) : quoteError ? (
            <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{quoteError}</p>
          ) : quotePartner ? (
            <>
              <div className="flex items-start justify-between gap-4 border-b border-dashed border-gray-200 pb-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-gray-500">Partner quote slip</p>
                  <h3 className="mt-2 text-2xl font-semibold text-gray-900">{quotePartner.name || quotePartner.partnerName || 'Partner'}</h3>
                  <p className="mt-1 text-sm text-gray-600">{quotePartner.email || '--'}</p>
                  <p className="mt-1 text-xs text-gray-500">{quotePartner.contactName || 'No contact person listed'}</p>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-right">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-gray-500">Quote status</p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {latestQuote?.createdAt ? formatDate(latestQuote.createdAt) : latestQuote ? 'Draft' : 'No quote yet'}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">Assigned products: {quotePartnerProducts.length || 0}</p>
                  <p className="mt-1 text-xs text-gray-500">Partner markup: {Math.max(0, Number(quotePartner.partnerMarkupPercent ?? 15) || 0)}%</p>
                </div>
              </div>

              <div className="rounded-2xl bg-gray-50 p-4">
                <div className="grid grid-cols-[1fr_72px_96px_110px] gap-3 border-b border-gray-200 pb-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-gray-500">
                  <span>Product</span>
                  <span className="text-center">Qty</span>
                  <span className="text-right">Rate</span>
                  <span className="text-right">Amount</span>
                </div>

                <div className="mt-2 space-y-2">
                  {latestQuote?.lineItems?.length ? (
                    latestQuote.lineItems.map((line) => (
                      <div key={line.id} className="grid grid-cols-[1fr_72px_96px_110px] gap-3 border-b border-dashed border-gray-200 py-3 last:border-0">
                        <div>
                          <p className="font-medium text-gray-900">{line.productName}</p>
                          <p className="text-xs text-gray-500">{line.sku || 'No SKU'}</p>
                        </div>
                        <div className="text-center text-sm font-semibold text-gray-900">x{line.quantity}</div>
                        <div className="text-right text-sm text-gray-700">{toCurrency(line.price)}</div>
                        <div className="text-right text-sm font-semibold text-gray-900">{toCurrency(line.price * line.quantity)}</div>
                      </div>
                    ))
                  ) : quotePartnerProducts.length ? (
                    quotePartnerProducts.map((product) => {
                      const quantity = toPositiveInteger(quotePartnerQuantities?.[product.id], 1);
                      return (
                        <div key={product.id} className="grid grid-cols-[1fr_72px_96px_110px] gap-3 border-b border-dashed border-gray-200 py-3 last:border-0">
                          <div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <p className="text-xs text-gray-500">{product.sku || 'No SKU'}</p>
                          </div>
                          <div className="text-center text-sm font-semibold text-gray-900">x{quantity}</div>
                          <div className="text-right text-sm text-gray-700">{toCurrency(product.price)}</div>
                          <div className="text-right text-sm font-semibold text-gray-900">{toCurrency(product.price * quantity)}</div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="py-4 text-sm text-gray-500">No products or quote history found for this partner yet.</p>
                  )}
                </div>
              </div>

              {quoteItems.length > 1 ? (
                <p className="text-xs text-gray-500">Showing the latest quote. {quoteItems.length} quotes were returned.</p>
              ) : null}

              {latestQuote?.total ? (
                <div className="flex items-center justify-between rounded-2xl border border-gray-900 bg-gray-900 px-4 py-4 text-white">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.25em] text-gray-300">Amount partner pays us</p>
                    <p className="mt-1 text-sm text-gray-300">Slip ready for print</p>
                  </div>
                  <p className="text-2xl font-semibold">{toCurrency(latestQuote.total)}</p>
                </div>
              ) : null}
            </>
          ) : (
            <p className="text-sm text-gray-500">Click Get Quote on any partner to load the products, quantities, and payable amount.</p>
          )}
        </div>
      </Modal>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }

          .partner-quote-print-area,
          .partner-quote-print-area * {
            visibility: visible;
          }

          .partner-quote-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0 !important;
            margin: 0 !important;
          }

          .no-print {
            display: none !important;
          }

          body {
            background: #fff !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PartnersPage;
