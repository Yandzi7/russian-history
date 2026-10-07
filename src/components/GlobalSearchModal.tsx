import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ALL_EPOCHS } from '../data/historyTopics';
import { CULTURE_ITEMS } from '../data/cultureData';
import { WORLD_HISTORY_PARALLELS } from '../data/worldHistoryData';
import { TERMS_GLOSSARY } from '../data/termsGlossary';
import { Search, X, BookOpen, Palette, Globe, BookText } from 'lucide-react';
import type { ActiveTab } from './Header';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: ActiveTab) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q || q.length < 2) return null;

    // Search topics
    const topics = ALL_EPOCHS.flatMap(epoch =>
      epoch.topics
        .filter(t => t.title.toLowerCase().includes(q) || t.summary.toLowerCase().includes(q) || (t.rulerOrLeader && t.rulerOrLeader.toLowerCase().includes(q)))
        .map(t => ({ type: 'topic', title: t.title, subtitle: `${epoch.title} (${t.period})`, tab: 'theory' as ActiveTab }))
    );

    // Search culture
    const culture = CULTURE_ITEMS
      .filter(c => c.title.toLowerCase().includes(q) || (c.author && c.author.toLowerCase().includes(q)) || c.description.toLowerCase().includes(q))
      .map(c => ({ type: 'culture', title: c.title, subtitle: `${c.author ? c.author + ' • ' : ''}${c.century}`, tab: 'culture' as ActiveTab }));

    // Search world history
    const world = WORLD_HISTORY_PARALLELS
      .filter(w => w.worldEvent.toLowerCase().includes(q) || w.russiaParallelEvent.toLowerCase().includes(q))
      .map(w => ({ type: 'world', title: `${w.worldEvent} ↔ ${w.russiaParallelEvent}`, subtitle: `${w.worldCountry} (${w.yearApprox})`, tab: 'world' as ActiveTab }));

    // Search glossary
    const terms = TERMS_GLOSSARY
      .filter(t => t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q))
      .map(t => ({ type: 'glossary', title: t.term, subtitle: t.definition, tab: 'glossary' as ActiveTab }));

    return {
      topics: topics.slice(0, 4),
      culture: culture.slice(0, 4),
      world: world.slice(0, 4),
      terms: terms.slice(0, 4)
    };
  }, [query]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingTop: '5rem',
      zIndex: 100,
      backdropFilter: 'blur(4px)'
    }}
    onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.9rem 1.25rem',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <Search size={18} style={{ color: 'var(--accent-gold)' }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Искать темы, даты, правителей, памятники и термины..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              outline: 'none',
              fontSize: '1rem',
              color: 'var(--text-main)'
            }}
          />
          <button onClick={onClose} style={{ color: 'var(--text-faint)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: '420px', overflowY: 'auto', padding: '1rem' }}>
          {!results && (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-faint)', fontSize: '0.88rem' }}>
              Введите минимум 2 буквы для глобального поиска по всему курсу...
            </div>
          )}

          {results && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Topics */}
              {results.topics.length > 0 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    <BookOpen size={13} />
                    <span>Темы курса ({results.topics.length})</span>
                  </div>
                  {results.topics.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => { onNavigate(item.tab); onClose(); }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.5rem 0.65rem',
                        borderRadius: '6px',
                        backgroundColor: 'var(--bg-card)',
                        marginBottom: '0.3rem',
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>{item.title}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{item.subtitle}</div>
                    </button>
                  ))}
                </div>
              )}

              {/* Culture */}
              {results.culture.length > 0 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    <Palette size={13} />
                    <span>Культура ({results.culture.length})</span>
                  </div>
                  {results.culture.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => { onNavigate(item.tab); onClose(); }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.5rem 0.65rem',
                        borderRadius: '6px',
                        backgroundColor: 'var(--bg-card)',
                        marginBottom: '0.3rem',
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>{item.title}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{item.subtitle}</div>
                    </button>
                  ))}
                </div>
              )}

              {/* Terms */}
              {results.terms.length > 0 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    <BookText size={13} />
                    <span>Термины и понятия ({results.terms.length})</span>
                  </div>
                  {results.terms.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => { onNavigate(item.tab); onClose(); }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.5rem 0.65rem',
                        borderRadius: '6px',
                        backgroundColor: 'var(--bg-card)',
                        marginBottom: '0.3rem',
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--accent-gold)' }}>{item.title}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.subtitle}</div>
                    </button>
                  ))}
                </div>
              )}

              {/* World */}
              {results.world.length > 0 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    <Globe size={13} />
                    <span>Всемирная история ({results.world.length})</span>
                  </div>
                  {results.world.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => { onNavigate(item.tab); onClose(); }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.5rem 0.65rem',
                        borderRadius: '6px',
                        backgroundColor: 'var(--bg-card)',
                        marginBottom: '0.3rem',
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>{item.title}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{item.subtitle}</div>
                    </button>
                  ))}
                </div>
              )}

              {results.topics.length === 0 && results.culture.length === 0 && results.terms.length === 0 && results.world.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-faint)', fontSize: '0.88rem' }}>
                  Ничего не найдено по запросу «{query}».
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
