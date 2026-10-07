import type { Epoch } from '../types/history';
import { EPOCHS as EPOCHS_PART1 } from './historyTopicsPart1';
import { EPOCHS_PART2 } from './historyTopicsPart2';
import { EPOCHS_PART3 } from './historyTopicsPart3';

export const ALL_EPOCHS: Epoch[] = [
  ...EPOCHS_PART1,
  ...EPOCHS_PART2,
  ...EPOCHS_PART3
];
