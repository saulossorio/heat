/**
 * js/config.js — Configuração da Aplicação
 *
 * Heat — Ferramenta de Avaliação Heurística
 * Autor: Saul Ossorio · https://saulossorio.com
 *
 * Carregado antes de heuristics.js e do código React inline em index.html.
 * Exporta os seguintes globais consumidos pelo aplicativo:
 *   · CONFIG                  — configurações de runtime
 *   · EVALUATOR_FIELDS        — campos do formulário inicial
 *   · APPS                    — ambientes em avaliação (VIDA XR, etc.)
 *   · TASKS                   — tarefas indexadas por id de aplicação
 *   · EVALUATION_PHASES       — Exploração Livre vs Modo Tarefa
 *   · SEVERITY_LEVELS         — níveis de severidade 0–4
 *   · SPECIFICITY_LEVELS      — níveis de especificidade 0–4
 *   · SET_TYPES               — mapeia chaves de HEURISTIC_SETS para 'control'|'domain'
 *   · PROBLEM_CLASSIFICATIONS — etiquetas P* / PD / PC, filtradas por set ativo
 *   · S                       — design tokens Tailwind (sistema BLAU)
 *
 * ── Como personalizar ────────────────────────────────────────────────
 * · Adicione/renomeie aplicações em APPS — as chaves de TASKS devem bater.
 * · Adicione novas tarefas em TASKS sem mexer no código do app.
 * · Ajuste classificações ou níveis editando os arrays abaixo.
 * · Repinte o app inteiro pelo objeto S.
 * ─────────────────────────────────────────────────────────────────────
 */

// ── Configurações de runtime ──────────────────────────────────────────
const CONFIG = {
  version:   'Heat v2.0 © 2026',
  author:    'Saul Ossorio',
  authorUrl: 'https://saulossorio.com',

  /**
   * URL de implantação do Google Apps Script.
   * Deixe vazio para desativar o botão "Enviar Resultados".
   */
  googleSheetsUrl: 'https://script.google.com/macros/s/AKfycbzL2-bL63HAZhFd-4qveE5P9nMT1ZSE6pkf2McAo9P1uzmMIEdvfFbU_RPbWklFMajF/exec',

  /**
   * Mostrar o expansor "Ver exemplo de imagem" nos cartões de heurística.
   *
   * Mantido como flag temporária: hoje não há imagens em images/, então o
   * expansor está oculto para evitar o estado vazio no modal de detalhe.
   * Quando quiser voltar a usar (depois de adicionar arquivos seguindo a
   * convenção images/{set}-{id}-good.jpg / -bad.jpg), basta trocar para true.
   */
  showImageExamples: false,
};

// ── Campos do avaliador ───────────────────────────────────────────────
const EVALUATOR_FIELDS = [
  {
    id:          'name',
    label:       'Seu nome',
    required:    true,
    placeholder: 'Digite seu nome completo',
  },
  {
    id:          'project',
    label:       'Nome do projeto',
    required:    false,
    placeholder: 'Digite o nome do projeto ou produto',
  },
];

// ── Aplicações em avaliação ───────────────────────────────────────────
// Cada entrada é um ambiente imersivo a ser avaliado.
// `id` deve corresponder a uma chave em TASKS.
const APPS = [
  {
    id:          'vida-xr',
    name:        'VIDA XR',
    description: 'Aplicativo de educação odontológica em realidade mista.',
  },
  {
    id:          'human-anatomy-vr',
    name:        'Human Anatomy VR',
    description: 'Anatomia humana interativa em VR/MR com múltiplos sistemas e animações.',
  },
];

