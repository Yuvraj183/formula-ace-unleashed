export type Subject = 'physics' | 'chemistry' | 'mathematics';

export interface TableData {
  headers: string[];
  rows: string[][];
}

export interface Formula {
  id: string;
  title: string;
  latex: string;
  explanation?: string;
  where?: string;
  diagrams?: string[];
  table?: TableData;
}

export interface Example {
  id: string;
  question: string;
  solution: string;
  isJeeAdvanced?: boolean;
  diagrams?: string[];
}

export interface Concept {
  id: string;
  title: string;
  content: string;
  diagrams?: string[];
  table?: TableData;
}

export interface Chapter {
  id: string;
  title: string;
  subject: Subject;
  concepts: Concept[];
  formulas: Formula[];
  examples: Example[];
  order: number;
}

export interface ChatMessage {
  id?: string;
  content: string;
  isUser: boolean;
  timestamp?: number;
}

export interface ChatThread {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

export interface TodoTask {
  id: string;
  text: string;
  completed: boolean;
  date: string; // ISO string
}

export interface SubjectData {
  name: string;
  description: string;
  icon: string;
  color: string;
  bgClass: string;
}

export const SUBJECTS: Record<Subject, SubjectData> = {
  physics: {
    name: 'Physics',
    description: 'Mechanics, Electromagnetism, Optics, Modern Physics and more',
    icon: '⚛️',
    color: 'text-physics-dark',
    bgClass: 'physics-card'
  },
  chemistry: {
    name: 'Chemistry',
    description: 'Organic, Inorganic, Physical Chemistry and more',
    icon: '🧪',
    color: 'text-chemistry-dark',
    bgClass: 'chemistry-card'
  },
  mathematics: {
    name: 'Mathematics',
    description: 'Calculus, Algebra, Coordinate Geometry, Trigonometry and more',
    icon: '📐',
    color: 'text-maths-dark',
    bgClass: 'maths-card'
  }
};

export const INITIAL_CHAPTERS: Chapter[] = [
  {
    id: 'phys-kinematics',
    title: 'Kinematics',
    subject: 'physics',
    concepts: [
      {
        id: 'concept-1',
        title: 'Position and Displacement',
        content: 'Position refers to the location of an object relative to a reference point. Displacement is the change in position of an object, defined as the shortest distance from the initial to the final position. It is a vector quantity, having both magnitude and direction.'
      },
      {
        id: 'concept-2',
        title: 'Velocity and Acceleration',
        content: 'Velocity is the rate of change of position with respect to time. It is a vector quantity. Acceleration is the rate of change of velocity with respect to time. It is also a vector quantity.'
      }
    ],
    formulas: [
      {
        id: 'formula-1',
        title: 'Displacement Formula',
        latex: '\\vec{s} = \\vec{r}_f - \\vec{r}_i',
        explanation: 'Displacement is the change in position of an object, calculated as the final position minus the initial position.',
        where: 'Used in problems involving motion along a straight line or curved path.'
      },
      {
        id: 'formula-2',
        title: 'Velocity Formula',
        latex: '\\vec{v} = \\frac{d\\vec{r}}{dt}',
        explanation: 'Velocity is the rate of change of position with respect to time, equal to the derivative of position with respect to time.',
        where: 'Used in problems involving motion with varying speeds or directions.'
      },
      {
        id: 'formula-3',
        title: 'Acceleration Formula',
        latex: '\\vec{a} = \\frac{d\\vec{v}}{dt}',
        explanation: 'Acceleration is the rate of change of velocity with respect to time, equal to the derivative of velocity with respect to time.',
        where: 'Used in problems involving non-uniform motion or when forces are applied to objects.'
      },
      {
        id: 'formula-4',
        title: 'Equations of Motion (Constant Acceleration)',
        latex: '\\begin{align} v &= u + at \\\\ s &= ut + \\frac{1}{2}at^2 \\\\ v^2 &= u^2 + 2as \\end{align}',
        explanation: 'These equations relate displacement (s), initial velocity (u), final velocity (v), acceleration (a), and time (t) for motion with constant acceleration.',
        where: 'Used in problems involving free fall, projectile motion, or any motion with constant acceleration.'
      }
    ],
    examples: [
      {
        id: 'example-1',
        question: 'A car travels with a constant speed of 20 m/s for 10 seconds. What is the displacement of the car?',
        solution: 'Using the formula s = v × t, where v is the velocity and t is the time:\ns = 20 m/s × 10 s = 200 m\nTherefore, the displacement of the car is 200 meters.',
        isJeeAdvanced: false
      },
      {
        id: 'example-2',
        question: 'A particle moves along the x-axis such that its position is given by x = 3t² - 2t + 5, where x is in meters and t is in seconds. Find the velocity and acceleration of the particle at t = 2s.',
        solution: 'To find the velocity, we need to differentiate the position function with respect to time:\nv = dx/dt = d(3t² - 2t + 5)/dt = 6t - 2\nAt t = 2s, v = 6(2) - 2 = 12 - 2 = 10 m/s\n\nTo find the acceleration, we differentiate the velocity function:\na = dv/dt = d(6t - 2)/dt = 6\nSo the acceleration is constant at 6 m/s².',
        isJeeAdvanced: true
      }
    ],
    order: 1
  },
  {
    id: 'chem-atomic',
    title: 'Atomic Structure',
    subject: 'chemistry',
    concepts: [
      {
        id: 'concept-1',
        title: 'Atomic Models',
        content: 'Various models have been proposed to explain the structure of atoms, including the Thomson model (plum pudding model), the Rutherford model (planetary model), and the Bohr model (orbital model).'
      }
    ],
    formulas: [
      {
        id: 'formula-1',
        title: 'Energy of an Electron in nth Orbit',
        latex: 'E_n = -\\frac{13.6}{n^2} \\, \\text{eV}',
        explanation: 'This formula gives the energy of an electron in the nth orbit of a hydrogen atom, where n is the principal quantum number.',
        where: 'Used in problems involving atomic spectra and electron transitions.'
      }
    ],
    examples: [
      {
        id: 'example-1',
        question: 'Calculate the energy of an electron in the second orbit of a hydrogen atom.',
        solution: 'Using the formula E_n = -13.6/n² eV, where n is the principal quantum number:\nFor n = 2, E_2 = -13.6/2² = -13.6/4 = -3.4 eV\nTherefore, the energy of an electron in the second orbit of a hydrogen atom is -3.4 eV.',
        isJeeAdvanced: false
      }
    ],
    order: 1
  },
  {
    id: 'math-calculus',
    title: 'Differential Calculus',
    subject: 'mathematics',
    concepts: [
      {
        id: 'concept-1',
        title: 'Limits',
        content: 'A limit is the value that a function approaches as the input approaches a certain value. It is denoted as lim x→a f(x) = L, which means that as x approaches a, the function f(x) approaches the value L.'
      },
      {
        id: 'concept-2',
        title: 'Derivatives',
        content: 'A derivative is a measure of how a function changes as its input changes. It is the instantaneous rate of change of a function with respect to one of its variables. The derivative of a function f with respect to x is denoted as f\'(x) or df/dx.'
      }
    ],
    formulas: [
      {
        id: 'formula-1',
        title: 'Definition of Derivative',
        latex: 'f\'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}',
        explanation: 'This is the formal definition of a derivative, representing the instantaneous rate of change of the function f at the point x.',
        where: 'Used to derive differentiation rules and understand the concept of derivatives.'
      },
      {
        id: 'formula-2',
        title: 'Power Rule',
        latex: '\\frac{d}{dx}[x^n] = nx^{n-1}',
        explanation: 'The derivative of x raised to the power n is equal to n times x raised to the power n-1.',
        where: 'Used to differentiate polynomial functions and other functions involving powers of x.'
      }
    ],
    examples: [
      {
        id: 'example-1',
        question: 'Find the derivative of f(x) = 3x² - 2x + 5.',
        solution: 'Using the power rule and linearity of differentiation:\nf\'(x) = d/dx(3x²) - d/dx(2x) + d/dx(5)\nf\'(x) = 3 · 2x¹ - 2 · 1 + 0\nf\'(x) = 6x - 2\nTherefore, the derivative of f(x) = 3x² - 2x + 5 is f\'(x) = 6x - 2.',
        isJeeAdvanced: false
      }
    ],
    order: 1
  }
];

export const SAMPLE_CHAT_THREAD: ChatThread = {
  id: 'thread-1',
  title: 'Help with Kinematics Problem',
  messages: [
    {
      id: 'msg-1',
      content: "I'm having trouble understanding how to solve this problem: A car accelerates uniformly from rest to 20 m/s in 10 seconds. How far does it travel?",
      isUser: true,
      timestamp: Date.now() - 3600000
    },
    {
      id: 'msg-2',
      content: "Let me help you solve this problem step by step.\n\nWe know:\n- Initial velocity u = 0 m/s (the car starts from rest)\n- Final velocity v = 20 m/s\n- Time taken t = 10 s\n\nWe need to find the distance traveled.\n\nWe can use the equation of motion: $s = ut + \\frac{1}{2}at^2$\n\nFirst, let's find the acceleration:\nUsing $v = u + at$, we get:\n$20 = 0 + a \\times 10$\n$a = 2$ m/s²\n\nNow we can use this acceleration in our distance equation:\n$s = 0 \\times 10 + \\frac{1}{2} \\times 2 \\times 10^2$\n$s = 0 + \\frac{1}{2} \\times 2 \\times 100$\n$s = 100$ meters\n\nTherefore, the car travels 100 meters in 10 seconds.",
      isUser: false,
      timestamp: Date.now() - 3540000
    }
  ],
  createdAt: Date.now() - 3540000,
  updatedAt: Date.now() - 3540000
};

export const INITIAL_TODOS: TodoTask[] = [
  {
    id: 'todo-1',
    text: 'Review Physics Kinematics chapter',
    completed: false,
    date: new Date().toISOString().split('T')[0]
  },
  {
    id: 'todo-2',
    text: 'Solve 10 JEE problems on Calculus',
    completed: true,
    date: new Date().toISOString().split('T')[0]
  }
];
