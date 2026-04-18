/**
 * AIReading.jsx — Combined Myanmar Astrology AI Reading
 * Calls Azure AI Foundry and renders a Burmese-language 5-section narrative.
 */

import { useState, useRef } from 'react';
import { buildMyanmarAIPrompt } from '../engine/prompt.js';
import { C, F } from '../theme.js';

// Alias theme tokens used in this component
const accent  = C.primary;
const muted   = C.textSoft;
const heading = C.text;
const card    = C.bgCard;
const bodyF   = F.sans;
const headF   = F.serif;

// ─── Azure AI Foundry call ───────────────────────────────────────────────────

async function callAI(prompt, signal) {
  const endpoint = import.meta.env.VITE_FOUNDRY_ENDPOINT?.replace(/\/$/, '');
  const key      = import.meta.env.VITE_FOUNDRY_KEY;
  const model    = import.meta.env.VITE_FOUNDRY_MODEL || 'gpt-4o';

  if (!endpoint || !key) {
    throw new Error('VITE_FOUNDRY_ENDPOINT နှင့် VITE_FOUNDRY_KEY ကို .env ဖိုင်တွင် သတ်မှတ်ပါ။');
  }

  const url = `${endpoint}/openai/deployments/${model}/chat/completions?api-version=2024-08-01-preview`;

  const res = await fetch(url, {
    method:  'POST',
    signal,
    headers: { 'Content-Type': 'application/json', 'api-key': key },
    body: JSON.stringify({
      messages:    [{ role: 'user', content: prompt }],
      temperature: 0.75,
      max_completion_tokens: 4096,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err?.error?.message || err?.message || `HTTP ${res.status}`);
  }

  const data = await res.json();
  console.log('[AIReading] raw response:', JSON.stringify(data, null, 2));

  // Chat Completions format: choices[0].message.content (string or array)
  const msg = data.choices?.[0]?.message?.content;
  if (typeof msg === 'string' && msg.trim()) return msg;
  if (Array.isArray(msg)) {
    const joined = msg.map(p => p.text ?? p.value ?? '').join('').trim();
    if (joined) return joined;
  }

  // Responses API format (newer Azure models): output[0].content[0].text
  const outputText = data.output?.[0]?.content?.[0]?.text;
  if (outputText) return outputText;

  // Last resort: stringify the full response for debugging
  throw new Error(`[DEBUG] မမျှော်လင့်သော response ပုံစံ:\n${JSON.stringify(data).slice(0, 400)}`);
}

// ─── Simple Markdown renderer (bold, headers, bullets) ───────────────────────

function MyanmarReading({ text }) {
  const lines = text.split('\n');
  return (
    <div style={{ lineHeight: '1.85', fontSize: '1.025rem' }}>
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} style={{ height: '0.6em' }} />;

        // bold headers **text**
        if (/^\*\*(.*)\*\*$/.test(line.trim())) {
          const content = line.trim().replace(/^\*\*|\*\*$/g, '');
          return (
            <p key={i} style={{ fontWeight: 700, color: accent, margin: '1.1em 0 0.3em' }}>
              {content}
            </p>
          );
        }

        // horizontal rule
        if (/^---+$/.test(line.trim())) return <hr key={i} style={{ border: 'none', borderTop: `1px solid ${C.border}`, margin: '0.8em 0' }} />;

        // bullet
        if (/^[-•]/.test(line.trim())) {
          const content = renderInline(line.replace(/^[-•]\s*/, ''));
          return (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
              <span style={{ color: accent, flexShrink: 0 }}>•</span>
              <span>{content}</span>
            </div>
          );
        }

        return <p key={i} style={{ margin: '0.2em 0' }}>{renderInline(line)}</p>;
      })}
    </div>
  );
}

function renderInline(text) {
  // Split on **bold** markers
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((p, i) =>
    i % 2 === 1 ? <strong key={i}>{p}</strong> : p
  );
}

// ─── AIReading Card ───────────────────────────────────────────────────────────

