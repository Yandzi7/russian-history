import React, { useState } from 'react';
import type { Epoch, HistoryTopic } from '../types/history';
import { ALL_EPOCHS } from '../data/historyTopics';
import { CheckCircle2, Circle, Clock, UserCheck, BookOpen, ChevronRight, FileText } from 'lucide-react';

interface TheorySectionProps {
  completedTopics: Set<string>;
  toggleTopicCompleted: (topicId: string) => void;
  onStartQuizForEpoch: (epochId: string) => void;
}

export const TheorySection: React.FC<TheorySectionProps> = ({
  completedTopics,
  toggleTopicCompleted,
  onStartQuizForEpoch
}) => {
  const [selectedEpochId, setSelectedEpochId] = useState<string>(ALL_EPOCHS[0].id);
  const currentEpoch = ALL_EPOCHS.find(e => e.id === selectedEpochId) || ALL_EPOCHS[0];
  const [selectedTopicId, setSelectedTopicId] = useState<string>(currentEpoch.topics[0]?.id || '');

  // Find active topic
  const currentTopic: HistoryTopic = currentEpoch.topics.find(t => t.id === selectedTopicId) || currentEpoch.topics[0];

  const handleSelectEpoch = (epoch: Epoch) => {
    setSelectedEpochId(epoch.id);
    if (epoch.topics.length > 0) {
      setSelectedTopicId(epoch.topics[0].id);
    }
  };

  const isCompleted = currentTopic ? completedTopics.has(currentTopic.id) : false;

  return (
    <div style={{
      maxWidth: '1300px',
      margin: '1.5rem auto',
      padding: '0 1rem',
      display: 'grid',
      gridTemplateColumns: '320px 1fr',
      gap: '1.5rem',
      alignItems: 'start'
    }}>
      {/* LEFT SIDEBAR: Epochs and Topics Selector */}
      <aside style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        position: 'sticky',
        top: '4.5rem',
        maxHeight: 'calc(100vh - 6rem)',
        overflowY: 'auto'
      }}>
        <div>
          <h2 style={{
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: 'var(--text-faint)',
            marginBottom: '0.75rem',
            fontWeight: 700
          }}>
            Исторические эпохи
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {ALL_EPOCHS.map((epoch, idx) => {
              const isActive = epoch.id === selectedEpochId;
              const completedCountInEpoch = epoch.topics.filter(t => completedTopics.has(t.id)).length;
              return (
                <button
                  key={epoch.id}
                  onClick={() => handleSelectEpoch(epoch)}
                  style={{
                    textAlign: 'left',
                    padding: '0.6rem 0.75rem',
                    borderRadius: '6px',
                    backgroundColor: isActive ? 'var(--bg-card)' : 'transparent',
                    border: isActive ? '1px solid var(--accent-gold)' : '1px solid transparent',
                    color: isActive ? 'var(--text-main)' : 'var(--text-muted)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: isActive ? 700 : 500 }}>
                      {idx + 1}. {epoch.title}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-faint)' }}>
                      {completedCountInEpoch}/{epoch.topics.length}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-faint)', marginTop: '0.15rem' }}>
                    {epoch.period}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* TOPICS IN SELECTED EPOCH */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem' }}>
          <h3 style={{
            fontSize: '0.8rem',
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            color: 'var(--text-faint)',
            marginBottom: '0.5rem',
            fontWeight: 700
          }}>
            Темы периода
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {currentEpoch.topics.map(topic => {
              const isTopicActive = topic.id === selectedTopicId;
              const isTopicDone = completedTopics.has(topic.id);
              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopicId(topic.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    textAlign: 'left',
                    padding: '0.5rem 0.65rem',
                    borderRadius: '6px',
                    backgroundColor: isTopicActive ? 'var(--accent-gold-bg)' : 'transparent',
                    border: isTopicActive ? '1px solid var(--accent-gold)' : '1px solid var(--border-color)',
                    color: isTopicActive ? 'var(--text-main)' : 'var(--text-muted)'
                  }}
                >
                  {isTopicDone ? (
                    <CheckCircle2 size={16} style={{ color: 'var(--accent-green)', flexShrink: 0 }} />
                  ) : (
                    <Circle size={16} style={{ color: 'var(--text-faint)', flexShrink: 0 }} />
                  )}
                  <span style={{ fontSize: '0.82rem', fontWeight: isTopicActive ? 600 : 400, flex: 1 }}>
                    {topic.title}
                  </span>
                  <ChevronRight size={14} style={{ color: 'var(--text-faint)', opacity: isTopicActive ? 1 : 0 }} />
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT: Selected Topic Details */}
      {currentTopic ? (
        <main style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '1.75rem'
        }}>
          {/* Header & Status Actions */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '1rem',
            flexWrap: 'wrap',
            paddingBottom: '1.25rem',
            borderBottom: '1px solid var(--border-color)'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  backgroundColor: 'var(--badge-bg)',
                  color: 'var(--accent-gold)',
                  border: '1px solid var(--border-color)'
                }}>
                  {currentEpoch.title}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {currentTopic.period}
                </span>
                {currentTopic.pdfPages && (
                  <span style={{
                    fontSize: '0.72rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    color: 'var(--text-faint)'
                  }}>
                    <FileText size={12} />
                    {currentTopic.pdfPages}
                  </span>
                )}
              </div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.3 }}>
                {currentTopic.title}
              </h2>
              {currentTopic.rulerOrLeader && (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Правители / Деятели: <strong style={{ color: 'var(--text-main)' }}>{currentTopic.rulerOrLeader}</strong>
                </p>
              )}
            </div>

            {/* Actions: Mark Done & Quiz Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <button
                onClick={() => toggleTopicCompleted(currentTopic.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 0.85rem',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  backgroundColor: isCompleted ? 'rgba(52, 211, 153, 0.15)' : 'var(--bg-card)',
                  color: isCompleted ? 'var(--accent-green)' : 'var(--text-muted)',
                  border: isCompleted ? '1px solid var(--accent-green)' : '1px solid var(--border-color)'
                }}
              >
                {isCompleted ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                <span>{isCompleted ? 'Тема изучена' : 'Отметить как изученное'}</span>
              </button>

              <button
                onClick={() => onStartQuizForEpoch(currentEpoch.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 0.95rem',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  backgroundColor: 'var(--accent-gold)',
                  color: '#0f141c'
                }}
              >
                <BookOpen size={16} />
                <span>Тест по эпохе</span>
              </button>
            </div>
          </div>

          {/* SUMMARY SECTION */}
          <section style={{ marginTop: '1.5rem' }}>
            <h3 style={{
              fontSize: '0.85rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: 'var(--accent-gold)',
              marginBottom: '0.65rem'
            }}>
              Конспект темы
            </h3>
            <p style={{
              fontSize: '0.96rem',
              lineHeight: 1.7,
              color: 'var(--text-main)',
              whiteSpace: 'pre-line'
            }}>
              {currentTopic.summary}
            </p>
          </section>

          {/* KEY POINTS */}
          {currentTopic.keyPoints.length > 0 && (
            <section style={{
              marginTop: '1.5rem',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              padding: '1rem 1.25rem'
            }}>
              <h4 style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                marginBottom: '0.5rem'
              }}>
                Главное для ЕГЭ:
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {currentTopic.keyPoints.map((kp, idx) => (
                  <li key={idx} style={{
                    fontSize: '0.88rem',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '0.5rem'
                  }}>
                    <span style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>•</span>
                    <span>{kp}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* CHRONOLOGY & TIMELINE */}
          {currentTopic.timeline.length > 0 && (
            <section style={{ marginTop: '1.75rem' }}>
              <h3 style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: 'var(--accent-gold)',
                marginBottom: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                <Clock size={16} />
                Хронология ключевых событий
              </h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
                borderLeft: '2px solid var(--border-color)',
                paddingLeft: '1rem',
                marginLeft: '0.5rem'
              }}>
                {currentTopic.timeline.map((item, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    <div style={{
                      position: 'absolute',
                      left: '-1.45rem',
                      top: '0.35rem',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--accent-gold)'
                    }} />
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        color: 'var(--accent-gold)',
                        minWidth: '85px'
                      }}>
                        {item.year}
                      </span>
                      <strong style={{ fontSize: '0.92rem', color: 'var(--text-main)' }}>
                        {item.event}
                      </strong>
                    </div>
                    {item.description && (
                      <p style={{
                        fontSize: '0.82rem',
                        color: 'var(--text-muted)',
                        marginTop: '0.15rem'
                      }}>
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* HISTORICAL FIGURES */}
          {currentTopic.figures.length > 0 && (
            <section style={{ marginTop: '1.75rem' }}>
              <h3 style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: 'var(--accent-gold)',
                marginBottom: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                <UserCheck size={16} />
                Исторические личности
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '0.75rem'
              }}>
                {currentTopic.figures.map((fig, idx) => (
                  <div key={idx} style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    padding: '0.85rem'
                  }}>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {fig.name}
                    </h4>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', marginBottom: '0.35rem' }}>
                      {fig.role}
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                      {fig.deeds}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* TERMS TAGS */}
          {currentTopic.terms.length > 0 && (
            <section style={{ marginTop: '1.75rem' }}>
              <h4 style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                color: 'var(--text-faint)',
                marginBottom: '0.5rem'
              }}>
                Термины темы:
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {currentTopic.terms.map((t, idx) => (
                  <span key={idx} style={{
                    fontSize: '0.78rem',
                    padding: '0.25rem 0.55rem',
                    borderRadius: '4px',
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-muted)',
                    border: '1px solid var(--border-color)'
                  }}>
                    {t}
                  </span>
                ))}
              </div>
            </section>
          )}
        </main>
      ) : (
        <div>Выберите тему для изучения</div>
      )}
    </div>
  );
};
