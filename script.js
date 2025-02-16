const balanceElement = document.getElementById("balance");
const transactionForm = document.getElementById("transaction-form");
const transactionList = document.getElementById("transaction-list");
const chartCanvas = document.getElementById("chart");
const themeButton = document.getElementById("theme-button");
const goalForm = document.getElementById("goal-form");
const goalsList = document.getElementById("goals-list");
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let goals = JSON.parse(localStorage.getItem("goals")) || [];

// Initialize Chart
let chart;
function initChart() {
    chart = new Chart(chartCanvas, {
        type: 'pie',
        data: {
            labels: ['Income', 'Expense'],
            datasets: [{
                data: [0, 0],
                backgroundColor: ['#2d7a4c', '#e74c3c'],
            }]
        }
    });
}

// Update Chart Data
function updateChart() {
    let income = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
    let expense = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
    
    chart.data.datasets[0].data = [income, expense];
    chart.update();
}

// Update Balance
function updateBalance() {
    let balance = transactions.reduce((sum, t) => t.type === "income" ? sum + t.amount : sum - t.amount, 0);
    balanceElement.innerText = `₹${balance.toFixed(2)}`;
}

// Render Transactions
function renderTransactions() {
    transactionList.innerHTML = "";
    transactions.forEach((transaction, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${transaction.desc} - ₹${transaction.amount}
            <span class="${transaction.type}">${transaction.type.toUpperCase()}</span>
            <button onclick="deleteTransaction(${index})">❌</button>
        `;
        transactionList.appendChild(li);
    });

    updateBalance();
    updateChart();
}

// Add Transaction
transactionForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const desc = document.getElementById("desc").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const category = document.getElementById("category").value;

    if (!desc || !amount) {
        alert("Please enter valid data.");
        return;
    }

    transactions.push({ desc, amount, type: category });
    localStorage.setItem("transactions", JSON.stringify(transactions));

    transactionForm.reset();
    renderTransactions();
});

// Delete Transaction
function deleteTransaction(index) {
    transactions.splice(index, 1);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    renderTransactions();
}

// Theme Toggle
themeButton.addEventListener("click", () => {
    document.body.dataset.theme = document.body.dataset.theme === "dark" ? "light" : "dark";
    themeButton.textContent = document.body.dataset.theme === "dark" ? "☀️" : "🌙";
    localStorage.setItem("theme", document.body.dataset.theme);
});

// Load saved theme
document.body.dataset.theme = localStorage.getItem("theme") || "light";
themeButton.textContent = document.body.dataset.theme === "dark" ? "☀️" : "🌙";

// Budgeting Goals
function renderGoals() {
    goalsList.innerHTML = "";
    goals.forEach((goal, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${goal.text}</span>
            <div>
                <button onclick="toggleGoal(${index})" class="goal-btn">
                    ${goal.completed ? "↩️" : "✅"}
                </button>
                <button onclick="deleteGoal(${index})" class="goal-btn">❌</button>
            </div>
        `;
        if (goal.completed) li.classList.add("completed");
        goalsList.appendChild(li);
    });
}

goalForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const goalText = document.getElementById("goal-text").value.trim();
    if (goalText) {
        goals.push({ text: goalText, completed: false });
        localStorage.setItem("goals", JSON.stringify(goals));
        document.getElementById("goal-text").value = "";
        renderGoals();
    }
});

function toggleGoal(index) {
    goals[index].completed = !goals[index].completed;
    localStorage.setItem("goals", JSON.stringify(goals));
    renderGoals();
}

function deleteGoal(index) {
    goals.splice(index, 1);
    localStorage.setItem("goals", JSON.stringify(goals));
    renderGoals();
}

// Initialize App
initChart();
renderTransactions();
renderGoals();
