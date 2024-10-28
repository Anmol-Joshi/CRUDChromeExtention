var items = [];
var currentId = 0;
var isEditing = false;
var editId = null;
function saveItems() {
    chrome.storage.local.set({ items: items });
}
function loadItems() {
    chrome.storage.local.get('items', function (data) {
        items = data.items || [];
        currentId = items.length ? items[items.length - 1].id + 1 : 0;
        renderItems();
    });
}
function renderItems() {
    var itemList = document.getElementById('itemList');
    itemList.innerHTML = '';
    items.forEach(function (item) {
        var li = document.createElement('li');
        li.textContent = item.value;
        var editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.onclick = function () { return startEditItem(item.id, item.value); };
        var deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = function () { return deleteItem(item.id); };
        li.appendChild(editButton);
        li.appendChild(deleteButton);
        itemList.appendChild(li);
    });
}
function startEditItem(id, value) {
    var input = document.getElementById('itemInput');
    var addItemButton = document.getElementById('addItem');
    var saveEditButton = document.getElementById('saveEdit');
    input.value = value;
    addItemButton.style.display = 'none';
    saveEditButton.style.display = 'inline';
    isEditing = true;
    editId = id;
}
function addItem() {
    var input = document.getElementById('itemInput');
    var newItem = { id: currentId++, value: input.value };
    items.push(newItem);
    input.value = '';
    saveItems();
    renderItems();
}
function saveEdit() {
    if (editId !== null) {
        var input = document.getElementById('itemInput');
        var index = items.findIndex(function (item) { return item.id === editId; });
        if (index !== -1) {
            items[index].value = input.value;
            saveItems();
            renderItems();
        }
        resetEditMode();
    }
}
function deleteItem(id) {
    items = items.filter(function (item) { return item.id !== id; });
    saveItems();
    renderItems();
}
function resetEditMode() {
    var input = document.getElementById('itemInput');
    var addItemButton = document.getElementById('addItem');
    var saveEditButton = document.getElementById('saveEdit');
    input.value = '';
    addItemButton.style.display = 'inline';
    saveEditButton.style.display = 'none';
    isEditing = false;
    editId = null;
}
document.getElementById('addItem').onclick = addItem;
document.getElementById('saveEdit').onclick = saveEdit;
loadItems();
