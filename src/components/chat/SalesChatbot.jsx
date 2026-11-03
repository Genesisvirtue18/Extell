'use client';

import { useEffect, useRef, useState } from 'react';
import { Bot, LoaderCircle, Mail, MessageCircle, Send, UserRound, X } from 'lucide-react';
import { getProducts, submitChatbotLead } from '@/lib/api';
import { answerSalesQuestion, prepareProductKnowledge } from '@/lib/salesAssistant';

const STORAGE_KEY = 'extell-sales-chat-lead-v1';
const GREETING = 'Hi! I can help you explore ExTell products, compare published specifications, and send a presales question to the team.';
const QUICK_QUESTIONS = [
  'How can I buy a product?',
  'How do I request a quote?',
  'What is the warranty?',
  'Do you ship internationally?'
];

const readStoredLead = () => {
  try {
    const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null');
    return value?.name && value?.email ? value : null;
  } catch {
    return null;
  }
};

export default function SalesChatbot() {
  const [open, setOpen] = useState(false);
  const [lead, setLead] = useState(null);
  const [leadForm, setLeadForm] = useState({ name: '', email: '' });
  const [messages, setMessages] = useState([{ role: 'assistant', text: GREETING }]);
  const [input, setInput] = useState('');
  const [knowledge, setKnowledge] = useState([]);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [catalogLoaded, setCatalogLoaded] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    const storedLead = readStoredLead();
    if (storedLead) {
      setLead(storedLead);
      setLeadSubmitted(Boolean(storedLead.leadSubmitted));
      setMessages([{ role: 'assistant', text: `Welcome back, ${storedLead.name.split(' ')[0]}. What can I help you with?` }]);
    }
    setKnowledge(prepareProductKnowledge(null));
  }, []);

  useEffect(() => {
    if (!open || catalogLoaded) return;
    let active = true;
    setLoadingCatalog(true);
    getProducts({ limit: 500 })
      .then((response) => {
        if (active) {
          setKnowledge(prepareProductKnowledge(response));
          setCatalogLoaded(true);
        }
      })
      .catch(() => {
        if (active) {
          setKnowledge(prepareProductKnowledge(null));
          setCatalogLoaded(true);
        }
      })
      .finally(() => {
        if (active) setLoadingCatalog(false);
      });
    return () => { active = false; };
  }, [open, catalogLoaded]);

  useEffect(() => {
    if (open && listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, open]);

  useEffect(() => {
    if (!open) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [open]);

  const handleLeadSubmit = (event) => {
    event.preventDefault();
    const name = leadForm.name.trim();
    const email = leadForm.email.trim().toLowerCase();
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;

    const savedLead = { name, email, leadSubmitted: false };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedLead));
    setLead(savedLead);
    setMessages([{ role: 'assistant', text: `Thanks, ${name.split(' ')[0]}. What product or solution can I help you with?` }]);
  };

  const handleQuestion = async (rawQuestion) => {
    const question = rawQuestion.trim();
    if (!question || !lead || sending) return;

    setInput('');
    setMessages((current) => [...current, { role: 'user', text: question }]);
    setSending(true);

    let answer;
    try {
      answer = answerSalesQuestion(question, knowledge);
    } catch (error) {
      console.error('Unable to generate chatbot answer:', error);
      answer = {
        text: 'I could not prepare an answer from the product information right now. Your question will still be sent to the ExTell sales team.',
        source: 'ExTell sales assistant',
        products: []
      };
    }
    setMessages((current) => [...current, { role: 'assistant', ...answer }]);
    setSending(false);

    try {
      await submitChatbotLead({
        fullName: lead.name,
        email: lead.email,
        question,
        answer: answer.text,
      });
      if (!leadSubmitted) {
        const submittedLead = { ...lead, leadSubmitted: true };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(submittedLead));
        setLead(submittedLead);
        setLeadSubmitted(true);
      }
    } catch (error) {
      console.error('Unable to save chatbot lead:', error);
    }
  };

  const handleSend = (event) => {
    event.preventDefault();
    handleQuestion(input);
  };

  return (
    <>
      {open ? <button type="button" aria-label="Close chat" onClick={() => setOpen(false)} className="fixed inset-0 z-[119] cursor-default bg-black/10" /> : null}
      <div className="fixed bottom-4 right-4 z-[120] font-sans">
      {open ? (
        <section aria-label="ExTell presales assistant" className="flex h-[min(680px,calc(100dvh-2rem))] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
          <header className="flex shrink-0 items-center justify-between bg-slate-950 px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-600"><Bot size={22} /></span>
              <div>
                <h2 className="text-sm font-semibold">ExTell sales assistant</h2>
                <p className="mt-0.5 text-xs text-slate-300">Product guidance and presales</p>
              </div>
            </div>
            <button type="button" aria-label="Close chat" title="Close chat" onClick={() => setOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/70"><X size={21} strokeWidth={2.5} /></button>
          </header>

          {!lead ? (
            <form onSubmit={handleLeadSubmit} className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-6">
              <div>
                <p className="text-xs font-semibold tracking-wide text-red-600">Before we begin</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-950">How should we address you?</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">Share your name and email, then ask about products, specifications, or pricing.</p>
              </div>
              <label className="text-sm font-medium text-slate-700">Name
                <input required autoComplete="name" value={leadForm.name} onChange={(event) => setLeadForm((value) => ({ ...value, name: event.target.value }))} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100" placeholder="Your name" />
              </label>
              <label className="text-sm font-medium text-slate-700">Work email
                <input required type="email" autoComplete="email" value={leadForm.email} onChange={(event) => setLeadForm((value) => ({ ...value, email: event.target.value }))} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100" placeholder="you@company.com" />
              </label>
              <p className="text-xs leading-relaxed text-slate-500">We’ll save these details in this browser. Your questions will be recorded with your contact details so the ExTell sales team can follow up.</p>
              <button type="submit" className="rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700">Start a conversation</button>
            </form>
          ) : (
            <>
              <div ref={listRef} aria-live="polite" className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4">
                {messages.map((message, index) => (
                  <div key={`${message.role}-${index}`} className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {message.role === 'assistant' ? <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-700"><Bot size={15} /></span> : null}
                    <div className={`max-w-[85%] rounded-2xl px-3.5 py-3 text-sm leading-relaxed ${message.role === 'user' ? 'rounded-br-md bg-red-600 text-white' : 'rounded-bl-md border border-slate-200 bg-white text-slate-800 shadow-sm'}`}>
                      <p>{message.text}</p>
                      {message.source ? <p className="mt-2 text-[11px] font-medium text-slate-400">Source: {message.source}</p> : null}
                      {message.products?.length ? (
                        <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-2">
                          {message.products.map((product) => <a key={product.href} href={product.href} className="block text-xs font-semibold text-red-700 hover:underline">{product.name}{product.sku ? ` · ${product.sku}` : ''} →</a>)}
                        </div>
                      ) : null}
                    </div>
                    {message.role === 'user' ? <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700"><UserRound size={15} /></span> : null}
                  </div>
                ))}
                {!messages.some((message) => message.role === 'user') ? (
                  <div className="flex flex-wrap gap-2 pl-9">
                    {QUICK_QUESTIONS.map((question) => (
                      <button key={question} type="button" disabled={sending} onClick={() => handleQuestion(question)} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-left text-xs font-medium text-slate-700 transition hover:border-red-300 hover:text-red-700 disabled:opacity-50">
                        {question}
                      </button>
                    ))}
                  </div>
                ) : null}
                {sending ? <div className="flex items-center gap-2 text-xs text-slate-500"><LoaderCircle size={14} className="animate-spin" /> Looking through product information…</div> : null}
                {loadingCatalog ? <p className="text-center text-[11px] text-slate-400">Refreshing product catalog…</p> : null}
              </div>
              <form onSubmit={handleSend} className="flex items-end gap-2 border-t border-slate-200 bg-white p-3">
                <label className="sr-only" htmlFor="sales-chat-input">Ask a product question</label>
                <textarea id="sales-chat-input" rows={1} value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} placeholder="Ask about a product…" className="max-h-28 min-h-11 flex-1 resize-y rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100" />
                <button type="submit" disabled={!input.trim() || sending} aria-label="Send question" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"><Send size={17} /></button>
              </form>
              <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-white px-4 py-3">
                <p className="flex items-center gap-1.5 text-[10px] text-slate-400"><Mail size={11} /> Need a personal response?</p>
                <a href="/contact" className="shrink-0 text-xs font-semibold text-red-700 hover:underline">Talk to sales →</a>
              </div>
            </>
          )}
        </section>
      ) : (
        <button type="button" onClick={() => setOpen(true)} className="relative flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-xl shadow-red-900/30 ring-4 ring-white transition hover:-translate-y-0.5 hover:bg-red-700" aria-label="Open product chat" title="Ask a product question">
          <MessageCircle size={25} strokeWidth={2.25} />
          <span className="absolute right-0 top-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" aria-hidden="true" />
        </button>
      )}
      </div>
    </>
  );
}
