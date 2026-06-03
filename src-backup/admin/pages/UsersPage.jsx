import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import { fetchAdminUsers, createAdminUser } from '../services/api';
import { formatDate } from '../utils/date';

const UsersPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  const loadData = async () => {
    setLoading(true);
    const response = await fetchAdminUsers();
    setItems(response.items || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openModal = () => {
    reset({ name: '', email: '', password: '', role: 'admin' });
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const onSubmit = async (values) => {
    await createAdminUser(values);
    closeModal();
    loadData();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        subtitle="Create and view admin accounts."
        actions={
          <button
            onClick={openModal}
            className="rounded-lg bg-red-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Add User
          </button>
        }
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {loading ? (
          <p className="text-sm text-slate-500">Loading users...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Created</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id} className="border-b last:border-0">
                    <td className="py-3 font-medium text-slate-800">{item.name}</td>
                    <td className="py-3 text-slate-600">{item.email}</td>
                    <td className="py-3 text-slate-600">{item.role || 'admin'}</td>
                    <td className="py-3 text-slate-500">{formatDate(item.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        title="Create User"
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
        <form className="grid gap-4">
          <label className="text-sm text-slate-600">
            Name
            <input className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" {...register('name', { required: true })} />
          </label>
          <label className="text-sm text-slate-600">
            Email
            <input className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" type="email" {...register('email', { required: true })} />
          </label>
          <label className="text-sm text-slate-600">
            Password
            <input className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" type="password" {...register('password', { required: true })} />
          </label>
          <label className="text-sm text-slate-600">
            Role
            <select className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" {...register('role')}>
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
            </select>
          </label>
        </form>
      </Modal>
    </div>
  );
};

export default UsersPage;
