import React, { useState, useMemo } from 'react';
import { WORLD_HISTORY_PARALLELS } from '../data/worldHistoryData';
import { ArrowRight, Search } from 'lucide-react';

export const WorldHistorySection: React.FC = () => {
  const [selectedCentury, setSelectedCentury] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredItems = useMemo(() => {
    return WORLD_HISTORY_PARALLELS.filter(item => {
      const matchCentury = selectedCentury === 'all' || item.century.includes(selectedCentury);
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q ||
        item.worldEvent.toLowerCase().includes(q) ||
        item.russiaParallelEvent.toLowerCase().includes(q) ||
        item.worldCountry.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);

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
            Синхронистическая таблица: Всемирная история ↔ Россия
          </h2>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-faint)' }}>
            Событий в базе: {WORLD_HISTORY_PARALLELS.length}
          </span>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
          Обязательные параллели зарубежной и отечественной истории из кодификатора ФИПИ для выполнения заданий №2 и №21 ЕГЭ.
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
            <option value="all">Все века (V – XX вв.)</option>
            <option value="V">V–IX вв. (Раннее Средневековье)</option>
            <option value="X">X–XII вв. (Древность)</option>
            <option value="XIII">XIII–XV вв. (Раздробленность и Столетняя война)</option>
            <option value="XVI">XVI в. (Реформация)</option>
            <option value="XVII">XVII в. (XVII век)</option>
            <option value="XVIII">XVIII в. (Просвещение и Революции)</option>
            <option value="XIX">XIX в. (XIX век)</option>
            <option value="XX">XX в. (XX век)</option>
          </select>

          <div style={{ position: 'relative' }}>
            <Search size={13} style={{ position: 'absolute', left: '0.65rem', top: '0.6rem', color: 'var(--text-faint)' }} />
            <input
              type="text"
              placeholder="Поиск по событиям или странам..."
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

      {/* Sync Table View */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {filteredItems.map(item => (
          <div
            key={item.id}
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              padding: '1rem',
              display: 'grid',
              gridTemplateColumns: '70px 1fr 32px 1fr',
              gap: '0.85rem',
              alignItems: 'center'
            }}
          >
            {/* Century / Year */}
            <div style={{ textAlign: 'center' }}>
              <span style={{
                display: 'inline-block',
                fontSize: '0.74rem',
                fontWeight: 600,
                color: 'var(--text-main)',
                backgroundColor: 'var(--bg-card)',
                padding: '0.2rem 0.4rem',
                borderRadius: '3px',
                border: '1px solid var(--border-color)'
              }}>
                {item.century}
              </span>
            </div>

            {/* World Event Column */}
            <div style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '5px',
              padding: '0.75rem 0.9rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-faint)', textTransform: 'uppercase' }}>
                  {item.worldCountry}
                </span>
                <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {item.yearApprox}
                </span>
              </div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                {item.worldEvent}
              </h4>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                {item.description}
              </p>
            </div>

            {/* Center Sync Arrow */}
            <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--text-faint)' }}>
              <ArrowRight size={15} />
            </div>

            {/* Russia Parallel Column */}
            <div style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '5px',
              padding: '0.75rem 0.9rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-faint)', textTransform: 'uppercase' }}>
                  Россия
                </span>
                <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {item.russiaParallelYear}
                </span>
              </div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {item.russiaParallelEvent}
              </h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
