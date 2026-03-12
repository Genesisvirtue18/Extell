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
            <div key={file} className="ui-surface-1 flex items-center justify-between rounded-lg p-5">
              <span className="text-sm ui-text">{file}</span>
              <button className="ui-surface-1 ui-text inline-flex items-center gap-2 rounded-md px-4 py-2 text-xs font-semibold">
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
