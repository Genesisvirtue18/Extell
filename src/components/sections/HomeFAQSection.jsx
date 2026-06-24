'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const RED = '#ed2125';

const FAQS = [
  {
    q: 'What are the solution offerings from ExTell?',
    a: 'ExTell’s solution offerings include Passive Structured Cabling systems, UPS and Power Backup solutions, Active Networking Solutions, Power Distribution units, Control Cables etc. Kindly reach to our team to know more.',
  },
  {
    q: 'Does ExTell Systems provide UPS systems for data centers?',
    a: 'Yes. ExTell Systems provides modular UPS, industrial UPS, and online double-conversion UPS systems designed for data centers, telecom networks, banking infrastructure, and industrial environments ranging from 1kVA to 800kVA.',
  },
  {
    q: 'How do I get a price quote from ExTell Systems?',
    a: 'Request a quote by visiting extellsystems.com/contact, using the "Get a Quote" form on any product page, or emailing sales@extellsystems.com. Our team typically responds within 2 business hours.',
  },
  {
    q: 'Does ExTell Systems ship internationally?',
    a: 'Yes. ExTell Systems ships enterprise products to customers across 20+ countries including India, UAE, Bahrain, Saudi Arabia, Kuwait, Oman, and the United States. Contact sales@extellsystems.com for shipping terms.',
  },
  {
    q: 'What industries does ExTell Systems serve?',
    a: 'ExTell Systems serves telecom operators, data centers, banking and finance, healthcare, government, manufacturing, oil and gas, and utilities sectors across South Asia, the Middle East, and North America.',
  },
  {
    q: 'What is the warranty on ExTell Systems products?',
    a: 'Warranty periods vary by product line. Most products carry a 1–2 year manufacturer warranty. Register your product at extellsystems.com/warranty or contact support@extellsystems.com for product-specific terms.',
  },
  {
    q: 'How do I become an ExTell Systems distributor or partner?',
    a: 'To enroll as an ExTell partner or distributor, email sales@extellsystems.com or visit extellsystems.com/partner. ExTell has active partner programs in over 20 countries with product training and dedicated support.',
  },
];

export default function HomeFAQSection() {
  const [open, setOpen] = useState(null);

  return (
    <section className="ui-section py-16">
      <div className="mx-auto max-w-4xl px-6">

        <h2 style={{ fontSize: 'clamp(1.3rem, 3vw, 1.85rem)', fontWeight: 700, marginBottom: '0.4rem' }}>
          Frequently asked questions
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--ui-text-muted)', marginBottom: '2rem' }}>
          Everything you need to know about ExTell Systems products and services.
        </p>

        <div style={{ borderTop: '1px solid var(--ui-border-subtle)' }}>
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                style={{ borderBottom: '1px solid var(--ui-border-subtle)' }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem 0',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: 'var(--ui-text)',
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      border: `2px solid ${isOpen ? RED : 'var(--ui-border-subtle)'}`,
                      background: isOpen ? RED : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}
                  >
                    <ChevronDown
                      size={13}
                      style={{
                        color: isOpen ? '#fff' : 'var(--ui-text-muted)',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform 0.2s',
                      }}
                    />
                  </span>
                  <span style={{ fontSize: '0.92rem', fontWeight: 500, flex: 1 }}>
                    {faq.q}
                  </span>
                </button>

                {isOpen && (
                  <div
                    style={{
                      paddingLeft: '2.5rem',
                      paddingBottom: '1rem',
                      fontSize: '0.88rem',
                      lineHeight: 1.75,
                      color: 'var(--ui-text-muted)',
                    }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
