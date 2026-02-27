import { Download } from 'lucide-react';
import PageHero from '../components/ui/PageHero';

function DownloadsPage() {
  const files = ['Corporate Product Catalog 2026.pdf', 'UPS Selection Guide.pdf', 'Fiber Deployment Handbook.pdf', 'Data Center Infrastructure Brochure.pdf'];

  return (
    <>
      <PageHero title="Downloads" description="Centralized technical resources, datasheets, and catalog material." />
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-4">
          {files.map((file) => (
            <div key={file} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-5">
              <span className="text-sm text-neutral-100">{file}</span>
              <button className="inline-flex items-center gap-2 rounded-md bg-[#111111] px-4 py-2 text-xs font-semibold text-white">
                <Download size={15} /> Download
              </button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default DownloadsPage;
