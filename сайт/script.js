const clearTableButton = document.getElementById('clear-table');
const restoreTableButton = document.getElementById('restore-table');
const table = document.getElementById('sample-table');
let tableData = null;

// Функция для очистки таблицы
clearTableButton.addEventListener('click', () => {
    if (!tableData) {
        tableData = table.innerHTML;
    }
    table.innerHTML = '<tr><th>Таблица умножения</th><th></th><th></th></tr>';
    clearTableButton.disabled = true;
    restoreTableButton.disabled = false;
});

// Функция для восстановления таблицы
restoreTableButton.addEventListener('click', () => {
    if (tableData) {
        table.innerHTML = tableData;
        clearTableButton.disabled = false;
        restoreTableButton.disabled = true;
    }
});