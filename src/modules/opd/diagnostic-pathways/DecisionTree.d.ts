import { DiagnosticPathway } from '../../../types/pathways';
import { FC } from 'react';

export interface DecisionTreeProps {
  tree: DiagnosticPathway;
}

declare const DecisionTree: FC<DecisionTreeProps>;
export default DecisionTree;
