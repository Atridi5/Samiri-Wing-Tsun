"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { MessageCircle, X, Send, Bot } from "lucide-react";

type Faq = { id: string; question: string; answer: string };
type ChatMessage = { role: "user" | "bot"; text: string };

const DIACRITICS: Record<string, string> = {
  ë: "e",
  ç: "c",
  ä: "a",
  ö: "o",
  ü: "u",
  ß: "ss",
};

function normalize(text: string) {
  return text
    .toLowerCase()
    .split("")
    .map((ch) => DIACRITICS[ch] ?? ch)
    .join("");
}

function findBestMatch(query: string, faqs: Faq[]): Faq | null {
  const q = normalize(query);
  const queryWords = q.split(/\s+/).filter((w) => w.length > 2);
  if (queryWords.length === 0) return null;

  let best: Faq | null = null;
  let bestScore = 0;

  for (const faq of faqs) {
    const haystack = normalize(`${faq.question} ${faq.answer}`);
    let score = 0;
    for (const word of queryWords) {
      if (haystack.includes(word)) score += 1;
    }
    if (normalize(faq.question).includes(q)) score += 3;
    if (score > bestScore) {
      bestScore = score;
      best = faq;
    }
  }

  return bestScore > 0 ? best : null;
}

export default function ChatAssistant() {
  const locale = useLocale();
  const t = useTranslations("chat");
  const [open, setOpen] = useState(false);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/faq?locale=${locale}`)
      .then((r) => r.json())
      .then(setFaqs)
      .catch(() => setFaqs([]));
  }, [locale]);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: "bot", text: t("greeting") }]);
    }
  }, [open, messages.length, t]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  function sendMessage(text: string) {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");

    const match = findBestMatch(text, faqs);
    const reply = match ? match.answer : t("fallback");

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "bot", text: reply }]);
    }, 350);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={t("openLabel")}
        className="fixed bottom-6 left-6 z-[150] flex h-14 w-14 items-center justify-center rounded-full bg-navy-900 text-gold-400 shadow-xl shadow-black/20 transition-transform hover:scale-110"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 left-6 z-[150] flex h-[28rem] w-[22rem] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-navy-900/10">
          <div className="flex items-center gap-2.5 bg-navy-900 px-4 py-3.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-500/15 text-gold-400">
              <Bot className="h-4.5 w-4.5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-cream-50">{t("title")}</p>
              <p className="text-[11px] text-cream-100/60">{t("subtitle")}</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-4 py-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <p
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm ${
                    m.role === "user"
                      ? "rounded-br-sm bg-navy-900 text-cream-50"
                      : "rounded-bl-sm bg-white text-slate-700 shadow-sm ring-1 ring-slate-100"
                  }`}
                >
                  {m.text}
                </p>
              </div>
            ))}

            {messages.length <= 1 && faqs.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {faqs.slice(0, 4).map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => sendMessage(f.question)}
                    className="rounded-full border border-navy-900/15 bg-white px-3 py-1.5 text-xs font-medium text-navy-800 transition-colors hover:border-gold-500 hover:text-gold-600"
                  >
                    {f.question}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex items-center gap-2 border-t border-slate-100 bg-white p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("placeholder")}
              className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm outline-none focus:border-gold-500"
            />
            <button
              type="submit"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-500 text-navy-950 transition-transform hover:scale-105"
              aria-label={t("sendLabel")}
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
