// Sélection des éléments du DOM
const addForm = document.querySelector('.add'); 
const todoList = document.querySelector('.todos'); 
const searchInput = document.querySelector('.search input'); 

// Fonction pour générer le template d'une tâche
const generateTemplate = (todo) => {
    const html = `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            <span>${todo}</span>
            <i class="far fa-trash-alt delete"></i>
        </li>
    `;
    todoList.innerHTML += html; // Ajoute la tâche à la liste
};

// Ajout d'une nouvelle tâche
addForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    const todo = addForm.add.value.trim(); 

    if (todo.length) { // Vérifie que la tâche n'est pas vide
        generateTemplate(todo); // Ajoute la tâche à la liste
        addForm.reset(); // Réinitialise le formulaire
    }
});

// Suppression d'une tâche
todoList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete')) { // Vérifie si l'icône de suppression est cliquée
        e.target.parentElement.remove(); 
    }
});

// Filtrage des tâches
const filterTodos = (term) => {
    Array.from(todoList.children) // Convertit la liste en tableau
        .filter((todo) => !todo.textContent.toLowerCase().includes(term)) // Filtre les tâches qui ne correspondent pas
        .forEach((todo) => todo.classList.add('filtered')); // Masque les tâches non correspondantes

    Array.from(todoList.children)
        .filter((todo) => todo.textContent.toLowerCase().includes(term)) // Filtre les tâches qui correspondent
        .forEach((todo) => todo.classList.remove('filtered')); // Affiche les tâches correspondantes
};

// Événement de recherche en temps réel
searchInput.addEventListener('keyup', () => {
    const term = searchInput.value.trim().toLowerCase(); // Récupère la valeur du champ de recherche
    filterTodos(term); // Applique le filtre
});