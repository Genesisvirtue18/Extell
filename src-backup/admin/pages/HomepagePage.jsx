import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import PageHeader from '../components/PageHeader';
import { fetchHomePage, updateHomePage } from '../services/api';

const HomepagePage = () => {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const response = await fetchHomePage();
      const item = response.item || {};
      reset({
        heroTitle: item.heroTitle || '',
        heroSubtitle: item.heroSubtitle || '',
        heroImage: item.heroImage || '',
        highlightCards: item.highlightCards ? JSON.stringify(item.highlightCards, null, 2) : '[]',
        testimonials: item.testimonials ? JSON.stringify(item.testimonials, null, 2) : '[]',
        partnerLogos: item.partnerLogos ? JSON.stringify(item.partnerLogos, null, 2) : '[]'
      });
      setLoading(false);
    };
    loadData();
  }, [reset]);

  const onSubmit = async (values) => {
    setStatus('');
    const payload = {
      heroTitle: values.heroTitle,
      heroSubtitle: values.heroSubtitle,
      heroImage: values.heroImage
    };

    try {
      payload.highlightCards = JSON.parse(values.highlightCards || '[]');
      payload.testimonials = JSON.parse(values.testimonials || '[]');
      payload.partnerLogos = JSON.parse(values.partnerLogos || '[]');
    } catch (error) {
      setStatus('Please provide valid JSON for the list fields.');
      return;
    }

    await updateHomePage(payload);
    setStatus('Homepage content updated.');
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Homepage" subtitle="Update hero copy, highlight cards, and partners." />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {loading ? (
          <p className="text-sm text-slate-500">Loading homepage content...</p>
        ) : (
          <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <label className="text-sm text-slate-600">
              Hero Title
              <input className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" {...register('heroTitle')} />
            </label>
            <label className="text-sm text-slate-600">
              Hero Subtitle
              <input className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" {...register('heroSubtitle')} />
            </label>
            <label className="text-sm text-slate-600">
              Hero Image URL
              <input className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" {...register('heroImage')} />
            </label>
            <label className="text-sm text-slate-600">
              Highlight Cards (JSON Array)
              <textarea className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" rows="4" {...register('highlightCards')} />
            </label>
            <label className="text-sm text-slate-600">
              Testimonials (JSON Array)
              <textarea className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" rows="4" {...register('testimonials')} />
            </label>
            <label className="text-sm text-slate-600">
              Partner Logos (JSON Array of URLs)
              <textarea className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" rows="3" {...register('partnerLogos')} />
            </label>
            {status ? <p className="text-sm text-emerald-600">{status}</p> : null}
            <div>
              <button type="submit" className="rounded-lg bg-red-900 px-4 py-2 text-sm font-semibold text-white">
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default HomepagePage;
