const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');
let expression = '';

function updateDisplay(value) {
  display.textContent = value || '0';
}

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.dataset.value;

    if (value === 'C') {
      expression = '';
      updateDisplay(expression);
      return;
    }

    if (value === '←') {
      expression = expression.slice(0, -1);
      updateDisplay(expression);
      return;
    }

    if (value === '=') {
      try {
        const result = eval(expression.replace(/×/g, '*').replace(/÷/g, '/'));
        expression = String(result);
        updateDisplay(expression);
      } catch {
        expression = '';
        updateDisplay('Error');
      }
      return;
    }

    expression += value;
    updateDisplay(expression);
  });
});