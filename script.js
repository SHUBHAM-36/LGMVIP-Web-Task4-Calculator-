const calculator = {
    displayValue: '',
    equation: '',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
};

function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = calculator;

    if (waitingForSecondOperand) {
        calculator.displayValue = digit;
        calculator.waitingForSecondOperand = false;
    } else {
        calculator.displayValue = displayValue === '' ? digit : displayValue + digit;
    }

    calculator.equation += digit;
}

function inputDecimal(dot) {
    if (calculator.waitingForSecondOperand) return;

    if (!calculator.displayValue.includes(dot)) {
        calculator.displayValue += dot;
        calculator.equation += dot;
    }
}

function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator } = calculator;
    const inputValue = parseFloat(displayValue);

    if (operator && calculator.waitingForSecondOperand) {
        calculator.operator = nextOperator;
        calculator.equation = calculator.equation.slice(0, -1) + nextOperator;
        return;
    }

    if (nextOperator === '=') {
        if (firstOperand != null && operator) {
            const result = performCalculation[operator](firstOperand, inputValue);
            calculator.displayValue = String(result);
            calculator.firstOperand = null;
            calculator.operator = null;
            calculator.equation = String(result);
        }
    } else {
        if (firstOperand == null && !isNaN(inputValue)) {
            calculator.firstOperand = inputValue;
        } else if (operator) {
            const result = performCalculation[operator](firstOperand, inputValue);
            calculator.displayValue = String(result);
            calculator.firstOperand = result;
        }

        calculator.waitingForSecondOperand = true;
        calculator.operator = nextOperator;
        calculator.equation += nextOperator;
    }
}

const performCalculation = {
    '/': (firstOperand, secondOperand) => firstOperand / secondOperand,
    '*': (firstOperand, secondOperand) => firstOperand * secondOperand,
    '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
    '-': (firstOperand, secondOperand) => firstOperand - secondOperand,
    '=': (firstOperand, secondOperand) => secondOperand
};

function resetCalculator() {
    calculator.displayValue = '';
    calculator.equation = '';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
    console.log("Calculator reset"); 
    updateDisplay();  
}

function updateDisplay() {
    const display = document.querySelector('.calculator-screen');
    display.value = calculator.equation || '0';
}

updateDisplay();

const keys = document.querySelector('.calculator-keys');
keys.addEventListener('click', (event) => {
    const { target } = event;
    const { value } = target;

    if (!target.matches('button')) {
        return;
    }

    console.log('Button clicked: ${value}'); 

    switch (value) {
        case '+':
        case '-':
        case '*':
        case '/':
        case '=':
            handleOperator(value);
            break;
        case '.':
            inputDecimal(value);
            break;
        case 'all-clear':
            resetCalculator();
            break;
        default:
            if (Number.isInteger(parseFloat(value))) {
                inputDigit(value);
            }
    }

    updateDisplay();
});

const allClearButton = document.querySelector('.all-clear');
allClearButton.addEventListener('click', (event) => {
    console.log("Clear button clicked"); 
    resetCalculator();
});