import React from 'react';
import { BookOpen, Palette, Globe, BookText, CheckSquare, Sun, Moon, Search } from 'lucide-react';

export type ActiveTab = 'theory' | 'culture' | 'world' | 'glossary' | 'quiz';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  onOpenSearch: () => void;
  completedTopicsCount: number;
  totalTopicsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  theme,
  toggleTheme,
  onOpenSearch,
  completedTopicsCount,
  totalTopicsCount
}) => {
  const percent = totalTopicsCount > 0 ? Math.round((completedTopicsCount / totalTopicsCount) * 100) : 0;

  const navItems = [
    { id: 'theory', label: 'Конспекты', icon: BookOpen },
    { id: 'culture', label: 'Культура', icon: Palette },
    { id: 'world', label: 'Всемирная история', icon: Globe },
    { id: 'glossary', label: 'Термины', icon: BookText },
    { id: 'quiz', label: 'Тесты', icon: CheckSquare },
  ] as const;

  return (
    <header style={{
      backgroundColor: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 40
    }}>
      <div style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '0.65rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem' }}>
          <span style={{
            fontSize: '1rem',
            fontWeight: 700,
            letterSpacing: '0.2px',
            color: 'var(--text-main)'
          }}>
            История
          </span>
          <span style={{
            fontSize: '0.75rem',
            color: 'var(--text-faint)',
            borderLeft: '1px solid var(--border-color)',
            paddingLeft: '0.5rem'
          }}>
            база материалов
          </span>
        </div>

        {/* Navigation tabs */}
        <nav style={{
          display: 'flex',
          gap: '0.25rem',
          backgroundColor: 'var(--bg-card)',
          padding: '0.2rem',
          borderRadius: '6px',
          border: '1px solid var(--border-color)'
        }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.38rem 0.75rem',
                  borderRadius: '4px',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                  backgroundColor: isActive ? 'var(--bg-secondary)' : 'transparent',
                  border: isActive ? '1px solid var(--border-color)' : '1px solid transparent'
                }}
              >
                <Icon size={14} style={{ opacity: isActive ? 1 : 0.6 }} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button
            onClick={onOpenSearch}
            title="Поиск (Ctrl+K)"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.38rem 0.65rem',
              borderRadius: '5px',
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)'
            }}
          >
            <Search size={13} />
            <span>Поиск</span>
            <kbd style={{
              fontSize: '0.65rem',
              padding: '0.1rem 0.3rem',
              borderRadius: '3px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-faint)'
            }}>
              Ctrl K
            </kbd>
          </button>

          <div style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            padding: '0.35rem 0.6rem',
            backgroundColor: 'var(--bg-card)',
            borderRadius: '5px',
            border: '1px solid var(--border-color)'
          }}>
            Прогресс: <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{completedTopicsCount}/{totalTopicsCount}</span> ({percent}%)
          </div>

          <button
            onClick={toggleTheme}
            title="Тема оформления"
            style={{
              padding: '0.4rem',
              borderRadius: '5px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </div>
    </header>
  );
};
