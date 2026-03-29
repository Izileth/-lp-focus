// src/components/MethodData.ts
import type { ReactNode } from "react";

export interface Pilar {
  letter: string;
  title: string;
  desc: string;
  icon: ReactNode;
}

export interface Triade {
  label: string;
  desc: string;
}

export interface BarData {
  label: string;
  before: number;
  after: number;
}

export interface RadialData {
  label: string;
  value: number;
}

export const PILARES: Pilar[] = [
  { letter: "E", title: "Estratégia",  desc: "Alinhamento de objetivos com recursos cognitivos.",     icon: null }, // Icons will be added in the component
  { letter: "P", title: "Performance", desc: "Otimização de rotinas para estados de flow constante.", icon: null },
  { letter: "S", title: "Sistemas",    desc: "Arquiteturas de suporte que automatizam a atenção.",    icon: null },
  { letter: "D", title: "Dados",       desc: "Feedback loops baseados em neurociência aplicada.",     icon: null },
  { letter: "P", title: "Processos",   desc: "Iteração contínua para resultados de longo prazo.",     icon: null },
];

export const TRIADE: Triade[] = [
  { label: "Alma",    desc: "Clareza mental e gestão da atenção como ativos estratégicos." },
  { label: "Mente",   desc: "Sistemas repetíveis que operam independente de motivação." },
  { label: "Corpo", desc: "Aceleração composta: pequenos ganhos diários que se multiplicam." },
];

export const BAR_DATA: BarData[] = [
  { label: "Foco",     before: 28, after: 94 },
  { label: "Clareza",  before: 42, after: 89 },
  { label: "Execução", before: 18, after: 83 },
  { label: "Retenção", before: 38, after: 91 },
];

export const LINE_POINTS = [10, 15, 12, 22, 20, 35, 30, 50, 46, 65, 62, 79, 75, 90, 95];

export const RADIAL_DATA: RadialData[] = [
  { label: "Foco",        value: 92 },
  { label: "Consistência",value: 85 },
  { label: "Clareza",     value: 88 },
  { label: "Execução",    value: 78 },
  { label: "Energia",     value: 82 },
];

export const MINI_WEEKS = [18, 25, 22, 35, 32, 48, 44, 60, 58, 72, 70, 85];