export default function AIReading({ input, nakResult, mahaboteResult, bhumma, birthChart, kasitChart, agePeriod }) {
  const [reading,  setReading]  = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const abortRef = useRef(null);

  async function handleGenerate() {
    if (loading) {
      abortRef.current?.abort();
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setReading(null);

    const controller  = new AbortController();
    abortRef.current  = controller;

    try {
      const prompt  = buildMyanmarAIPrompt(input, nakResult, mahaboteResult, bhumma, birthChart, kasitChart, agePeriod);
      const result  = await callAI(prompt, controller.signal);
      setReading(result);
    } catch (e) {
      if (e.name !== 'AbortError') setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handlePrint() {
    const w = window.open('', '_blank', 'width=800,height=700');
    w.document.write(`<!DOCTYPE html><html><head>
      <meta charset="utf-8"/>
      <title>မြန်မာ့ နက္ခတ် ဗေဒင် — AI ဟောကိန်း</title>
      <style>
        body { font-family: 'Padauk', 'Pyidaungsu', sans-serif; max-width: 680px; margin: 2rem auto; line-height: 1.8; color: #333; }
        h2 { color: #7b4f2e; }
        strong { color: #7b4f2e; }
        hr { border-top: 1px solid #ddd; }
      </style>
    </head><body>
      <h2>🔮 မြန်မာ့ နက္ခတ် ဗေဒင် — AI ဟောကိန်း</h2>
      <p><strong>မွေးနေ့:</strong> ${input.birthDate} | <strong>အသက်:</strong> ${input.age} နှစ်</p>
      <hr/>
      ${reading.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
    </body></html>`);
    w.document.close();
    w.print();
  }

  // ── Styles ──────────────────────────────────────────────────────────────────
  const cardStyle = {
    background: card,
    borderRadius: 16,
    padding: '1.5rem',
    boxShadow: C.shadow,
    border: `1px solid ${C.border}`,
  };

  const btnBase = {
    border: 'none',
    borderRadius: 10,
    padding: '0.7rem 1.4rem',
    fontFamily: bodyF,
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: 600,
    transition: 'opacity .15s',
  };

  return (
    <div style={cardStyle}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
        <span style={{ fontSize: '1.6rem' }}>🔮</span>
        <div>
          <h3 style={{ margin: 0, color: heading, fontFamily: headF, fontSize: '1.2rem' }}>
            AI ဟောကိန်း
          </h3>
          <p style={{ margin: 0, fontSize: '0.82rem', color: muted }}>
            နက္ခတ် + မဟာဘုတ် + ဘုမ္မိ ပေါင်းစပ်ဆန်းစစ်ချက် (မြန်မာဘာသာ)
          </p>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        style={{
          ...btnBase,
          background: loading ? '#c0392b' : accent,
          color: '#fff',
          width: '100%',
          marginBottom: '1rem',
        }}
      >
        {loading ? '⏹ ရပ်တန့်မည်' : reading !== null ? '🔄 ထပ်မံဖတ်ရှုမည်' : '✨ AI ဟောကိန်း ဖတ်မည်'}
      </button>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '1.5rem 0', color: muted }}>
          <div style={{ marginBottom: 8, fontSize: '1.4rem' }}>🌙</div>
          <div style={{ fontSize: '0.9rem' }}>AI ကြည့်ရှုနေသည်...</div>
          <div style={{ fontSize: '0.78rem', marginTop: 4, color: '#bbb' }}>ကျေးဇူးပြု၍ ခဏစောင့်ပါ</div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          background: '#fff0f0', border: '1px solid #f5c6c6', borderRadius: 8,
          padding: '0.8rem 1rem', color: '#c0392b', fontSize: '0.88rem'
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Reading Output */}
      {reading !== null && !loading && (
        <div>
          <div style={{
            borderTop: `2px solid ${C.border}`, paddingTop: '1rem', marginTop: '0.5rem'
          }}>
            <MyanmarReading text={reading} />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8, marginTop: '1.2rem', flexWrap: 'wrap' }}>
            <button onClick={handlePrint} style={{ ...btnBase, background: '#f0ebe3', color: C.text, fontSize: '0.88rem', padding: '0.5rem 1rem' }}>
              🖨️ ပရင့်ထုတ်မည်
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(reading)}
              style={{ ...btnBase, background: '#f0ebe3', color: C.text, fontSize: '0.88rem', padding: '0.5rem 1rem' }}
            >
              📋 ကူးယူမည်
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
