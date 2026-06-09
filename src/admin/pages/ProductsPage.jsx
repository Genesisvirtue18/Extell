'use client';

import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { jsPDF } from 'jspdf';
import {
  Plus,
  Search,
  UploadCloud,
  Pencil,
  Trash2,
  Copy,
  FileUp,
  FileText,
  Download,
  Star,
  Layers3,
  Image as ImageIcon,
  X,
  BadgeInfo,
  FilePlus2
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import {
  fetchAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  fetchAdminCategories
} from '../services/api';
import { uploadToCloudinary } from '../utils/uploader';

const normalizeKey = (value) => String(value || '').trim().toLowerCase();
const splitCsv = (value) =>
  String(value || '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
const joinCsv = (value) => splitCsv(value).join(', ');
const sanitizeFileName = (value) =>
  String(value || 'report')
    .trim()
    .replace(/[^a-z0-9_-]+/gi, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');

const LOCAL_CATEGORY_TREE = {
  'ups systems': {
    level1: ['Single Phase', 'Three Phase', 'Modular UPS'],
    level2: {
      'Single Phase': ['Line Interactive', 'Online'],
      'Three Phase': ['Standalone', 'Parallel / Redundant'],
      'Modular UPS': ['N+1', 'N+N']
    }
  },
  'ups-systems': {
    level1: ['Single Phase', 'Three Phase', 'Modular UPS'],
    level2: {
      'Single Phase': ['Line Interactive', 'Online'],
      'Three Phase': ['Standalone', 'Parallel / Redundant'],
      'Modular UPS': ['N+1', 'N+N']
    }
  },
  'data center solutions': {
    level1: ['Power', 'Cooling', 'Racks'],
    level2: {
      Power: ['PDU', 'STS', 'Busway'],
      Cooling: ['InRow', 'Perimeter'],
      Racks: ['Standard', 'Seismic']
    }
  },
  'data-center-solutions': {
    level1: ['Power', 'Cooling', 'Racks'],
    level2: {
      Power: ['PDU', 'STS', 'Busway'],
      Cooling: ['InRow', 'Perimeter'],
      Racks: ['Standard', 'Seismic']
    }
  },
  'fiber cables': {
    level1: ['Indoor', 'Outdoor', 'FTTx'],
    level2: {}
  },
  'fiber-cables': {
    level1: ['Indoor', 'Outdoor', 'FTTx'],
    level2: {}
  },
  'networking products': {
    level1: ['Switching', 'Routing', 'Wireless'],
    level2: {}
  },
  'networking-products': {
    level1: ['Switching', 'Routing', 'Wireless'],
    level2: {}
  }
};

const emptyRow = (nameKey = 'name', valueKey = 'value') => ({
  [nameKey]: '',
  [valueKey]: ''
});

const asText = (value) => (value == null ? '' : String(value));

const normalizeCategoryList = (items = []) =>
  items
    .map((item) =>
      typeof item === 'string'
        ? item
        : item?.name || item?.Name || item?.slug || item?.slugName || item?.title || ''
    )
    .map((item) => String(item || '').trim())
    .filter(Boolean);

const parseSpecRows = (item) => {
  if (Array.isArray(item?.detailRows) && item.detailRows.length) {
    return item.detailRows
      .map((row) => ({
        name: row.parameter || row.name || '',
        value: row.value || ''
      }))
      .filter((row) => row.name || row.value);
  }

  if (item?.specs && typeof item.specs === 'object') {
    return Object.entries(item.specs).map(([name, value]) => ({ name, value }));
  }

  return [emptyRow('name', 'value')];
};

const parseInfoRows = (item) => {
  if (Array.isArray(item?.infoSections) && item.infoSections.length) {
    return item.infoSections
      .map((row) => ({
        title: row.title || row.heading || '',
        detail: row.detail || row.text || ''
      }))
      .filter((row) => row.title || row.detail);
  }

  if (Array.isArray(item?.infoRows) && item.infoRows.length) {
    return item.infoRows
      .map((row) => ({
        title: row.title || '',
        detail: row.detail || ''
      }))
      .filter((row) => row.title || row.detail);
  }

  return [emptyRow('title', 'detail')];
};

const parseFeatureRows = (item) => {
  if (Array.isArray(item?.features) && item.features.length) {
    return item.features
      .map((entry) =>
        typeof entry === 'object'
          ? { title: String(entry.title || entry.name || '').trim(), detail: String(entry.detail || '').trim() }
          : { title: String(entry || '').trim(), detail: '' }
      )
      .filter((row) => row.title || row.detail);
  }

  return [emptyRow('title', 'detail')];
};

const parseCategoryParts = (value) =>
  String(value || '')
    .split('>')
    .map((part) => part.trim())
    .filter(Boolean);

const buildLookupTree = (backendTree = {}) => {
  const lookup = { ...LOCAL_CATEGORY_TREE };

  Object.entries(backendTree || {}).forEach(([key, value]) => {
    lookup[normalizeKey(key)] = value;
  });

  return lookup;
};

const buildPdfBlob = (values) => {
  const doc = new jsPDF('p', 'pt', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 36;
  const contentWidth = pageWidth - margin * 2;
  const accent = '#1b1f3b';
  const muted = '#4a507c';
  const line = '#e0e3ff';
  const now = new Date();
  const name = values.name || 'Product';
  const sku = values.sku || 'N/A';
  const category = values.enableSubCategories
    ? [values.categorySelect === 'custom' ? values.customCategory : values.categorySelect, values.subCategory1, values.subCategory2, values.subCategory3]
        .filter(Boolean)
        .join(' > ')
    : values.categorySelect === 'custom'
      ? values.customCategory
      : values.categorySelect;

  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  doc.setDrawColor(225, 228, 255);
  doc.setLineWidth(1);
  doc.roundedRect(margin, 28, contentWidth, pageHeight - 56, 12, 12);

  doc.setTextColor(accent);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('ExTell', margin + 6, 58);
  doc.setFontSize(16);
  doc.text('PRODUCT INFO SHEET', margin + 6, 80);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(muted);
  doc.text(`Generated: ${now.toLocaleString()}`, pageWidth - margin - 6, 58, { align: 'right' });
  doc.text(`Report ID: ${sanitizeFileName(`${sku}_${now.toISOString().slice(0, 10)}`)}`, pageWidth - margin - 6, 72, {
    align: 'right'
  });

  const drawSection = (title, y) => {
    doc.setTextColor(accent);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(title, margin + 6, y);
    doc.setDrawColor(225, 228, 255);
    doc.setLineWidth(0.8);
    doc.line(margin + 6, y + 6, pageWidth - margin - 6, y + 6);
    return y + 24;
  };

  const drawKeyValue = (label, value, x, y, valueWidth = 160) => {
    doc.setTextColor(muted);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(label, x, y);
    doc.setTextColor(accent);
    doc.setFont('helvetica', 'bold');
    const lines = doc.splitTextToSize(asText(value || 'N/A'), valueWidth);
    doc.text(lines, x + 112, y);
    return y + Math.max(14, lines.length * 12);
  };

  let y = 102;
  y = drawSection('Product Overview', y);
  const leftX = margin + 6;
  const rightX = margin + 250;
  let leftY = y;
  leftY = drawKeyValue('Name:', name, leftX, leftY);
  leftY = drawKeyValue('SKU:', sku, leftX, leftY);
  leftY = drawKeyValue('Model:', values.modelNumber || 'N/A', leftX, leftY);
  leftY = drawKeyValue('Category:', category || 'N/A', leftX, leftY);
  leftY = drawKeyValue('Featured:', values.isFeatured ? 'Yes' : 'No', leftX, leftY);

  let rightY = y;
  rightY = drawKeyValue('Hero Image:', values.heroImage ? 'Available' : 'Not set', rightX, rightY);
  rightY = drawKeyValue('Datasheet:', values.datasheet ? 'Available' : 'Not set', rightX, rightY);
  rightY = drawKeyValue('Download:', values.downloadUrl ? 'Available' : 'Not set', rightX, rightY);
  rightY = drawKeyValue('Cert:', values.certificationUrl ? 'Available' : 'Not set', rightX, rightY);
  rightY = drawKeyValue('Info PDF:', values.infoPdfUrl ? 'Available' : 'Not set', rightX, rightY);

  y = Math.max(leftY, rightY) + 12;
  y = drawSection('Specifications', y);

  const specRows = (values.specRows || []).filter((row) => row.name || row.value);
  const specWidth = contentWidth - 12;
  const specLeft = margin + 6;
  const specRowHeight = 20;
  doc.setFillColor(248, 249, 255);
  doc.roundedRect(specLeft, y, specWidth, specRowHeight, 6, 6, 'F');
  doc.setFontSize(10);
  doc.setTextColor(accent);
  doc.setFont('helvetica', 'bold');
  doc.text('Parameter', specLeft + 8, y + 13);
  doc.text('Value', specLeft + 185, y + 13);

  let specY = y + specRowHeight;
  const specVisible = specRows.slice(0, 8);
  if (!specVisible.length) {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(muted);
    doc.text('No specifications available.', specLeft, specY + 12);
    specY += 18;
  } else {
    specVisible.forEach((row, index) => {
      doc.setFillColor(index % 2 === 0 ? 255 : 248, index % 2 === 0 ? 255 : 249, index % 2 === 0 ? 255 : 255);
      doc.roundedRect(specLeft, specY, specWidth, specRowHeight, 0, 0, 'F');
      doc.setTextColor(accent);
      doc.setFont('helvetica', 'normal');
      doc.text(asText(row.name), specLeft + 8, specY + 13);
      doc.text(asText(row.value), specLeft + 185, specY + 13);
      doc.setDrawColor(225, 228, 255);
      doc.line(specLeft, specY + specRowHeight, specLeft + specWidth, specY + specRowHeight);
      specY += specRowHeight;
    });
  }

  y = specY + 12;
  y = drawSection('Features', y);
  const features = (values.features || []).filter((row) => row.title || row.detail).slice(0, 6);
  if (!features.length) {
    doc.setTextColor(muted);
    doc.text('No features listed.', margin + 6, y);
    y += 16;
  } else {
    features.forEach((row) => {
      const lineText = row.detail ? `${row.title}: ${row.detail}` : row.title;
      const lines = doc.splitTextToSize(lineText, contentWidth - 24);
      doc.setTextColor(accent);
      doc.text(`- ${lines[0]}`, margin + 10, y);
      if (lines.length > 1) {
        doc.text(lines.slice(1), margin + 18, y + 12);
      }
      y += lines.length * 12 + 4;
    });
  }

  y = drawSection('Additional Info', y + 4);
  const infoRows = (values.infoRows || []).filter((row) => row.title || row.detail).slice(0, 6);
  if (!infoRows.length) {
    doc.setTextColor(muted);
    doc.text('No additional information available.', margin + 6, y);
    y += 16;
  } else {
    infoRows.forEach((row) => {
      const lineText = row.detail ? `${row.title}: ${row.detail}` : row.title;
      const lines = doc.splitTextToSize(lineText, contentWidth - 24);
      doc.setTextColor(accent);
      doc.text(lines, margin + 10, y);
      y += lines.length * 12 + 4;
    });
  }

  const footerY = pageHeight - 56;
  doc.setDrawColor(225, 228, 255);
  doc.line(margin + 6, footerY - 14, pageWidth - margin - 6, footerY - 14);
  doc.setFontSize(9);
  doc.setTextColor(accent);
  doc.text(
    'Please contact ExTell Support at support@extellsystems.com for detailed documentation.',
    margin + 6,
    footerY
  );
  doc.setTextColor(muted);
  doc.text(`© ${now.getFullYear()} ExTell Systems. All rights reserved.`, pageWidth - margin - 6, footerY + 16, {
    align: 'right'
  });

  return doc.output('blob');
};

const ProductsPage = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryTree, setCategoryTree] = useState({});
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [subCategory1Filter, setSubCategory1Filter] = useState('');
  const [subCategory2Filter, setSubCategory2Filter] = useState('');
  const [subCategory3Filter, setSubCategory3Filter] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadItem, setUploadItem] = useState(null);
  const [heroUploading, setHeroUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [datasheetUploading, setDatasheetUploading] = useState(false);
  const [downloadUploading, setDownloadUploading] = useState(false);
  const [certUploading, setCertUploading] = useState(false);
  const [infoPdfUploading, setInfoPdfUploading] = useState(false);
  const [infoPdfGenerating, setInfoPdfGenerating] = useState(false);
  const [duplicateLoadingId, setDuplicateLoadingId] = useState(null);

  const PAGE_SIZE = 10;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    getValues,
    control
  } = useForm({
    defaultValues: {
      name: '',
      sku: '',
      modelNumber: '',
      categorySelect: '',
      customCategory: '',
      description: '',
      heroImage: '',
      images: '',
      datasheet: '',
      downloadUrl: '',
      certificationUrl: '',
      infoPdfUrl: '',
      contactUrl: '',
      specRows: [emptyRow('name', 'value')],
      infoRows: [emptyRow('title', 'detail')],
      features: [emptyRow('title', 'detail')],
      subCategory1: '',
      subCategory2: '',
      subCategory3: '',
      isFeatured: false,
      enableSubCategories: false
    }
  });

  const {
    register: registerUploads,
    handleSubmit: handleUploadSubmit,
    reset: resetUploadForm,
    setValue: setUploadValue,
    watch: watchUploads,
    getValues: getUploadValues
  } = useForm({
    defaultValues: {
      modelNumber: '',
      heroImage: '',
      images: '',
      datasheet: '',
      downloadUrl: '',
      certificationUrl: '',
      infoPdfUrl: ''
    }
  });

  const { fields: specRows, append: appendSpecRow, remove: removeSpecRow, replace: replaceSpecRows } = useFieldArray({
    control,
    name: 'specRows'
  });
  const { fields: infoRows, append: appendInfoRow, remove: removeInfoRow, replace: replaceInfoRows } = useFieldArray({
    control,
    name: 'infoRows'
  });
  const { fields: featureRows, append: appendFeatureRow, remove: removeFeatureRow, replace: replaceFeatureRows } = useFieldArray({
    control,
    name: 'features'
  });

  const watchCategorySelect = watch('categorySelect');
  const watchSubCategory1 = watch('subCategory1');
  const watchSubCategory2 = watch('subCategory2');
  const watchEnableSub = watch('enableSubCategories');

  const lookupTree = useMemo(() => buildLookupTree(categoryTree), [categoryTree]);
  const categoryNames = useMemo(() => normalizeCategoryList(categories), [categories]);
  const filteredCategories = useMemo(() => categoryNames.filter(Boolean), [categoryNames]);

  const currentCategoryConfig = lookupTree[normalizeKey(watchCategorySelect)] || null;
  const level1Options = currentCategoryConfig?.level1 || [];
  const level2Options = currentCategoryConfig?.level2?.[watchSubCategory1] || [];
  const level3Key = `${watchSubCategory1} > ${watchSubCategory2}`;
  const level3Options = currentCategoryConfig?.level3?.[level3Key] || [];

  const filterCategoryConfig = lookupTree[normalizeKey(categoryFilter)] || null;
  const filterLevel1Options = filterCategoryConfig?.level1 || [];
  const filterLevel2Options = filterCategoryConfig?.level2?.[subCategory1Filter] || [];
  const filterLevel3Key = `${subCategory1Filter} > ${subCategory2Filter}`;
  const filterLevel3Options = filterCategoryConfig?.level3?.[filterLevel3Key] || [];

  const loadData = async (pageValue = page) => {
    setLoading(true);
    setLoadError('');

    try {
      const response = await fetchAdminProducts({
        q: search || undefined,
        category: categoryFilter || undefined,
        subCategory1: subCategory1Filter || undefined,
        subCategory2: subCategory2Filter || undefined,
        subCategory3: subCategory3Filter || undefined,
        page: pageValue,
        limit: PAGE_SIZE
      });

      const categoriesResponse = await fetchAdminCategories();
      setItems(response.items || []);
      setTotal(response.total || 0);
      setCategories(categoriesResponse.items || []);
      setCategoryTree(categoriesResponse.tree || {});
    } catch (error) {
      setLoadError(error?.response?.data?.message || error?.message || 'Unable to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(1);
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setValue('subCategory1', '');
    setValue('subCategory2', '');
    setValue('subCategory3', '');
    setValue('enableSubCategories', false);
  }, [watchCategorySelect, setValue]);

  useEffect(() => {
    if (!level2Options.length) {
      setValue('subCategory2', '');
      setValue('subCategory3', '');
    }
  }, [level2Options.length, setValue, watchCategorySelect, watchSubCategory1]);

  useEffect(() => {
    if (!level3Options.length) {
      setValue('subCategory3', '');
    }
  }, [level3Options.length, setValue, watchCategorySelect, watchSubCategory1, watchSubCategory2]);

  useEffect(() => {
    if (!categoryFilter) {
      setSubCategory1Filter('');
      setSubCategory2Filter('');
      setSubCategory3Filter('');
      return;
    }

    if (filterLevel1Options.length && !filterLevel1Options.includes(subCategory1Filter)) {
      setSubCategory1Filter('');
      setSubCategory2Filter('');
      setSubCategory3Filter('');
    }
  }, [categoryFilter, filterLevel1Options, subCategory1Filter]);

  useEffect(() => {
    if (filterLevel2Options.length && !filterLevel2Options.includes(subCategory2Filter)) {
      setSubCategory2Filter('');
      setSubCategory3Filter('');
    }
  }, [filterLevel2Options, subCategory2Filter]);

  useEffect(() => {
    if (filterLevel3Options.length && !filterLevel3Options.includes(subCategory3Filter)) {
      setSubCategory3Filter('');
    }
  }, [filterLevel3Options, subCategory3Filter]);

  const pageCount = Math.max(1, Math.ceil((total || items.length || 0) / PAGE_SIZE));
  const startItem = total ? (page - 1) * PAGE_SIZE + 1 : 0;
  const endItem = total ? Math.min(page * PAGE_SIZE, total) : 0;

  const buildPageList = () => {
    if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1);

    const pages = [1];
    const left = Math.max(2, page - 1);
    const right = Math.min(pageCount - 1, page + 1);
    if (left > 2) pages.push('...');
    for (let p = left; p <= right; p += 1) pages.push(p);
    if (right < pageCount - 1) pages.push('...');
    pages.push(pageCount);
    return pages;
  };

  const buildSpecPayload = (rows = []) =>
    rows
      .map((row) => ({
        name: asText(row.name).trim(),
        value: asText(row.value).trim()
      }))
      .filter((row) => row.name || row.value);

  const buildInfoPayload = (rows = []) =>
    rows
      .map((row) => ({
        title: asText(row.title).trim(),
        detail: asText(row.detail).trim()
      }))
      .filter((row) => row.title || row.detail);

  const buildFeaturePayload = (rows = []) =>
    rows
      .map((row) => ({
        title: asText(row.title).trim(),
        detail: asText(row.detail).trim()
      }))
      .filter((row) => row.title || row.detail);

  const buildProductPayload = (values, existingItem = null) => {
    const resolvedCategory = values.categorySelect === 'custom' ? values.customCategory : values.categorySelect;
    const categoryParts = values.enableSubCategories
      ? [resolvedCategory, values.subCategory1, values.subCategory2, values.subCategory3]
      : [resolvedCategory];
    const categoryString = categoryParts.filter(Boolean).join(' > ');
    const specRowsPayload = buildSpecPayload(values.specRows || []);
    const infoRowsPayload = buildInfoPayload(values.infoRows || []);
    const featuresPayload = buildFeaturePayload(values.features || []);
    const specsObject = {};

    specRowsPayload.forEach(({ name, value }) => {
      if (name) specsObject[name] = value;
    });

    return {
      name: values.name || existingItem?.Name || existingItem?.name || '',
      sku: values.sku || existingItem?.SKU || existingItem?.sku || existingItem?.id || '',
      SKU: values.sku || existingItem?.SKU || existingItem?.sku || existingItem?.id || '',
      modelNumber: values.modelNumber || existingItem?.modelNumber || existingItem?.ModelNumber || existingItem?.model_number || '',
      category: categoryString || resolvedCategory || existingItem?.category || existingItem?.Categories || '',
      rootCategory: resolvedCategory || existingItem?.rootCategory || '',
      subCategory1: values.enableSubCategories ? values.subCategory1 : '',
      subCategory2: values.enableSubCategories ? values.subCategory2 : '',
      subCategory3: values.enableSubCategories ? values.subCategory3 : '',
      description: values.description || existingItem?.descriptionText || existingItem?.description || '',
      detailRows: specRowsPayload.map(({ name, value }) => ({ parameter: name, value })),
      specifications: specsObject,
      infoSections: infoRowsPayload.map(({ title, detail }) => ({ title, detail })),
      infoRows: infoRowsPayload,
      features: featuresPayload,
      images: joinCsv(values.images),
      heroImage: values.heroImage || existingItem?.heroImage || '',
      datasheet: values.datasheet || existingItem?.datasheet || existingItem?.Datasheet || '',
      downloadUrl: values.downloadUrl || existingItem?.downloadUrl || '',
      certificationUrl: values.certificationUrl || existingItem?.certificationUrl || '',
      infoPdfUrl: values.infoPdfUrl || existingItem?.infoPdfUrl || '',
      contactUrl: values.contactUrl || existingItem?.contactUrl || '',
      isFeatured: Boolean(values.isFeatured),
      featured: Boolean(values.isFeatured)
    };
  };

  const openModal = (item = null) => {
    setActiveItem(item);
    setModalOpen(true);

    const rawCategory = item?.category || item?.Categories || '';
    const categoryParts = parseCategoryParts(rawCategory);
    const rootCategory = categoryParts[0] || rawCategory;
    const isKnownCategory = filteredCategories.includes(rootCategory);
    const subCategory1 = categoryParts[1] || '';
    const subCategory2 = categoryParts[2] || '';
    const subCategory3 = categoryParts[3] || '';
    const parsedSpecs = parseSpecRows(item);
    const parsedInfo = parseInfoRows(item);
    const parsedFeatures = parseFeatureRows(item);

    reset({
      name: item?.Name || item?.name || '',
      sku: item?.SKU || item?.sku || item?.id || '',
      modelNumber: item?.modelNumber || item?.ModelNumber || item?.model_number || item?.modelNo || '',
      categorySelect: isKnownCategory ? rootCategory : rootCategory ? 'custom' : '',
      customCategory: isKnownCategory ? '' : rootCategory,
      description: item?.descriptionText || item?.description || '',
      heroImage: item?.heroImage || item?.Images?.[0] || '',
      images: Array.isArray(item?.Images) ? item.Images.join(', ') : item?.images || item?.Images || '',
      datasheet: item?.datasheet || item?.Datasheet || '',
      downloadUrl: item?.downloadUrl || '',
      certificationUrl: item?.certificationUrl || '',
      infoPdfUrl: item?.infoPdfUrl || '',
      contactUrl: item?.contactUrl || '',
      specRows: parsedSpecs.length ? parsedSpecs : [emptyRow('name', 'value')],
      infoRows: parsedInfo.length ? parsedInfo : [emptyRow('title', 'detail')],
      features: parsedFeatures.length ? parsedFeatures : [emptyRow('title', 'detail')],
      subCategory1,
      subCategory2,
      subCategory3,
      isFeatured: Boolean(item?.isFeatured ?? item?.featured ?? item?.['Is featured?']),
      enableSubCategories: Boolean(subCategory1 || subCategory2 || subCategory3)
    });

    replaceSpecRows(parsedSpecs.length ? parsedSpecs : [emptyRow('name', 'value')]);
    replaceInfoRows(parsedInfo.length ? parsedInfo : [emptyRow('title', 'detail')]);
    replaceFeatureRows(parsedFeatures.length ? parsedFeatures : [emptyRow('title', 'detail')]);
  };

  const closeModal = () => {
    setModalOpen(false);
    setActiveItem(null);
  };

  const openUploadModal = (item) => {
    if (!item) return;
    setUploadItem(item);
    resetUploadForm({
      modelNumber: item.modelNumber || item.ModelNumber || item.model_number || item.modelNo || '',
      heroImage: item.heroImage || (Array.isArray(item.Images) ? item.Images[0] : '') || '',
      images: Array.isArray(item.Images) ? item.Images.join(', ') : item.images || item.Images || '',
      datasheet: item.datasheet || item.Datasheet || '',
      downloadUrl: item.downloadUrl || '',
      certificationUrl: item.certificationUrl || '',
      infoPdfUrl: item.infoPdfUrl || ''
    });
    setUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    setUploadModalOpen(false);
    setUploadItem(null);
    resetUploadForm();
  };

  const handleHeroUpload = async (event, setter = setValue) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setHeroUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setter('heroImage', url);
    } catch (error) {
      alert(error.message || 'Upload failed');
    } finally {
      setHeroUploading(false);
    }
  };

  const handleGalleryUpload = async (
    event,
    { getValueFn = getValues, setValueFn = setValue } = {}
  ) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setGalleryUploading(true);
    try {
      const uploaded = [];
      for (const file of files) {
        const url = await uploadToCloudinary(file);
        uploaded.push(url);
      }
      const existing = splitCsv(getValueFn('images'));
      setValueFn('images', [...existing, ...uploaded].join(', '));
    } catch (error) {
      alert(error.message || 'Upload failed');
    } finally {
      setGalleryUploading(false);
    }
  };

  const handleDocUpload = async (event, fieldName, setUploading, setter = setValue) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setter(fieldName, url);
    } catch (error) {
      alert(error.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const clearField = (fieldName, setter = setValue) => setter(fieldName, '');
  const clearUploadField = (fieldName) => clearField(fieldName, setUploadValue);

  const removeUrlFromField = (fieldName, urlToRemove, getter = getValues, setter = setValue) => {
    const list = splitCsv(getter(fieldName)).filter((entry) => entry !== urlToRemove);
    setter(fieldName, list.join(', '));
  };

  const removeUploadUrl = (fieldName, urlToRemove) =>
    removeUrlFromField(fieldName, urlToRemove, getUploadValues, setUploadValue);

  const onSubmit = async (values) => {
    const payload = buildProductPayload(values, activeItem);
    try {
      if (activeItem?._id) {
        await updateAdminProduct(activeItem._id, payload);
      } else {
        await createAdminProduct(payload);
      }
      closeModal();
      loadData(page);
    } catch (error) {
      alert(error?.response?.data?.message || error?.message || 'Unable to save product.');
    }
  };

  const submitUploadOnly = async (values) => {
    if (!uploadItem?._id) return;
    const payload = buildProductPayload(
      {
        ...getValues(),
        ...values,
        specRows: getValues('specRows'),
        infoRows: getValues('infoRows'),
        features: getValues('features')
      },
      uploadItem
    );
    await updateAdminProduct(uploadItem._id, payload);
    closeUploadModal();
    loadData(page);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await deleteAdminProduct(id);
    loadData(page);
  };

  const handleDuplicate = async (item) => {
    if (!item) return;
    setDuplicateLoadingId(item._id || item.id);
    try {
      const baseValues = {
        ...item,
        name: `${item.Name || item.name || 'Product'} (Copy)`,
        sku: `${item.SKU || item.sku || item.id || 'SKU'}-COPY`
      };
      const payload = buildProductPayload(
        {
          name: baseValues.name,
          sku: baseValues.sku,
          modelNumber: item.modelNumber || item.ModelNumber || '',
          categorySelect: item.category || item.Categories || '',
          customCategory: '',
          description: item.descriptionText || item.description || '',
          heroImage: item.heroImage || '',
          images: Array.isArray(item.Images) ? item.Images.join(', ') : item.images || '',
          datasheet: item.datasheet || item.Datasheet || '',
          downloadUrl: item.downloadUrl || '',
          certificationUrl: item.certificationUrl || '',
          infoPdfUrl: item.infoPdfUrl || '',
          contactUrl: item.contactUrl || '',
          specRows: parseSpecRows(item),
          infoRows: parseInfoRows(item),
          features: parseFeatureRows(item),
          subCategory1: item.subCategory1 || parseCategoryParts(item.category || item.Categories || '')[1] || '',
          subCategory2: item.subCategory2 || parseCategoryParts(item.category || item.Categories || '')[2] || '',
          subCategory3: item.subCategory3 || parseCategoryParts(item.category || item.Categories || '')[3] || '',
          isFeatured: Boolean(item.isFeatured ?? item.featured),
          enableSubCategories: Boolean(item.subCategory1 || item.subCategory2 || item.subCategory3)
        },
        item
      );

      const response = await createAdminProduct(payload);
      const created = response?.item || response?.product || response?.data || null;
      if (created) openModal(created);
      loadData(page);
    } catch (error) {
      alert(error?.response?.data?.message || error?.message || 'Unable to duplicate product.');
    } finally {
      setDuplicateLoadingId(null);
    }
  };

  const handleFilter = () => {
    setPage(1);
    loadData(1);
  };

  const handleClearFilters = () => {
    setSearch('');
    setCategoryFilter('');
    setSubCategory1Filter('');
    setSubCategory2Filter('');
    setSubCategory3Filter('');
    setPage(1);
    loadData(1);
  };

  const handleGenerateInfoPdf = async () => {
    setInfoPdfGenerating(true);
    try {
      const values = getValues();
      const blob = buildPdfBlob(values);
      const filename = `${sanitizeFileName(values.name || 'product')}_info.pdf`;
      const file = new File([blob], filename, { type: 'application/pdf' });
      const url = await uploadToCloudinary(file);
      setValue('infoPdfUrl', url);
      alert('Info PDF generated and uploaded.');
    } catch (error) {
      alert(error?.message || 'Unable to generate PDF');
    } finally {
      setInfoPdfGenerating(false);
    }
  };

  const openReportPreview = () => {
    const values = getValues();
    const blob = buildPdfBlob(values);
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${sanitizeFileName(values.name || 'product')}_info.pdf`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const renderRows = (fields, append, remove, prefixA, prefixB, kind = 'spec') => (
    <div className="space-y-3">
      {fields.map((field, index) => (
        <div key={field.id} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <input
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder={kind === 'spec' ? 'Parameter' : 'Title'}
            {...register(`${kind === 'spec' ? 'specRows' : kind === 'info' ? 'infoRows' : 'features'}.${index}.${prefixA}`)}
          />
          <input
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder={kind === 'spec' ? 'Value' : 'Detail'}
            {...register(`${kind === 'spec' ? 'specRows' : kind === 'info' ? 'infoRows' : 'features'}.${index}.${prefixB}`)}
          />
          <button
            type="button"
            onClick={() => remove(index)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => append(kind === 'spec' ? emptyRow('name', 'value') : emptyRow('title', 'detail'))}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
      >
        <Plus size={16} />
        Add {kind === 'spec' ? 'Spec' : kind === 'info' ? 'Info' : 'Feature'}
      </button>
    </div>
  );

  const renderImageList = (value, onRemove, clear, isUpload = false) => {
    const list = splitCsv(value);
    if (!list.length) return null;

    return (
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {list.map((url) => (
            <span
              key={url}
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700"
            >
              <span className="max-w-[180px] truncate">{url}</span>
              <button
                type="button"
                onClick={() => onRemove(url)}
                className="text-rose-600"
                aria-label="Remove image"
              >
                <X size={14} />
              </button>
            </span>
          ))}
          <button type="button" onClick={clear} className="text-xs text-rose-600 underline">
            Clear all images
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {list.map((url) => (
            <div key={url} className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-2">
              <img
                src={url}
                alt="Gallery preview"
                className="h-28 w-full rounded-md object-cover bg-slate-50"
                loading="lazy"
                decoding="async"
              />
              <button
                type="button"
                onClick={() => onRemove(url)}
                className="self-start text-xs text-rose-600 underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderUploadSection = (label, fieldName, uploadStateSetter, accept = 'application/pdf', inputType = 'file') => (
    <div className="grid gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
      <label className="text-sm text-slate-600">
        {label}
        <input
          className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
          {...register(fieldName)}
        />
      </label>
      <div className="flex items-center gap-3">
        <input
          type={inputType}
          accept={accept}
          onChange={(e) => handleDocUpload(e, fieldName, uploadStateSetter)}
        />
        <button
          type="button"
          className="text-xs text-rose-600 underline"
          onClick={() => clearField(fieldName)}
        >
          Clear
        </button>
        {uploadStateSetter === setDatasheetUploading && datasheetUploading ? (
          <span className="text-xs text-slate-500">Uploading datasheet...</span>
        ) : null}
        {uploadStateSetter === setDownloadUploading && downloadUploading ? (
          <span className="text-xs text-slate-500">Uploading download...</span>
        ) : null}
        {uploadStateSetter === setCertUploading && certUploading ? (
          <span className="text-xs text-slate-500">Uploading certification...</span>
        ) : null}
        {uploadStateSetter === setInfoPdfUploading && infoPdfUploading ? (
          <span className="text-xs text-slate-500">Uploading info PDF...</span>
        ) : null}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 p-4">
      <PageHeader
        title="Products"
        subtitle="Manage product listings, media, documents, and product report assets."
        actions={
          <>
            <button
              type="button"
              onClick={() => openModal()}
              className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white"
            >
              <Plus size={16} />
              Add Product
            </button>
          </>
        }
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, SKU, or model"
              className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-2 text-sm"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="">All Categories</option>
            {filteredCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            value={subCategory1Filter}
            onChange={(e) => setSubCategory1Filter(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            disabled={!categoryFilter || !filterLevel1Options.length}
          >
            <option value="">All Level 1</option>
            {filterLevel1Options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            value={subCategory2Filter}
            onChange={(e) => setSubCategory2Filter(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            disabled={!subCategory1Filter || !filterLevel2Options.length}
          >
            <option value="">All Level 2</option>
            {filterLevel2Options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            value={subCategory3Filter}
            onChange={(e) => setSubCategory3Filter(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            disabled={!subCategory2Filter || !filterLevel3Options.length}
          >
            <option value="">All Level 3</option>
            {filterLevel3Options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleFilter}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={handleClearFilters}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {loading ? (
          <p className="text-sm text-slate-500">Loading products...</p>
        ) : loadError ? (
          <p className="text-sm text-rose-600">{loadError}</p>
        ) : (
          <>
            <div className="mb-3 flex items-center justify-between text-sm text-slate-500">
              <span>
                Showing {startItem || 0}-{endItem || items.length || 0} of {total || items.length || 0}
              </span>
              <span>{pageCount} page(s)</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase text-slate-500">
                    <th className="py-3 pr-3">Name</th>
                    <th className="py-3 pr-3">SKU</th>
                    <th className="py-3 pr-3">Category</th>
                    <th className="py-3 pr-3">Featured</th>
                    <th className="py-3 pr-3">Created</th>
                    <th className="py-3 pr-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const itemName = item.Name || item.name || '--';
                    const itemSku = item.SKU || item.sku || item.id || '--';
                    return (
                      <tr key={item._id || item.id || itemSku} className="border-b last:border-0">
                        <td className="py-3 pr-3 font-medium text-slate-900">{itemName}</td>
                        <td className="py-3 pr-3 text-slate-600">{itemSku}</td>
                        <td className="py-3 pr-3 text-slate-600">{item.category || item.Categories || '--'}</td>
                        <td className="py-3 pr-3">
                          {item.isFeatured || item.featured ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">
                              <Star className="h-3.5 w-3.5" />
                              Featured
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">No</span>
                          )}
                        </td>
                        <td className="py-3 pr-3 text-slate-600">
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '--'}
                        </td>
                        <td className="py-3 pr-3">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => openModal(item)}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50"
                            >
                              <Pencil size={14} />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => openUploadModal(item)}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50"
                            >
                              <UploadCloud size={14} />
                              Upload Assets
                            </button>
                            <button
                              type="button"
                              disabled={duplicateLoadingId === (item._id || item.id)}
                              onClick={() => handleDuplicate(item)}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50 disabled:opacity-60"
                            >
                              <Copy size={14} />
                              {duplicateLoadingId === (item._id || item.id) ? 'Duplicating...' : 'Duplicate'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(item._id)}
                              className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {pageCount > 1 ? (
              <div className="mt-6 flex items-center justify-center gap-2">
                {buildPageList().map((entry, index) =>
                  entry === '...' ? (
                    <span key={`ellipsis-${index}`} className="px-2 text-slate-400">
                      ...
                    </span>
                  ) : (
                    <button
                      key={entry}
                      type="button"
                      onClick={() => {
                        setPage(entry);
                        loadData(entry);
                      }}
                      className={`h-9 min-w-9 rounded-lg border px-3 text-sm font-semibold transition ${
                        entry === page
                          ? 'border-black bg-black text-white'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {entry}
                    </button>
                  )
                )}
              </div>
            ) : null}
          </>
        )}
      </div>

      <Modal
        open={modalOpen}
        title={activeItem ? 'Edit Product' : 'Add Product'}
        onClose={closeModal}
        footer={
          <div className="flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={closeModal}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white"
            >
              Save Product
            </button>
            <button
              type="button"
              onClick={handleGenerateInfoPdf}
              disabled={infoPdfGenerating}
              className="rounded-lg border border-slate-900 px-4 py-2 text-sm font-semibold text-slate-900 disabled:opacity-60"
            >
              {infoPdfGenerating ? 'Generating PDF...' : 'Generate Info PDF'}
            </button>
            <button
              type="button"
              onClick={openReportPreview}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm"
            >
              Download PDF
            </button>
          </div>
        }
      >
        <form className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-slate-600">
            Product Name
            <input
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
              {...register('name', { required: true })}
            />
          </label>

          <label className="text-sm text-slate-600">
            SKU
            <input
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
              {...register('sku', { required: true })}
            />
          </label>

          <label className="text-sm text-slate-600">
            Model Number
            <input
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
              {...register('modelNumber')}
            />
          </label>

          <label className="text-sm text-slate-600">
            Category
            <select
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
              {...register('categorySelect', { required: true })}
              defaultValue=""
            >
              <option value="">Select category</option>
              {filteredCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
              <option value="custom">Other (custom)</option>
            </select>
          </label>

          {watchCategorySelect === 'custom' ? (
            <label className="text-sm text-slate-600 md:col-span-2">
              Custom Category
              <input
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
                placeholder="Type a category"
                {...register('customCategory', { required: true })}
              />
            </label>
          ) : null}

          <div className="md:col-span-2 grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" {...register('enableSubCategories')} />
                Enable subcategories
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" {...register('isFeatured')} />
                Featured product
              </label>
            </div>

            {watchEnableSub ? (
              <div className="grid gap-3 md:grid-cols-3">
                <label className="text-sm text-slate-600">
                  Subcategory Level 1
                  <select
                    className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
                    {...register('subCategory1')}
                  >
                    <option value="">Select level 1</option>
                    {level1Options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm text-slate-600">
                  Subcategory Level 2
                  <select
                    className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
                    {...register('subCategory2')}
                  >
                    <option value="">Select level 2</option>
                    {level2Options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm text-slate-600">
                  Subcategory Level 3
                  <select
                    className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
                    {...register('subCategory3')}
                  >
                    <option value="">Select level 3</option>
                    {level3Options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            ) : null}
          </div>

          <label className="md:col-span-2 text-sm text-slate-600">
            Description
            <textarea
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
              rows={4}
              {...register('description')}
            />
          </label>

          <div className="md:col-span-2 rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center gap-2">
              <Layers3 className="h-4 w-4 text-slate-700" />
              <h3 className="text-sm font-semibold text-slate-900">Specifications</h3>
            </div>
            {renderRows(specRows, appendSpecRow, removeSpecRow, 'name', 'value', 'spec')}
          </div>

          <div className="md:col-span-2 rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center gap-2">
              <BadgeInfo className="h-4 w-4 text-slate-700" />
              <h3 className="text-sm font-semibold text-slate-900">Info Rows</h3>
            </div>
            {renderRows(infoRows, appendInfoRow, removeInfoRow, 'title', 'detail', 'info')}
          </div>

          <div className="md:col-span-2 rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center gap-2">
              <FilePlus2 className="h-4 w-4 text-slate-700" />
              <h3 className="text-sm font-semibold text-slate-900">Features</h3>
            </div>
            {renderRows(featureRows, appendFeatureRow, removeFeatureRow, 'title', 'detail', 'feature')}
          </div>

          <div className="md:col-span-2 grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-sm text-slate-600">
                  Hero / Main Image URL
                  <input
                    className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
                    placeholder="https://..."
                    {...register('heroImage')}
                  />
                </label>
              </div>
              <div className="flex flex-col items-start gap-2">
                <input type="file" accept="image/*" onChange={handleHeroUpload} />
                {heroUploading ? <span className="text-xs text-slate-500">Uploading...</span> : null}
              </div>
            </div>
            {watch('heroImage') ? (
              <div className="rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-500">
                <p className="mb-2 font-medium text-slate-700">Preview</p>
                <img
                  src={watch('heroImage')}
                  alt="Hero"
                  className="h-28 w-40 rounded-lg object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ) : null}
          </div>

          <div className="md:col-span-2 grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1">
                <label className="text-sm text-slate-600">
                  Gallery Images (comma separated URLs)
                  <input
                    className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
                    placeholder="https://img1, https://img2"
                    {...register('images')}
                  />
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input type="file" multiple accept="image/*" onChange={handleGalleryUpload} />
                {galleryUploading ? <span className="text-xs text-slate-500">Uploading gallery...</span> : null}
              </div>
            </div>
            {renderImageList(
              watch('images'),
              (url) => removeUrlFromField('images', url),
              () => clearField('images')
            )}
          </div>

          <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
            <label className="text-sm text-slate-600">
              Datasheet URL
              <input className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" {...register('datasheet')} />
            </label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => handleDocUpload(e, 'datasheet', setDatasheetUploading)}
              />
              <button
                type="button"
                className="text-xs text-rose-600 underline"
                onClick={() => clearField('datasheet')}
              >
                Clear datasheet
              </button>
              {datasheetUploading ? <span className="text-xs text-slate-500">Uploading datasheet...</span> : null}
            </div>
          </div>

          <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
            <div className="grid gap-3 md:grid-cols-2">
              <label className="text-sm text-slate-600">
                Download / Manual (PDF URL)
                <input className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" {...register('downloadUrl')} />
              </label>
              <div className="flex flex-col justify-end gap-2">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => handleDocUpload(e, 'downloadUrl', setDownloadUploading)}
                />
                <button
                  type="button"
                  className="text-xs text-rose-600 underline"
                  onClick={() => clearField('downloadUrl')}
                >
                  Clear download
                </button>
                {downloadUploading ? <span className="text-xs text-slate-500">Uploading download...</span> : null}
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="text-sm text-slate-600">
                Certification Document (PDF URL)
                <input className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" {...register('certificationUrl')} />
              </label>
              <div className="flex flex-col justify-end gap-2">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => handleDocUpload(e, 'certificationUrl', setCertUploading)}
                />
                <button
                  type="button"
                  className="text-xs text-rose-600 underline"
                  onClick={() => clearField('certificationUrl')}
                >
                  Clear certification
                </button>
                {certUploading ? <span className="text-xs text-slate-500">Uploading certification...</span> : null}
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="text-sm text-slate-600">
                Info Sheet (PDF URL)
                <input className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" {...register('infoPdfUrl')} />
              </label>
              <div className="flex flex-col justify-end gap-2">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => handleDocUpload(e, 'infoPdfUrl', setInfoPdfUploading)}
                />
                <button
                  type="button"
                  className="text-xs text-rose-600 underline"
                  onClick={() => clearField('infoPdfUrl')}
                >
                  Clear info PDF
                </button>
                {infoPdfUploading ? <span className="text-xs text-slate-500">Uploading info PDF...</span> : null}
              </div>
            </div>
          </div>

          <label className="md:col-span-2 text-sm text-slate-600">
            Contact / CTA URL
            <input
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
              {...register('contactUrl')}
            />
          </label>

          <div className="md:col-span-2 flex flex-wrap gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <button
              type="button"
              onClick={handleGenerateInfoPdf}
              disabled={infoPdfGenerating}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-900 px-4 py-2 text-sm font-semibold text-slate-900 disabled:opacity-60"
            >
              <Download size={16} />
              {infoPdfGenerating ? 'Generating PDF...' : 'Generate Info PDF'}
            </button>
            <button
              type="button"
              onClick={openReportPreview}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm"
            >
              <FileText size={16} />
              Download PDF
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={uploadModalOpen}
        title="Upload Assets"
        onClose={closeUploadModal}
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={closeUploadModal} className="rounded-lg border border-slate-200 px-4 py-2 text-sm">
              Cancel
            </button>
            <button
              onClick={handleUploadSubmit(submitUploadOnly)}
              className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white"
            >
              Save Uploads
            </button>
          </div>
        }
      >
        <form className="grid gap-3">
          <label className="text-sm text-slate-600">
            Model Number
            <input className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" {...registerUploads('modelNumber')} />
          </label>

          <div className="grid gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <label className="text-sm text-slate-600">
              Hero / Main Image URL
              <input
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
                placeholder="https://..."
                {...registerUploads('heroImage')}
              />
            </label>
            <div className="flex items-center gap-3">
              <input type="file" accept="image/*" onChange={(e) => handleHeroUpload(e, setUploadValue)} />
              {heroUploading ? <span className="text-xs text-slate-500">Uploading...</span> : null}
              {watchUploads('heroImage') ? (
                <button
                  type="button"
                  onClick={() => clearUploadField('heroImage')}
                  className="text-xs text-rose-600 underline"
                >
                  Remove image
                </button>
              ) : null}
            </div>
          </div>

          <div className="grid gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <label className="text-sm text-slate-600">
              Gallery Images (comma separated URLs)
              <input
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
                placeholder="https://img1, https://img2"
                {...registerUploads('images')}
              />
            </label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) =>
                  handleGalleryUpload(e, {
                    getValueFn: getUploadValues,
                    setValueFn: setUploadValue
                  })
                }
              />
              {galleryUploading ? <span className="text-xs text-slate-500">Uploading gallery...</span> : null}
            </div>
            {renderImageList(
              watchUploads('images'),
              (url) => removeUploadUrl('images', url),
              () => clearUploadField('images')
            )}
          </div>

          <div className="grid gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <label className="text-sm text-slate-600">
              Datasheet URL
              <input className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" {...registerUploads('datasheet')} />
            </label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => handleDocUpload(e, 'datasheet', setDatasheetUploading, setUploadValue)}
              />
              <button type="button" className="text-xs text-rose-600 underline" onClick={() => clearUploadField('datasheet')}>
                Clear datasheet
              </button>
              {datasheetUploading ? <span className="text-xs text-slate-500">Uploading datasheet...</span> : null}
            </div>
          </div>

          <div className="grid gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <label className="text-sm text-slate-600">
              Download / Manual (PDF URL)
              <input className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" {...registerUploads('downloadUrl')} />
            </label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => handleDocUpload(e, 'downloadUrl', setDownloadUploading, setUploadValue)}
              />
              <button type="button" className="text-xs text-rose-600 underline" onClick={() => clearUploadField('downloadUrl')}>
                Clear download
              </button>
              {downloadUploading ? <span className="text-xs text-slate-500">Uploading download...</span> : null}
            </div>
          </div>

          <div className="grid gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <label className="text-sm text-slate-600">
              Certification Document (PDF URL)
              <input className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" {...registerUploads('certificationUrl')} />
            </label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => handleDocUpload(e, 'certificationUrl', setCertUploading, setUploadValue)}
              />
              <button
                type="button"
                className="text-xs text-rose-600 underline"
                onClick={() => clearUploadField('certificationUrl')}
              >
                Clear certification
              </button>
              {certUploading ? <span className="text-xs text-slate-500">Uploading certification...</span> : null}
            </div>
          </div>

          <div className="grid gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <label className="text-sm text-slate-600">
              Info Sheet (PDF URL)
              <input className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" {...registerUploads('infoPdfUrl')} />
            </label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => handleDocUpload(e, 'infoPdfUrl', setInfoPdfUploading, setUploadValue)}
              />
              <button type="button" className="text-xs text-rose-600 underline" onClick={() => clearUploadField('infoPdfUrl')}>
                Clear info PDF
              </button>
              {infoPdfUploading ? <span className="text-xs text-slate-500">Uploading info PDF...</span> : null}
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProductsPage;
