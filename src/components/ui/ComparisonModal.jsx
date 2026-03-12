import { X } from 'lucide-react';

function ComparisonModal({ items, open, onClose }) {
  if (!open) return null;

  return (
    <div className="ui-modal-backdrop fixed inset-0 z-[60] grid place-items-center p-4">
      <div className="ui-surface-1 w-full max-w-3xl rounded-xl p-6 ui-text">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold">Product Comparison (UI Only)</h3>
          <button onClick={onClose} aria-label="Close" className="rounded-md p-1 ui-hover-surface"><X size={20} /></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2">Product</th>
                <th className="py-2">Key Specs</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b align-top">
                  <td className="py-3 font-semibold">{item.name}</td>
                  <td className="py-3">
                    {Object.entries(item.specs).map(([key, value]) => (
                      <p key={key}><span className="font-semibold">{key}:</span> {value}</p>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ComparisonModal;