// ── Tarefas por aplicação ─────────────────────────────────────────────
// Fonte: Lista de Tarefas (Versão Final)
const TASKS = {
  'vida-xr': [
    { 
      id: 'vx-1', 
      name: 'Seleção do dente problemático', 
      duration: '10 min', 
      description: 'Retire um dos dentes sinalizados na placa dentária usando manipulação direta com as mãos. Explore as opções de inspeção, aplique cortes transversais e altere a opacidade das camadas.' 
    },
    { 
      id: 'vx-2', 
      name: 'Inspeção espacial e manipulação', 
      duration: '10 min', 
      description: 'Rotacione o dente 360 graus, aumente a escala do modelo até ocupar a maior parte do campo de visão e, em seguida, reduza sua escala até voltar ao tamanho real.' 
    },
    { 
      id: 'vx-3', 
      name: 'Exploração interna do dente', 
      duration: '8 min', 
      description: 'Com o dente retirado, use os controles de opacidade para identificar o canal.' 
    },
    { 
      id: 'vx-4', 
      name: 'Comparação de visualizações', 
      duration: '8 min', 
      description: 'Recoloque o primeiro dente na placa e selecione um segundo dente problemático. Inspecione-o e busque perceber diferenças em relação ao primeiro.' 
    },
    { 
      id: 'vx-5', 
      name: 'Estado pós-tratamento e conclusão', 
      duration: '7 min', 
      description: 'Acesse a visualização do dente "curado" ou a solução clínica. Avalie como o app comunica o desfecho e a conclusão da experiência.' 
    },
  ],
  'human-anatomy-vr': [
    { 
      id: 'ha-1', 
      name: 'Navegação entre sistemas', 
      duration: '6 min', 
      description: 'Ative primeiro o sistema esquelético, depois mude para o muscular e, por fim, para o sistema nervoso (Artérias e Veias). Mantenha o corpo humano completo visível em cada etapa.' 
    },
    { 
      id: 'ha-2', 
      name: 'Seleção e inspeção do coração', 
      duration: '12 min', 
      description: 'Localize o coração no sistema circulatório, isole sua visualização, aumente a escala do órgão e desdobre-o. Identifique a Aorta ascendente e acesse as informações textuais.' 
    },
    { 
      id: 'ha-3', 
      name: 'Manipulação do cérebro', 
      duration: '10 min', 
      description: 'Localize o cérebro no sistema nervoso e isole o órgão. Gire-o 360 graus, aumente a escala para o máximo campo de visão e retorne ao contexto do corpo completo.' 
    },
    { 
      id: 'ha-4', 
      name: 'Busca e visualização do nervo ciático', 
      duration: '8 min', 
      description: 'Utilize a ferramenta de busca para localizar o nervo ciático. Acesse sua visualização específica e a documentação correspondente.' 
    },
    { 
      id: 'ha-5', 
      name: 'Animação de supinação do antebraço', 
      duration: '10 min', 
      description: 'Acesse "Animações", selecione a supinação do antebraço e observe três ciclos completos. Faça hover sobre as estruturas para localizar o osso Rádio durante o movimento.' 
    },
  ],
};

// ── Fases da avaliação ────────────────────────────────────────────────
const EVALUATION_PHASES = {
  exploratory: { id: 'exploratory', label: 'Exploração Livre', color: 'bg-sky-100 text-sky-700 border-sky-200',         dotColor: 'bg-sky-500'    },
  tasks:       { id: 'tasks',       label: 'Modo Tarefa',      color: 'bg-violet-100 text-violet-700 border-violet-200', dotColor: 'bg-violet-500' },
};

// ── Níveis de severidade ──────────────────────────────────────────────
const SEVERITY_LEVELS = [
  { level: 0, label: 'Nenhum',    color: 'bg-slate-400',   textColor: 'text-white'     },
  { level: 1, label: 'Cosmético', color: 'bg-emerald-500', textColor: 'text-white'     },
  { level: 2, label: 'Menor',     color: 'bg-amber-400',   textColor: 'text-slate-800' },
  { level: 3, label: 'Maior',     color: 'bg-orange-500',  textColor: 'text-white'     },
  { level: 4, label: 'Crítico',   color: 'bg-red-600',     textColor: 'text-white'     },
];

// ── Coeficiente de especificidade (0–4) ───────────────────────────────
// Quão específica a heurística violada é em relação ao problema observado.
const SPECIFICITY_LEVELS = [
  { level: 0, label: 'Nenhum',     color: 'bg-slate-400',   textColor: 'text-white'     },
  { level: 1, label: 'Baixo',      color: 'bg-cyan-500',    textColor: 'text-white'     },
  { level: 2, label: 'Moderado',   color: 'bg-teal-500',    textColor: 'text-white'     },
  { level: 3, label: 'Alto',       color: 'bg-indigo-500',  textColor: 'text-white'     },
  { level: 4, label: 'Muito Alto', color: 'bg-purple-600',  textColor: 'text-white'     },
];

