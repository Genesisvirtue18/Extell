import {
  BookOpen,
  CircleHelp,
  Download,
  FileText,
  Headphones,
  Mail,
  Phone,
  Send,
  ShieldCheck,
  Upload,
  Ticket
} from 'lucide-react';

function SupportPage() {
  const supportCards = [
    {
      icon: <Headphones size={16} />,
      title: 'Technical Support',
      text: 'Troubleshoot power systems and ICT hardware. Get expert assistance for your critical infrastructure.',
      cta: 'Get Support'
    },
    {
      icon: <ShieldCheck size={16} />,
      title: 'RMA & Warranty',
      text: 'Start a return process or check your current warranty status for all Extell products.',
      cta: 'Start RMA'
    },
    {
      icon: <BookOpen size={16} />,
      title: 'Product Training',
      text: 'Access webinars, certification courses, and technical documentation for your team.',
      cta: 'View Courses'
    }
  ];

  const faqs = ['Where is my order?', 'Voltage compatibility?', 'How to update firmware?'];

  return (
    <section className="support-shell m-6 overflow-hidden rounded-md border border-white/10">
      <div className="support-hero">
        <h1>How can we help you today?</h1>
        <p>Search our knowledge base for manuals, error codes, or technical articles.</p>
        <div className="support-search">
          <input type="text" placeholder="Search support resources (e.g., Error 404, Inverter Manual)" />
          <button type="button">Search</button>
        </div>
        <div className="support-links">
          <a href="#">Popular:</a>
          <a href="#">RMA Process</a>
          <a href="#">Firmware v2.4</a>
          <a href="#">Warranty Check</a>
        </div>
      </div>

      <div className="support-cards">
        {supportCards.map((item) => (
          <article key={item.title}>
            <span>{item.icon}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
            <button type="button">{item.cta} &gt;</button>
          </article>
        ))}
      </div>

      <div className="support-main">
        <div className="support-ticket">
          <h2>Submit a Ticket</h2>
          <p>Our engineering team will respond within 24 hours.</p>
          <form>
            <div className="support-field-grid">
              <label>
                <span>Work Email</span>
                <input type="email" placeholder="name@company.com" />
              </label>
              <label>
                <span>Serial Number (Optional)</span>
                <input type="text" placeholder="SN-12345678" />
              </label>
              <label>
                <span>Product Category</span>
                <select defaultValue="">
                  <option value="" disabled>
                    Select a category...
                  </option>
                  <option>UPS Systems</option>
                  <option>Power Electronics</option>
                  <option>Networking Products</option>
                </select>
              </label>
              <label>
                <span>Priority Level</span>
                <select defaultValue="normal">
                  <option value="normal">Normal (Non-Critical)</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </label>
            </div>

            <label className="support-field-full">
              <span>Issue Description</span>
              <textarea rows={4} placeholder="Please describe the issue in detail..." />
            </label>

            <label className="support-field-full">
              <span>Attachments</span>
              <div className="support-drop">
                <Upload size={16} />
                <p>Click to upload or drag and drop</p>
                <small>SVG, PNG, JPG or PDF (MAX. 10MB)</small>
              </div>
            </label>

            <button type="button" className="support-submit">
              <Send size={14} />
              Submit Ticket
            </button>
          </form>
        </div>

        <aside className="support-side">
          <div className="support-downloads">
            <div className="support-download-top">
              <Download size={15} />
              <h3>Downloads Center</h3>
            </div>
            <p>Access the latest drivers, datasheets, and user manuals for your specific hardware.</p>
            <button type="button">Go to Downloads</button>
          </div>

          <div className="support-grade">
            <ShieldCheck size={15} />
            <div>
              <h4>Enterprise Grade Support</h4>
              <p>24/7 Global Support Team - ISO 9001</p>
            </div>
          </div>

          <div className="support-faq">
            <h3>Common Questions</h3>
            {faqs.map((faq) => (
              <button key={faq} type="button">
                <span>{faq}</span>
                <CircleHelp size={14} />
              </button>
            ))}
          </div>
        </aside>
      </div>

      <footer className="support-footer">
        <h3>Still need help?</h3>
        <p>Our dedicated support engineers are available Monday through Friday, 8am - 8pm EST.</p>
        <div>
          <a href="tel:+18005550196">
            <Phone size={14} />
            +1 (800) 555-0196
          </a>
          <a href="mailto:support@extell.com">
            <Mail size={14} />
            support@extell.com
          </a>
          <a href="#">
            <Ticket size={14} />
            Track Ticket
          </a>
          <a href="#">
            <FileText size={14} />
            Status Page
          </a>
        </div>
      </footer>
    </section>
  );
}

export default SupportPage;

