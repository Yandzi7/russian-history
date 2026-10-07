import React, { useState, useMemo } from 'react';
import { TERMS_GLOSSARY } from '../data/termsGlossary';
import { Search } from 'lucide-react';

export const GlossarySection: React.FC = () => {
  const [selectedCentury, setSelectedCentury] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTerms = useMemo(() => {
    return TERMS_GLOSSARY.filter(t => {
      const matchCentury = selectedCentury === 'all' || t.century.includes(selectedCentury);
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q ||
        t.term.toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q) ||
        t.facts.toLowerCase().includes(q);

      return matchCentury && matchSearch;
    });
  }, [selectedCentury, searchQuery]);

  return (
    <div style={{ maxWidth: '1240px', margin: '1.5rem auto', padding: '0 1rem' }}>
      {/* Intro Header */}
      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '6px',
        padding: '1rem 1.25rem',
        marginBottom: '1.25rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Словарь исторических понятий и терминов (Задание №19 ЕГЭ)
          </h2>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-faint)' }}>
            Терминов в базе: {TERMS_GLOSSARY.length}
          </span>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
          Академические определения понятий с обязательными историческими фактами, конкретизирующими термин для задания №19.
        </p>

        {/* Filters */}
        <div style={{
          display: 'flex',
          gap: '0.6rem',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <select
            value={selectedCentury}
            onChange={(e) => setSelectedCentury(e.target.value)}
            style={{
              padding: '0.38rem 0.65rem',
              borderRadius: '5px',
              fontSize: '0.78rem',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-main)',
              border: '1px solid var(--border-color)'
            }}
          >
            <option value="all">Все века (IX – XX вв.)</option>
            <option value="IX">IX–XI вв. (Древняя Русь)</option>
            <option value="XII">XII–XV вв. (Удельная Русь и Москва)</option>
            <option value="XVI">XVI–XVII вв. (Царство и Смута)</option>
            <option value="XVIII">XVIII в. (Империя)</option>
            <option value="XIX">XIX в. (Реформы XIX в.)</option>
            <option value="XX">XX в. (XX век)</option>
          </select>

          <div style={{ position: 'relative' }}>
            <Search size={13} style={{ position: 'absolute', left: '0.65rem', top: '0.6rem', color: 'var(--text-faint)' }} />
            <input
              type="text"
              placeholder="Поиск по термину или факту..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '0.38rem 0.65rem 0.38rem 1.9rem',
                borderRadius: '5px',
                fontSize: '0.78rem',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-color)',
                width: '260px'
              }}
            />
          </div>
        </div>
      </div>

      {/* Terms Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
        gap: '0.85rem'
      }}>
        {filteredTerms.map(t => (
          <div
            key={t.id}
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              padding: '1.1rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.45rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {t.term}
                </h3>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: 'var(--text-faint)',
                  backgroundColor: 'var(--bg-card)',
                  padding: '0.12rem 0.4rem',
                  borderRadius: '3px',
                  border: '1px solid var(--border-color)'
                }}>
                  {t.century}
                </span>
              </div>

              {/* Definition */}
              <div style={{ marginBottom: '0.85rem' }}>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-faint)', fontWeight: 600 }}>
                  Определение:
                </span>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-main)', lineHeight: 1.45, marginTop: '0.2rem' }}>
                  {t.definition}
                </p>
              </div>
            </div>

            {/* Fact for Task 19 */}
            <div style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              padding: '0.65rem 0.8rem'
            }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
                Исторический факт к заданию №19:
              </span>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                {t.facts}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
