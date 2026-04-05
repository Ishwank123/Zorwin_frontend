/* ======================
   STATE
====================== */

let state = {

role: "viewer",

editIndex: null,

transactions:
JSON.parse(
localStorage.getItem("transactions")
) || []

};


/* ======================
   SAVE TO STORAGE
====================== */

function saveToStorage() {

localStorage.setItem(
"transactions",
JSON.stringify(state.transactions)
);

}


/* ======================
   DARK MODE
====================== */

document
.getElementById("darkToggle")
.onclick = () => {

document.body.classList.toggle(
"dark"
);

};


/* ======================
   ROLE SWITCH
====================== */

document
.getElementById("roleSelector")
.onchange = e => {

state.role = e.target.value;

updateRoleUI();

};


function updateRoleUI() {

document
.querySelectorAll(".admin-only")
.forEach(el => {

el.style.display =
state.role === "admin"
? "table-cell"
: "none";

});

}


/* ======================
   MODAL
====================== */

const modal =
document.getElementById("modal");

document
.getElementById("addBtn")
.onclick = () => {

state.editIndex = null;

modal.style.display = "block";

};


document
.getElementById("closeBtn")
.onclick = () => {

modal.style.display = "none";

};


document
.getElementById("saveBtn")
.onclick = () => {

let t = {

date:
document
.getElementById("dateInput")
.value,

category:
document
.getElementById("categoryInput")
.value,

type:
document
.getElementById("typeInput")
.value,

amount:
Number(
document
.getElementById("amountInput")
.value
)

};

if (state.editIndex !== null) {

state.transactions[
state.editIndex
] = t;

}

else {

state.transactions.push(t);

}

saveToStorage();

modal.style.display = "none";

renderAll();

};


/* ======================
   DELETE
====================== */

function deleteTransaction(i) {

state.transactions.splice(i,1);

saveToStorage();

renderAll();

}


/* ======================
   EDIT
====================== */

function editTransaction(i) {

let t = state.transactions[i];

document.getElementById("dateInput").value = t.date;

document.getElementById("categoryInput").value = t.category;

document.getElementById("typeInput").value = t.type;

document.getElementById("amountInput").value = t.amount;

state.editIndex = i;

modal.style.display = "block";

}


/* ======================
   TABLE
====================== */

function renderTable() {

let tbody =
document.getElementById(
"transactionTable"
);

tbody.innerHTML = "";

state.transactions.forEach(
(t,i) => {

let row =
document.createElement("tr");

row.innerHTML = `

<td>${t.date}</td>
<td>${t.category}</td>
<td>${t.type}</td>
<td>₹${t.amount}</td>

<td class="admin-only">

<button onclick="editTransaction(${i})">
Edit
</button>

<button onclick="deleteTransaction(${i})">
Delete
</button>

</td>

`;

tbody.appendChild(row);

});

}


/* ======================
   SUMMARY
====================== */

function updateSummary() {

let income = 0;
let expense = 0;

state.transactions.forEach(t => {

if (t.type === "income")
income += t.amount;
else
expense += t.amount;

});

document
.getElementById("totalIncome")
.textContent = "₹" + income;

document
.getElementById("totalExpense")
.textContent = "₹" + expense;

document
.getElementById("totalBalance")
.textContent =
"₹" + (income - expense);

}


/* ======================
   CHARTS (Chart.js)
====================== */

let lineChart;
let pieChart;

function renderCharts() {

let dates =
state.transactions.map(t => t.date);

let amounts =
state.transactions.map(t => t.amount);

if (lineChart)
lineChart.destroy();

lineChart =
new Chart(
document.getElementById("lineChart"),
{

type: "line",

data: {

labels: dates,

datasets: [{

label: "Amount",

data: amounts

}]

}

});

let expenseData = {};

state.transactions.forEach(t => {

if (t.type === "expense") {

expenseData[t.category] =
(expenseData[t.category] || 0)
+ t.amount;

}

});

if (pieChart)
pieChart.destroy();

pieChart =
new Chart(
document.getElementById("pieChart"),
{

type: "pie",

data: {

labels:
Object.keys(expenseData),

datasets: [{

data:
Object.values(expenseData)

}]

}

});

}


/* ======================
   INSIGHTS
====================== */

function renderInsights() {

let list =
document.getElementById(
"insightsList"
);

list.innerHTML = "";

if (state.transactions.length === 0)
return;

let expenses = {};

state.transactions.forEach(t => {

if (t.type === "expense") {

expenses[t.category] =
(expenses[t.category] || 0)
+ t.amount;

}

});

let highest =
Object.keys(expenses)
.reduce((a,b)=>

expenses[a] > expenses[b]
? a : b

);

let li =
document.createElement("li");

li.textContent =
"Highest spending category: "
+ highest;

list.appendChild(li);

}


/* ======================
   EXPORT CSV
====================== */

document
.getElementById("exportBtn")
.onclick = () => {

let csv =
"Date,Category,Type,Amount\n";

state.transactions.forEach(t => {

csv +=

`${t.date},
${t.category},
${t.type},
${t.amount}\n`;

});

let blob =
new Blob([csv]);

let a =
document.createElement("a");

a.href =
URL.createObjectURL(blob);

a.download =
"transactions.csv";

a.click();

};


/* ======================
   RENDER
====================== */

function renderAll() {

renderTable();

updateSummary();

renderCharts();

renderInsights();

updateRoleUI();

}

renderAll();