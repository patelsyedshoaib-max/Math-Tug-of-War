import { DifficultyLevel, MathQuestion } from '../types/game';

let questionCounter = 0;

export function generateMathQuestion(difficulty: DifficultyLevel): MathQuestion {
  questionCounter++;
  const id = `q_${questionCounter}_${Date.now()}`;
  let operator: '+' | '-' | '×' | '÷' = '+';
  let num1 = 1;
  let num2 = 1;
  let answer = 2;

  if (difficulty === 'EASY') {
    // Addition and Subtraction within 20
    const isAdd = Math.random() > 0.4; // 60% Addition, 40% Subtraction
    if (isAdd) {
      operator = '+';
      num1 = Math.floor(Math.random() * 12) + 1;
      num2 = Math.floor(Math.random() * 12) + 1;
      answer = num1 + num2;
    } else {
      operator = '-';
      num1 = Math.floor(Math.random() * 15) + 5;
      num2 = Math.floor(Math.random() * num1) + 1; // Always positive answer
      answer = num1 - num2;
    }
  } else if (difficulty === 'MEDIUM') {
    // Multiplication (up to 10x10) and Division (up to 100/10)
    const rand = Math.random();
    if (rand < 0.35) {
      operator = '+';
      num1 = Math.floor(Math.random() * 40) + 10;
      num2 = Math.floor(Math.random() * 40) + 10;
      answer = num1 + num2;
    } else if (rand < 0.65) {
      operator = '×';
      num1 = Math.floor(Math.random() * 9) + 2;
      num2 = Math.floor(Math.random() * 9) + 2;
      answer = num1 * num2;
    } else {
      operator = '÷';
      const divisor = Math.floor(Math.random() * 8) + 2;
      const quotient = Math.floor(Math.random() * 9) + 2;
      num1 = divisor * quotient;
      num2 = divisor;
      answer = quotient;
    }
  } else if (difficulty === 'HARD') {
    // Multi-digit arithmetic, multiplication up to 12x12, division up to 144
    const rand = Math.random();
    if (rand < 0.25) {
      operator = '+';
      num1 = Math.floor(Math.random() * 80) + 20;
      num2 = Math.floor(Math.random() * 80) + 20;
      answer = num1 + num2;
    } else if (rand < 0.5) {
      operator = '-';
      num1 = Math.floor(Math.random() * 90) + 30;
      num2 = Math.floor(Math.random() * (num1 - 10)) + 10;
      answer = num1 - num2;
    } else if (rand < 0.75) {
      operator = '×';
      num1 = Math.floor(Math.random() * 11) + 3;
      num2 = Math.floor(Math.random() * 11) + 3;
      answer = num1 * num2;
    } else {
      operator = '÷';
      const divisor = Math.floor(Math.random() * 10) + 2;
      const quotient = Math.floor(Math.random() * 11) + 2;
      num1 = divisor * quotient;
      num2 = divisor;
      answer = quotient;
    }
  } else {
    // MIXED: Equal distribution of all four operators
    const operators: ('+' | '-' | '×' | '÷')[] = ['+', '-', '×', '÷'];
    operator = operators[Math.floor(Math.random() * operators.length)];

    switch (operator) {
      case '+':
        num1 = Math.floor(Math.random() * 30) + 5;
        num2 = Math.floor(Math.random() * 30) + 5;
        answer = num1 + num2;
        break;
      case '-':
        num1 = Math.floor(Math.random() * 50) + 15;
        num2 = Math.floor(Math.random() * num1) + 1;
        answer = num1 - num2;
        break;
      case '×':
        num1 = Math.floor(Math.random() * 10) + 2;
        num2 = Math.floor(Math.random() * 10) + 2;
        answer = num1 * num2;
        break;
      case '÷':
        const div = Math.floor(Math.random() * 9) + 2;
        const quot = Math.floor(Math.random() * 9) + 2;
        num1 = div * quot;
        num2 = div;
        answer = quot;
        break;
    }
  }

  return {
    id,
    num1,
    num2,
    operator,
    answer,
    displayText: `${num1} ${operator} ${num2} = ?`,
    createdAt: Date.now(),
  };
}
