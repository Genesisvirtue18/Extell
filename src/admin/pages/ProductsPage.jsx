'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
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

const ProductsPage = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  const [heroUploading, setHeroUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);

  // ✅ Pagination state
  const [page, setPage] = useState(1);
  const limit = 30;
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / limit);

  const { register, handleSubmit, reset, setValue, watch, getValues } =
    useForm();

  const watchCategorySelect = watch('categorySelect');

  const loadData = async (pageNumber = page) => {
    setLoading(true);

    const [productsResponse, categoriesResponse] = await Promise.all([
      fetchAdminProducts({
        q: search || undefined,
        category: categoryFilter || undefined,
        page,
        limit
      }),
      fetchAdminCategories()
    ]);

    setItems(productsResponse.items || []);
    setTotal(productsResponse.total || 0);
    setCategories(categoriesResponse.items || []);

    setLoading(false);
  };

  useEffect(() => {
    loadData(1);
    setPage(1);
  }, []);

  const handleFilter = () => {
    setPage(1);
    loadData(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    loadData(newPage);
  };

  const openModal = (item = null) => {
    setActiveItem(item);
    setModalOpen(true);

    const rawCategory = item?.category || item?.Categories || '';

    reset({
      name: item?.Name || item?.name || '',
      categorySelect: rawCategory || '',
      customCategory: '',
      description: item?.descriptionText || item?.description || '',
      specifications: item?.specs
        ? JSON.stringify(item.specs, null, 2)
        : '',
      heroImage: item?.heroImage || item?.Images?.[0] || '',
      images: Array.isArray(item?.Images)
        ? item.Images.join(', ')
        : item?.Images || '',
      datasheet: item?.datasheet || '',
      contactUrl: item?.contactUrl || ''
    });
  };

  const closeModal = () => {
    setModalOpen(false);
    setActiveItem(null);
  };

  const handleHeroUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setHeroUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setValue('heroImage', url);
    } catch (error) {
      alert(error.message || 'Upload failed');
    } finally {
      setHeroUploading(false);
    }
  };

  const handleGalleryUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    setGalleryUploading(true);

    try {
      const uploaded = [];
      for (const file of files) {
        const url = await uploadToCloudinary(file);
        uploaded.push(url);
      }

      const existing = (getValues('images') || '')
        .split(',')
        .map((e) => e.trim())
        .filter(Boolean);

      setValue('images', [...existing, ...uploaded].join(', '));
    } catch (error) {
      alert(error.message || 'Upload failed');
    } finally {
      setGalleryUploading(false);
    }
  };

  const onSubmit = async (values) => {
    let specsValue = values.specifications;

    try {
      specsValue = JSON.parse(values.specifications);
    } catch {}

    const payload = {
      name: values.name,
      category:
        values.categorySelect === 'custom'
          ? values.customCategory
          : values.categorySelect,
      description: values.description,
      specifications: specsValue,
      images: values.images,
      heroImage: values.heroImage,
      datasheet: values.datasheet,
      contactUrl: values.contactUrl
    };

    if (activeItem?._id) {
      await updateAdminProduct(activeItem._id, payload);
    } else {
      await createAdminProduct(payload);
    }

    closeModal();
    loadData(page);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await deleteAdminProduct(id);
    loadData(page);
  };

  const filteredCategories = useMemo(
    () => categories.filter(Boolean),
    [categories]
  );

  return (
    <div className="p-4">
      <div className="p-6">
        <PageHeader
          title="Products"
          subtitle="Manage product listings and metadata."
        />

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or SKU"
            className="rounded-lg border px-4 py-2 text-sm"
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border px-3 py-2 text-sm"
          >
            <option value="">All Categories</option>
            {filteredCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <button
            onClick={handleFilter}
            className="rounded-lg border px-4 py-2 text-sm"
          >
            Apply
          </button>

          <button
            onClick={() => openModal()}
            className="ml-auto rounded-lg bg-black px-4 py-2 text-sm text-white"
          >
            Add Product
          </button>
        </div>

        {/* Table */}
        <div className="mt-4 rounded-2xl border bg-white p-4">
          {loading ? (
            <p className="text-sm text-gray-500">Loading products...</p>
          ) : (
            <>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase">
                    <th>Name</th>
                    <th>Category</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((item) => (
                    <tr key={item._id} className="border-b">
                      <td>{item.name || item.Name}</td>
                      <td>{item.category || item.Categories}</td>
                      <td>
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString()
                          : '--'}
                      </td>
                      <td className="flex gap-2">
                        <button onClick={() => openModal(item)}>Edit</button>
                        <button onClick={() => handleDelete(item._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

             {/* Pagination */}
{totalPages > 1 && (
  <div className="mt-6 flex items-center justify-center gap-2">
    {Array.from({ length: totalPages }).map((_, index) => {
      const pageNumber = index + 1;

      return (
        <button
          key={pageNumber}
          onClick={() => {
            setPage(pageNumber);
            loadData(pageNumber);
          }}
          className={`h-9 min-w-9 rounded-lg border px-3 text-sm font-semibold transition
            ${
              pageNumber === page
                ? 'bg-red-500 text-white border-red-500'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
        >
          {pageNumber}
        </button>
      );
    })}
  </div>
)}
            </>
          )}
        </div>

        {/* Modal stays unchanged */}
        <Modal
          open={modalOpen}
          title={activeItem ? 'Edit Product' : 'Add Product'}
          onClose={closeModal}
          footer={
            <div className="flex justify-end gap-3">
              <button onClick={closeModal}>Cancel</button>
              <button onClick={handleSubmit(onSubmit)}>Save</button>
            </div>
          }
        >
          {/* form unchanged (your original) */}
           <form className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-slate-600">
            Name
            <input
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
              {...register('name', { required: true })}
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

          {watchCategorySelect === 'custom' && (
            <label className="text-sm text-slate-600 md:col-span-2">
              Custom Category
              <input
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
                placeholder="Type a category"
                {...register('customCategory', { required: true })}
              />
            </label>
          )}

          <label className="md:col-span-2 text-sm text-slate-600">
            Description
            <textarea
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
              rows={3}
              {...register('description')}
            />
          </label>

          <label className="md:col-span-2 text-sm text-slate-600">
            Specifications (JSON)
            <textarea
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
              rows={4}
              {...register('specifications')}
            />
          </label>

          <div className="md:col-span-2 grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
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
                {heroUploading && <span className="text-xs text-slate-500">Uploading...</span>}
              </div>
            </div>
            {watch('heroImage') ? (
              <div className="rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-500">
                Preview:
                <img
                  src={watch('heroImage')}
                  alt="Hero"
                  className="mt-2 h-28 w-40 rounded-lg object-cover"
                />
              </div>
            ) : null}
          </div>

          <div className="md:col-span-2 grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-sm text-slate-600">
                  Gallery Images (comma separated URLs)
                  <input
                    className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
                    placeholder="https://img1 https://img2"
                    {...register('images')}
                  />
                </label>
              </div>
              <div className="flex flex-col items-start gap-2">
                <input type="file" multiple accept="image/*" onChange={handleGalleryUpload} />
                {galleryUploading && <span className="text-xs text-slate-500">Uploading gallery...</span>}
              </div>
            </div>
          </div>

          <label className="md:col-span-2 text-sm text-slate-600">
            Datasheet URL
            <input
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
              {...register('datasheet')}
            />
          </label>

          <label className="md:col-span-2 text-sm text-slate-600">
            Contact / CTA URL
            <input
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
              {...register('contactUrl')}
            />
          </label>
        </form>
        </Modal>
      </div>
    </div>
  );
};

export default ProductsPage;