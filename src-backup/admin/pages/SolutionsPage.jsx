import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import { fetchSolutions, createSolution, updateSolution, deleteSolution } from '../services/api';

const SolutionsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [search, setSearch] = useState('');

  const { register, handleSubmit, reset } = useForm();

  const loadData = async () => {
    setLoading(true);
    const response = await fetchSolutions();
    setItems(response.items || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openModal = (item = null) => {
    setActiveItem(item);
    setModalOpen(true);
    reset({
      title: item?.title || '',
      description: item?.description || '',
      image: item?.image || '',
      industries: item?.industries?.join(', ') || ''
    });
  };

  const closeModal = () => {
    setModalOpen(false);
    setActiveItem(null);
  };

  const onSubmit = async (values) => {
    const payload = {
      title: values.title,
      description: values.description,
      image: values.image,
      industries: values.industries
        ? values.industries.split(',').map((item) => item.trim()).filter(Boolean)
        : []
    };

    if (activeItem?._id) {
      await updateSolution(activeItem._id, payload);
    } else {
      await createSolution(payload);
    }

    closeModal();
    loadData();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this solution?')) return;
    await deleteSolution(id);
    loadData();
  };

  const filteredItems = items.filter((item) =>
    item.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Solutions"
        subtitle="Manage industry solutions and applications."
        actions={
          <button
            onClick={() => openModal()}
            className="rounded-lg bg-red-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Add Solution
          </button>
        }
      />

      <div className="flex items-center gap-3">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search solutions"
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm"
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {loading ? (
          <p className="text-sm text-slate-500">Loading solutions...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="pb-3">Title</th>
                  <th className="pb-3">Industries</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item._id} className="border-b last:border-0">
                    <td className="py-3 font-medium text-slate-800">{item.title}</td>
                    <td className="py-3 text-slate-600">{item.industries?.join(', ') || '�'}</td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openModal(item)}
                          className="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="rounded-md border border-red-200 px-3 py-1 text-xs font-semibold text-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        title={activeItem ? 'Edit Solution' : 'Add Solution'}
        onClose={closeModal}
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={closeModal} className="rounded-lg border border-slate-200 px-4 py-2 text-sm">
              Cancel
            </button>
            <button
              onClick={handleSubmit(onSubmit)}
              className="rounded-lg bg-red-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Save
            </button>
          </div>
        }
      >
        <form className="grid gap-4 md:grid-cols-2">
          <label className="md:col-span-2 text-sm text-slate-600">
            Title
            <input className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" {...register('title')} />
          </label>
          <label className="md:col-span-2 text-sm text-slate-600">
            Description
            <textarea className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" rows="3" {...register('description')} />
          </label>
          <label className="md:col-span-2 text-sm text-slate-600">
            Image URL
            <input className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" {...register('image')} />
          </label>
          <label className="md:col-span-2 text-sm text-slate-600">
            Industries (comma separated)
            <input className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" {...register('industries')} />
          </label>
        </form>
      </Modal>
    </div>
  );
};

export default SolutionsPage;
