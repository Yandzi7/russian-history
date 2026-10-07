import React, { useState, useMemo } from 'react';
import { CULTURE_ITEMS } from '../data/cultureData';
import { Search } from 'lucide-react';

export const CultureSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCentury, setSelectedCentury] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredItems = useMemo(() => {
    return CULTURE_ITEMS.filter(item => {
      const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchCentury = selectedCentury === 'all' || item.century.includes(selectedCentury);
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q ||
        item.title.toLowerCase().includes(q) ||
        (item.author && item.author.toLowerCase().includes(q)) ||
        (item.style && item.style.toLowerCase().includes(q)) ||
        (item.cityOrLocation && item.cityOrLocation.toLowerCase().includes(q)) ||
        item.description.toLowerCase().includes(q);

      return matchCategory && matchCentury && matchSearch;
    });
  }, [selectedCategory, selectedCentury, searchQuery]);

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
            Культура России (Задания №15–16 ЕГЭ)
          </h2>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-faint)' }}>
            Памятников в каталоге: {CULTURE_ITEMS.length}
          </span>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
          Каталог архитектурных памятников, иконописи, живописи, скульптурных монументов и стилей с точными датами, авторством и фактами для экзамена.
        </p>

        {/* Filters and search bar */}
        <div style={{
          display: 'flex',
          gap: '0.6rem',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Category Tabs */}
          <div style={{
            display: 'flex',
            gap: '0.25rem',
            backgroundColor: 'var(--bg-card)',
            padding: '0.2rem',
            borderRadius: '5px',
            border: '1px solid var(--border-color)'
          }}>
            {[
              { id: 'all', label: 'Все объекты' },
              { id: 'architecture', label: 'Архитектура' },
              { id: 'painting', label: 'Живопись и иконы' },
              { id: 'sculpture', label: 'Скульптура' }
            ].map(cat => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: '0.35rem 0.65rem',
                    borderRadius: '4px',
                    fontSize: '0.78rem',
                    fontWeight: isActive ? 600 : 400,
                    backgroundColor: isActive ? 'var(--bg-secondary)' : 'transparent',
                    color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                    border: isActive ? '1px solid var(--border-color)' : '1px solid transparent'
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Century Filter & Search input */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
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
              <option value="all">Все века</option>
              <option value="X">X–XII века</option>
              <option value="XV">XV–XVI века</option>
              <option value="XVII">XVII век</option>
              <option value="XVIII">XVIII век</option>
              <option value="XIX">XIX век</option>
              <option value="XX">XX век</option>
            </select>

            <div style={{ position: 'relative' }}>
              <Search size={13} style={{ position: 'absolute', left: '0.65rem', top: '0.6rem', color: 'var(--text-faint)' }} />
              <input
                type="text"
                placeholder="Поиск по названию или автору..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '0.38rem 0.65rem 0.38rem 1.9rem',
                  borderRadius: '5px',
                  fontSize: '0.78rem',
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-main)',
                  border: '1px solid var(--border-color)',
                  width: '230px'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Culture Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
        gap: '0.85rem'
      }}>
        {filteredItems.map(item => (
          <article
            key={item.id}
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
              {/* Top tags */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  backgroundColor: 'var(--bg-card)',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '3px',
                  border: '1px solid var(--border-color)'
                }}>
                  {item.century} {item.exactDate ? `(${item.exactDate})` : ''}
                </span>

                <span style={{
                  fontSize: '0.72rem',
                  color: 'var(--text-faint)',
                  textTransform: 'uppercase',
                  fontWeight: 500
                }}>
                  {item.category === 'architecture' ? 'Архитектура' : item.category === 'painting' ? 'Живопись' : 'Скульптура'}
                </span>
              </div>

              {/* Title */}
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem', lineHeight: 1.35 }}>
                {item.title}
              </h3>

              {/* Metadata */}
              {(item.author || item.cityOrLocation || item.style) && (
                <div style={{
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.15rem',
                  marginBottom: '0.65rem',
                  paddingLeft: '0.5rem',
                  borderLeft: '2px solid var(--border-color)'
                }}>
                  {item.author && (
                    <div>Автор: <strong style={{ color: 'var(--text-main)', fontWeight: 600 }}>{item.author}</strong></div>
                  )}
                  {item.cityOrLocation && (
                    <div>Город: <strong style={{ color: 'var(--text-main)', fontWeight: 600 }}>{item.cityOrLocation}</strong></div>
                  )}
                  {item.style && (
                    <div>Стиль: <strong style={{ color: 'var(--text-main)', fontWeight: 600 }}>{item.style}</strong></div>
                  )}
                </div>
              )}

              {/* Description */}
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {item.description}
              </p>
            </div>

            {/* EGE Tips */}
            {item.egeNotes && (
              <div style={{
                marginTop: '0.85rem',
                paddingTop: '0.65rem',
                borderTop: '1px solid var(--border-color)',
                fontSize: '0.76rem',
                color: 'var(--text-muted)',
                lineHeight: 1.45
              }}>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>В КИМ ЕГЭ: </span>
                {item.egeNotes}
              </div>
            )}
          </article>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: 'var(--text-muted)',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '8px'
        }}>
          По вашему запросу ничего не найдено. Попробуйте изменить параметры фильтра.
        </div>
      )}
    </div>
  );
};
