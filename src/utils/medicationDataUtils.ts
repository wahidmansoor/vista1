import { Medication } from '../types/medications';

export function formatSideEffects(effects: { common: string[]; severe: string[]; monitoring: string[]; management?: string[] }): string[] {
  const allEffects: string[] = [];

  if (effects.common?.length) {
    allEffects.push('Common:', ...effects.common.map(e => `• ${e}`));
  }
  if (effects.severe?.length) {
    allEffects.push('Severe:', ...effects.severe.map(e => `• ${e}`));
  }
  if (effects.monitoring?.length) {
    allEffects.push('Monitoring:', ...effects.monitoring.map(e => `• ${e}`));
  }
  if (effects.management?.length) {
    allEffects.push('Management:', ...effects.management.map(e => `• ${e}`));
  }

  return allEffects;
}

export function formatInteractions(interactions: { drugs: string[]; contraindications: string[]; precautions?: string[] }): string[] {
  const allInteractions: string[] = [];

  if (interactions.drugs?.length) {
    allInteractions.push('Interacting Drugs:', ...interactions.drugs.map(d => `• ${d}`));
  }
  if (interactions.contraindications?.length) {
    allInteractions.push('Contraindications:', ...interactions.contraindications.map(c => `• ${c}`));
  }
  if (interactions.precautions?.length) {
    allInteractions.push('Precautions:', ...interactions.precautions.map(p => `• ${p}`));
  }

  return allInteractions;
}

export function formatMonitoring(monitoring: { baseline: string[]; ongoing: string[]; frequency?: string; parameters?: string[] }): string[] {
  const allMonitoring: string[] = [];

  if (monitoring.baseline?.length) {
    allMonitoring.push('Baseline:', ...monitoring.baseline.map(b => `• ${b}`));
  }
  if (monitoring.ongoing?.length) {
    allMonitoring.push('Ongoing:', ...monitoring.ongoing.map(o => `• ${o}`));
  }
  if (monitoring.parameters?.length) {
    allMonitoring.push('Parameters:', ...monitoring.parameters.map(p => `• ${p}`));
  }

  return allMonitoring;
}
