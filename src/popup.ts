interface Item {
  id: number;
  value: string;
}

let items: Item[] = [];
let currentId = 0;
let isEditing = false;
let editId: number | null = null;

function saveItems() {
  chrome.storage.local.set({ items });
}

function loadItems() {
  chrome.storage.local.get('items', (data) => {
    items = data.items || [];
    currentId = items.length ? items[items.length - 1].id + 1 : 0;
    renderItems();
  });
}

function renderItems() {
  const itemList = document.getElementById('itemList') as HTMLUListElement;
  itemList.innerHTML = '';

  items.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item.value;

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.onclick = () => startEditItem(item.id, item.value);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => deleteItem(item.id);

    li.appendChild(editButton);
    li.appendChild(deleteButton);
    itemList.appendChild(li);
  });
}

function startEditItem(id: number, value: string) {
  const input = document.getElementById('itemInput') as HTMLInputElement;
  const addItemButton = document.getElementById('addItem') as HTMLButtonElement;
  const saveEditButton = document.getElementById(
    'saveEdit'
  ) as HTMLButtonElement;

  input.value = value;
  addItemButton.style.display = 'none';
  saveEditButton.style.display = 'inline';

  isEditing = true;
  editId = id;
}

function addItem() {
  const input = document.getElementById('itemInput') as HTMLInputElement;
  const newItem: Item = { id: currentId++, value: input.value };
  items.push(newItem);

  input.value = '';
  saveItems();
  renderItems();
}

function saveEdit() {
  if (editId !== null) {
    const input = document.getElementById('itemInput') as HTMLInputElement;
    const index = items.findIndex((item) => item.id === editId);

    if (index !== -1) {
      items[index].value = input.value;
      saveItems();
      renderItems();
    }

    resetEditMode();
  }
}

function deleteItem(id: number) {
  items = items.filter((item) => item.id !== id);
  saveItems();
  renderItems();
}

function resetEditMode() {
  const input = document.getElementById('itemInput') as HTMLInputElement;
  const addItemButton = document.getElementById('addItem') as HTMLButtonElement;
  const saveEditButton = document.getElementById(
    'saveEdit'
  ) as HTMLButtonElement;

  input.value = '';
  addItemButton.style.display = 'inline';
  saveEditButton.style.display = 'none';

  isEditing = false;
  editId = null;
}

document.getElementById('addItem')!.onclick = addItem;
document.getElementById('saveEdit')!.onclick = saveEdit;

loadItems();