// ── Tipo de cada conjunto de heurísticas ──────────────────────────────
// Mapeia a chave em HEURISTIC_SETS para o "lado" do estudo:
//   · 'control' → conjunto de controle (Nielsen / clássicas)
//   · 'domain'  → conjunto específico do domínio AAVI
// Usado para filtrar PROBLEM_CLASSIFICATIONS — só faz sentido oferecer
// "Apenas Domínio" quando o avaliador está usando o conjunto de domínio,
// e vice-versa.
const SET_TYPES = {
  nielsen: 'control',
  domain:  'domain',
};

// ── Classificação do problema ─────────────────────────────────────────
// `scope` define em qual conjunto a opção aparece:
//   · 'common'  → sempre disponível (P*)
//   · 'control' → só aparece quando o set ativo é do tipo 'control'
//   · 'domain'  → só aparece quando o set ativo é do tipo 'domain'
const PROBLEM_CLASSIFICATIONS = [
  { id: 'P*', label: 'Problema Comum',  code: 'P*', scope: 'common',  description: 'Detectado por ambos os conjuntos de heurísticas (Domínio e Controle).',     color: 'bg-slate-100 text-slate-700 border-slate-300' },
  { id: 'PD', label: 'Apenas Domínio',  code: 'PD', scope: 'domain',  description: 'Detectado apenas pelas heurísticas de Domínio (AAVIs).',                    color: 'bg-amber-100 text-amber-700 border-amber-300' },
  { id: 'PC', label: 'Apenas Controle', code: 'PC', scope: 'control', description: 'Detectado apenas pelas heurísticas de Controle (Nielsen).',                 color: 'bg-indigo-100 text-indigo-700 border-indigo-300' },
];

// ── Design tokens (classes Tailwind) ──────────────────────────────────
// Estética do design system BLAU:
//   · superfícies brancas e calmas, sem gradientes;
//   · cabeçalhos em Raleway (font-display), corpo em Open Sans;
//   · pílulas arredondadas em vez de retângulos para ações primárias;
//   · acento azul único (#0071C5) com hover por mudança de borda.
const S = {
  page:         'min-h-screen overflow-x-hidden bg-white flex flex-col',
  container:    'flex-1 flex flex-col w-full max-w-5xl mx-auto p-4 md:p-6',
  card:         'bg-white border border-slate-200 rounded-xl',
  heading1:     'font-display text-3xl md:text-5xl font-bold text-slate-800 tracking-tight',
  heading2:     'font-display text-xl md:text-2xl font-semibold text-slate-800',
  textBase:     'text-base md:text-lg text-slate-600 leading-relaxed',
  textMuted:    'text-sm md:text-base text-slate-400',
  label:        'text-base md:text-lg font-semibold text-slate-700',
  btn:          'transition-all duration-200 ease-out cursor-pointer',
  btnHover:     'hover:border-blue-500 active:opacity-90',
  btnPrimary:   'bg-blue-500 text-white font-semibold border-[1.5px] border-blue-500 hover:border-blue-600',
  btnSecondary: 'bg-white text-slate-600 font-medium border-[1.5px] border-slate-200 hover:border-blue-500 hover:text-blue-500',
  btnOutline:   'bg-white border-[1.5px] border-blue-500 text-blue-500 font-semibold hover:bg-blue-50',
  btnDanger:    'bg-white border-[1.5px] border-red-300 text-red-500 font-semibold hover:border-red-500 hover:bg-red-50',
  btnSize:      'py-3 px-7 rounded-full text-base md:text-lg min-h-[56px] tracking-wide',
  input:        'w-full p-4 rounded-xl border-[1.5px] border-slate-200 text-base md:text-lg text-slate-700 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400',
  inputError:   'border-red-400',
  accent:       'bg-blue-500 text-white font-bold',
};
