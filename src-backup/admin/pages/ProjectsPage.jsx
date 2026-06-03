import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import { fetchProjects, createProject, updateProject, deleteProject } from '../services/api';
import { formatDate } from '../utils/date';

const ProjectsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [search, setSearch] = useState('');

  const { register, handleSubmit, reset } = useForm();

  const loadData = async () => {
    setLoading(true);
    const response = await fetchProjects();
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
      client: item?.client || '',
      industry: item?.industry || '',
      location: item?.location || '',
      description: item?.description || '',
      technologies: item?.technologies?.join(', ') || '',
      images: item?.images?.join(', ') || '',
      completionDate: item?.completionDate ? item.completionDate.split('T')[0] : ''
    });
  };

  const closeModal = () => {
    setModalOpen(false);
    setActiveItem(null);
  };

  const onSubmit = async (values) => {
    const payload = {
      title: values.title,
      client: values.client,
      industry: values.industry,
      location: values.location,
      description: values.description,
      technologies: values.technologies
        ? values.technologies.split(',').map((item) => item.trim()).filter(Boolean)
        : [],
      images: values.images
        ? values.images.split(',').map((item) => item.trim()).filter(Boolean)
        : [],
      completionDate: values.completionDate || null
    };

    if (activeItem?._id) {
      await updateProject(activeItem._id, payload);
    } else {
      await createProject(payload);
    }

    closeModal();
    loadData();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    await deleteProject(id);
    loadData();
  };

  const filteredItems = items.filter((item) =>
    item.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        subtitle="Showcase case studies and deployments."
        actions={
          <button
            onClick={() => openModal()}
            className="rounded-lg bg-red-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Add Project
          </button>
        }
      />

      <div className="flex items-center gap-3">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search projects"
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm"
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {loading ? (
          <p className="text-sm text-slate-500">Loading projects...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="pb-3">Title</th>
                  <th className="pb-3">Client</th>
                  <th className="pb-3">Completion</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item._id} className="border-b last:border-0">
                    <td className="py-3 font-medium text-slate-800">{item.title}</td>
                    <td className="py-3 text-slate-600">{item.client || '�'}</td>
                    <td className="py-3 text-slate-500">{formatDate(item.completionDate)}</td>
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
        title={activeItem ? 'Edit Project' : 'Add Project'}
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
          <label className="text-sm text-slate-600">
            Client
            <input className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" {...register('client')} />
          </label>
          <label className="text-sm text-slate-600">
            Industry
            <input className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" {...register('industry')} />
          </label>
          <label className="text-sm text-slate-600">
            Location
            <input className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" {...register('location')} />
          </label>
          <label className="md:col-span-2 text-sm text-slate-600">
            Description
            <textarea className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" rows="3" {...register('description')} />
          </label>
          <label className="md:col-span-2 text-sm text-slate-600">
            Technologies (comma separated)
            <input className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" {...register('technologies')} />
          </label>
          <label className="md:col-span-2 text-sm text-slate-600">
            Images (comma separated URLs)
            <input className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" {...register('images')} />
          </label>
          <label className="md:col-span-2 text-sm text-slate-600">
            Completion Date
            <input type="date" className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" {...register('completionDate')} />
          </label>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectsPage;
