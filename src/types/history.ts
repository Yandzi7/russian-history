export interface TimelineEvent {
  year: string;
  event: string;
  description?: string;
}

export interface HistoricalFigure {
  name: string;
  role: string;
  deeds: string;
}

export interface HistoryTopic {
  id: string;
  epochId: string;
  title: string;
  period: string;
  rulerOrLeader?: string;
  summary: string;
  keyPoints: string[];
  timeline: TimelineEvent[];
  figures: HistoricalFigure[];
  terms: string[];
  pdfPages?: string; // номера страниц из PDF
}

export interface Epoch {
  id: string;
  title: string;
  period: string;
  description: string;
  topics: HistoryTopic[];
}

export interface CultureItem {
  id: string;
  title: string;
  century: string;
  exactDate?: string;
  category: 'architecture' | 'painting' | 'sculpture' | 'literature';
  author?: string;
  cityOrLocation?: string;
  style?: string;
  description: string;
  egeNotes?: string;
}

export interface WorldHistoryParallel {
  id: string;
  century: string;
  yearApprox: string;
  worldEvent: string;
  worldCountry: string;
  russiaParallelYear: string;
  russiaParallelEvent: string;
  description: string;
}

export interface TermDefinition {
  id: string;
  term: string;
  century: string;
  exactDate?: string;
  definition: string;
  facts: string; // для задания 19 ЕГЭ
}

export interface QuizQuestion {
  id: string;
  epochId?: string;
  category: 'general' | 'culture' | 'world' | 'vov' | 'dates' | 'terms';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
