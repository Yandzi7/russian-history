import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import type { ActiveTab } from './components/Header';
import { TheorySection } from './components/TheorySection';
import { CultureSection } from './components/CultureSection';
import { WorldHistorySection } from './components/WorldHistorySection';
import { GlossarySection } from './components/GlossarySection';
import { QuizSection } from './components/QuizSection';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { ALL_EPOCHS } from './data/historyTopics';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('theory');
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('klio_theme') as 'dark' | 'light') || 'dark';
  });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quizEpochId, setQuizEpochId] = useState<string | undefined>(undefined);

  // Completed topics set saved in localStorage
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('klio_completed_topics');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('klio_theme', theme);
  }, [theme]);

  // Save completed topics
  useEffect(() => {
    try {
      localStorage.setItem('klio_completed_topics', JSON.stringify(Array.from(completedTopics)));
    } catch (e) {
      console.error(e);
    }
  }, [completedTopics]);

  // Global Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const toggleTopicCompleted = (topicId: string) => {
    setCompletedTopics(prev => {
      const next = new Set(prev);
      if (next.has(topicId)) {
        next.delete(topicId);
      } else {
        next.add(topicId);
      }
      return next;
    });
  };

  const handleStartQuizForEpoch = (epochId: string) => {
    setQuizEpochId(epochId);
    setActiveTab('quiz');
  };

  // Total topics count across all epochs
  const totalTopicsCount = ALL_EPOCHS.reduce((acc, ep) => acc + ep.topics.length, 0);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenSearch={() => setIsSearchOpen(true)}
        completedTopicsCount={completedTopics.size}
        totalTopicsCount={totalTopicsCount}
      />

      <main style={{ flex: 1, paddingBottom: '3rem' }}>
        {activeTab === 'theory' && (
          <TheorySection
            completedTopics={completedTopics}
            toggleTopicCompleted={toggleTopicCompleted}
            onStartQuizForEpoch={handleStartQuizForEpoch}
          />
        )}

        {activeTab === 'culture' && <CultureSection />}

        {activeTab === 'world' && <WorldHistorySection />}

        {activeTab === 'glossary' && <GlossarySection />}

        {activeTab === 'quiz' && (
          <QuizSection initialEpochId={quizEpochId} />
        )}
      </main>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(tab) => setActiveTab(tab)}
      />

      {/* Minimal Academic Footer */}
      <footer style={{
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-color)',
        padding: '1.25rem 1rem',
        fontSize: '0.78rem',
        color: 'var(--text-faint)'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            Материалы по истории России: конспекты, культура, синхронизация и тесты
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span>Кодификатор ФИПИ</span>
            <span>Автосохранение прогресса</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
