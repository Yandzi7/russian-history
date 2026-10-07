import React, { useState, useMemo, useEffect } from 'react';
import type { QuizQuestion } from '../types/history';
import { QUIZ_QUESTIONS } from '../data/quizQuestions';
import { ALL_EPOCHS } from '../data/historyTopics';
import { RotateCcw, ArrowRight } from 'lucide-react';

interface QuizSectionProps {
  initialEpochId?: string;
}

export const QuizSection: React.FC<QuizSectionProps> = ({ initialEpochId }) => {
  const [selectedMode, setSelectedMode] = useState<string>(initialEpochId ? `epoch-${initialEpochId}` : 'all');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [wrongQuestions, setWrongQuestions] = useState<QuizQuestion[]>([]);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);
  const [isMistakesReviewMode, setIsMistakesReviewMode] = useState<boolean>(false);

  const activeQuestions = useMemo(() => {
    if (isMistakesReviewMode) {
      return wrongQuestions;
    }

    if (selectedMode === 'all') {
      return [...QUIZ_QUESTIONS];
    }
    if (selectedMode === 'culture') {
      return QUIZ_QUESTIONS.filter(q => q.category === 'culture');
    }
    if (selectedMode === 'world') {
      return QUIZ_QUESTIONS.filter(q => q.category === 'world');
    }
    if (selectedMode === 'vov') {
      return QUIZ_QUESTIONS.filter(q => q.category === 'vov');
    }
    if (selectedMode.startsWith('epoch-')) {
      const epochId = selectedMode.replace('epoch-', '');
      return QUIZ_QUESTIONS.filter(q => q.epochId === epochId);
    }
    return QUIZ_QUESTIONS;
  }, [selectedMode, isMistakesReviewMode, wrongQuestions]);

  const currentQ = activeQuestions[currentQuestionIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
    setIsAnswerSubmitted(true);

    if (index === currentQ.correctIndex) {
      setScore(prev => prev + 1);
    } else {
      setWrongQuestions(prev => [...prev, currentQ]);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsQuizCompleted(true);
    }
  };

  // Keyboard controls: 1-4 for options, Enter for next
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isQuizCompleted || !currentQ) return;

      if (!isAnswerSubmitted) {
        if (['1', '2', '3', '4'].includes(e.key)) {
          const idx = parseInt(e.key, 10) - 1;
          if (idx < currentQ.options.length) {
            handleSelectOption(idx);
          }
        }
      } else {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleNextQuestion();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isQuizCompleted, currentQ, isAnswerSubmitted, currentQuestionIndex, activeQuestions.length]);

  const resetQuiz = (mode: string = selectedMode) => {
    setSelectedMode(mode);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setWrongQuestions([]);
    setIsQuizCompleted(false);
    setIsMistakesReviewMode(false);
  };

  const startMistakesReview = () => {
    setIsMistakesReviewMode(true);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setIsQuizCompleted(false);
  };

  const percent = activeQuestions.length > 0 ? Math.round((score / activeQuestions.length) * 100) : 0;

  const optionLetters = ['А', 'Б', 'В', 'Г'];

  return (
    <div style={{ maxWidth: '860px', margin: '1.5rem auto', padding: '0 1rem' }}>
      {/* Mode bar */}
      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '6px',
        padding: '0.85rem 1rem',
        marginBottom: '1.25rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-faint)', textTransform: 'uppercase' }}>
            Раздел тестирования
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-faint)' }}>
            Вопросов в базе: {QUIZ_QUESTIONS.length}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'Все вопросы' },
            { id: 'culture', label: 'Культура' },
            { id: 'world', label: 'Всемирная история' },
            { id: 'vov', label: 'ВОВ 1941–1945' },
            ...ALL_EPOCHS.map(e => ({ id: `epoch-${e.id}`, label: e.title }))
          ].map(m => {
            const isActive = selectedMode === m.id && !isMistakesReviewMode;
            return (
              <button
                key={m.id}
                onClick={() => resetQuiz(m.id)}
                style={{
                  padding: '0.3rem 0.55rem',
                  borderRadius: '4px',
                  fontSize: '0.76rem',
                  fontWeight: isActive ? 600 : 400,
                  backgroundColor: isActive ? 'var(--text-main)' : 'var(--bg-card)',
                  color: isActive ? 'var(--bg-primary)' : 'var(--text-muted)',
                  border: '1px solid var(--border-color)'
                }}
              >
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* QUIZ ACTIVE VIEW */}
      {!isQuizCompleted && currentQ && (
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '6px',
          padding: '1.5rem'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Вопрос {currentQuestionIndex + 1} из {activeQuestions.length}
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              {isMistakesReviewMode && (
                <span style={{
                  fontSize: '0.72rem',
                  padding: '0.1rem 0.4rem',
                  borderRadius: '3px',
                  backgroundColor: 'rgba(248, 113, 113, 0.15)',
                  color: 'var(--accent-red)',
                  fontWeight: 600
                }}>
                  Работа над ошибками
                </span>
              )}
              <span style={{ fontSize: '0.78rem', color: 'var(--text-faint)' }}>
                Верно: {score}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{
            width: '100%',
            height: '2px',
            backgroundColor: 'var(--border-color)',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              width: `${((currentQuestionIndex + 1) / activeQuestions.length) * 100}%`,
              height: '100%',
              backgroundColor: 'var(--text-main)',
              transition: 'width 0.15s ease'
            }} />
          </div>

          {/* Question Text */}
          <h3 style={{
            fontSize: '1.05rem',
            fontWeight: 600,
            color: 'var(--text-main)',
            lineHeight: 1.5,
            marginBottom: '1.25rem'
          }}>
            {currentQ.question}
          </h3>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;

              let btnBg = 'var(--bg-card)';
              let borderColor = 'var(--border-color)';
              let textColor = 'var(--text-main)';

              if (isAnswerSubmitted) {
                if (isCorrect) {
                  btnBg = 'rgba(52, 211, 153, 0.12)';
                  borderColor = 'var(--accent-green)';
                  textColor = 'var(--accent-green)';
                } else if (isSelected && !isCorrect) {
                  btnBg = 'rgba(248, 113, 113, 0.12)';
                  borderColor = 'var(--accent-red)';
                  textColor = 'var(--accent-red)';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswerSubmitted}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.7rem 0.9rem',
                    borderRadius: '5px',
                    textAlign: 'left',
                    fontSize: '0.88rem',
                    backgroundColor: btnBg,
                    border: `1px solid ${borderColor}`,
                    color: textColor,
                    cursor: isAnswerSubmitted ? 'default' : 'pointer'
                  }}
                >
                  <span style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '3px',
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    flexShrink: 0
                  }}>
                    {optionLetters[idx]}
                  </span>
                  <span style={{ flex: 1 }}>{option}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {isAnswerSubmitted && (
            <div style={{
              backgroundColor: 'var(--bg-card)',
              borderLeft: '3px solid var(--text-faint)',
              padding: '0.75rem 1rem',
              marginBottom: '1.25rem',
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
              lineHeight: 1.5
            }}>
              <span style={{ fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.2rem' }}>
                Пояснение:
              </span>
              {currentQ.explanation}
            </div>
          )}

          {/* Next Button */}
          {isAnswerSubmitted && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-faint)' }}>
                Нажмите Enter для перехода
              </span>
              <button
                onClick={handleNextQuestion}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '5px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  backgroundColor: 'var(--text-main)',
                  color: 'var(--bg-primary)'
                }}
              >
                <span>{currentQuestionIndex < activeQuestions.length - 1 ? 'Дальше' : 'Завершить'}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* QUIZ COMPLETED SUMMARY VIEW */}
      {isQuizCompleted && (
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '6px',
          padding: '2rem 1.5rem'
        }}>
          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
              Тестирование завершено
            </h3>
            <div style={{ fontSize: '0.92rem', color: 'var(--text-muted)' }}>
              Правильных ответов: <strong style={{ color: 'var(--text-main)' }}>{score}</strong> из {activeQuestions.length} ({percent}%)
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            {wrongQuestions.length > 0 && !isMistakesReviewMode && (
              <button
                onClick={startMistakesReview}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.5rem 0.9rem',
                  borderRadius: '5px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  backgroundColor: 'transparent',
                  color: 'var(--accent-red)',
                  border: '1px solid var(--accent-red)'
                }}
              >
                <RotateCcw size={14} />
                <span>Ошибочные вопросы ({wrongQuestions.length})</span>
              </button>
            )}

            <button
              onClick={() => resetQuiz()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.5rem 0.9rem',
                borderRadius: '5px',
                fontSize: '0.82rem',
                fontWeight: 600,
                backgroundColor: 'var(--text-main)',
                color: 'var(--bg-primary)'
              }}
            >
              <RotateCcw size={14} />
              <span>Пройти заново</span>
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!currentQ && !isQuizCompleted && (
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '6px',
          padding: '2rem',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.85rem'
        }}>
          Нет доступных вопросов в этой категории.
        </div>
      )}
    </div>
  );
};
