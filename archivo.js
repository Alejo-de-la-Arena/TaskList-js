// Función para guardar la tarea
function guardarTarea() {
    const tareaInput = document.getElementById('newTaskInput');
    const tarea = tareaInput.value.trim();
    if (tarea !== '') {
        const taskList = document.getElementById('taskList');
        const nuevaTarea = document.createElement('li');
        nuevaTarea.textContent = tarea;
        taskList.appendChild(nuevaTarea);
        // Limpiar el input para agregar nuevas tareas
        tareaInput.value = '';
        // Llamar a la función para actualizar la barra de progreso
        actualizarProgreso();
    }
}

// Función para actualizar la barra de progreso
function actualizarProgreso() {
    const taskList = document.getElementById('taskList');
    const totalTareas = taskList.children.length;
    let tareasCompletadas = 0;

    for (let i = 0; i < totalTareas; i++) {
        const tarea = taskList.children[i];
        const checkbox = document.getElementById('task' + (i + 1));
        if (checkbox.checked) {
            tareasCompletadas++;
        }
    }

    const progressBar = document.getElementById('progressBar');
    const progreso = (tareasCompletadas / totalTareas) * 100;
    progressBar.style.width = progreso + '%';
}

// Esperar a que todos los elementos HTML estén cargados
document.addEventListener('DOMContentLoaded', function () {
    // Agregar evento al input para guardar la tarea estáticamente
    document.getElementById('newTaskInput').addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            guardarTarea();
        }
    });

    // Agregar eventos a los checkboxes para actualizar la barra de progreso
    const checkboxes = document.querySelectorAll('.task-inputs input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', () => {
            actualizarProgreso();
        });
    });
});
