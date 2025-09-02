// Dark Mode Toggle JavaScript

// Create and insert the toggle button
function createThemeToggle() {
    const toggleButton = document.createElement('button');
    toggleButton.className = 'theme-toggle';
    toggleButton.innerHTML = '<i class="fas fa-moon"></i>';
    toggleButton.setAttribute('aria-label', 'Toggle dark mode');
    toggleButton.setAttribute('title', 'Toggle dark/light mode');

    document.body.appendChild(toggleButton);
    return toggleButton;
}

// Initialize dark mode functionality
function initDarkMode() {
    const toggleButton = createThemeToggle();

    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Use saved theme, or system preference if no saved theme
    const initialTheme = savedTheme === 'system' ? (systemPrefersDark ? 'dark' : 'light') : savedTheme;

    // Apply initial theme
    setTheme(initialTheme);
    updateToggleButton(toggleButton, initialTheme);

    // Add click event listener
    toggleButton.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        setTheme(newTheme);
        updateToggleButton(toggleButton, newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'system') {
            const newTheme = e.matches ? 'dark' : 'light';
            setTheme(newTheme);
            updateToggleButton(toggleButton, newTheme);
        }
    });
}

// Set theme function
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    // Update meta theme-color for mobile browsers
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.name = 'theme-color';
        document.head.appendChild(metaThemeColor);
    }

    metaThemeColor.content = theme === 'dark' ? '#1a202c' : '#ffffff';
}

// Update toggle button appearance
function updateToggleButton(button, theme) {
    button.innerHTML = theme === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    button.setAttribute('title', `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`);
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDarkMode);
} else {
    initDarkMode();
}

// End of script.js
let transactions = [];

function addTransaction() {
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;

    if (description === "" || isNaN(amount)) {
        alert("Please enter a valid description and amount.");
        return;
    }

    const transaction = {
        description,
        amount,
        type
    };

    transactions.push(transaction); // ✅ fixed
    updateUI();
    updateCharts();
}

function updateUI() {
    const transactionList = document.getElementById('transaction-list');
    const balance = document.getElementById('balance');

    transactionList.innerHTML = "";
    let totalBalance = 0;

    transactions.forEach((txn, index) => {   // ✅ fixed
        const li = document.createElement('li');
        li.innerHTML = `${txn.description}: <span><i class="fa-solid fa-indian-rupee-sign"></i> ${txn.amount.toFixed(2)} (${txn.type})</span> <button onclick="removeTransaction(${index})"><i class="fas fa-trash"></i></button>`;
        if (txn.type === 'income') {
            totalBalance += txn.amount;
            li.style.color = 'green';
        } else {
            totalBalance -= txn.amount;
            li.style.color = 'red';
        }
        transactionList.appendChild(li);
    });

    balance.innerText = `${totalBalance.toFixed(2)}`;
}

// ✅ moved outside so it can be accessed globally
function removeTransaction(index) {
    transactions.splice(index, 1);
    updateUI();
    updateCharts();
}

// ✅ chart initialized once
const ctx = document.getElementById('balance-chart').getContext('2d');
let chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ['Income', 'Expense'],
        datasets: [{
            label: 'Financial Overview',
            data: [0, 0],
            backgroundColor: ['#4caf50', '#f44336']
        }]
    }
});

function updateCharts() {
    let income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    let expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    chart.data.datasets[0].data = [income, expense];
    chart.update();
}
