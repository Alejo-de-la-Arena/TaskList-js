const tareas = []; // Array para almacenar todas las tareas

// Función para guardar una nueva tarea
function guardarTarea() {
    const tareaInput = document.getElementById('newTaskInput');
    const tarea = tareaInput.value.trim();
    if (tarea !== '') {
        // Crear el checkbox para la nueva tarea
        const nuevaTareaCheckbox = document.createElement('input');
        nuevaTareaCheckbox.type = 'checkbox';
        nuevaTareaCheckbox.id = 'task' + (tareas.length + 1);

        // Crear el label para el checkbox
        const nuevaTareaLabel = document.createElement('label');
        nuevaTareaLabel.htmlFor = 'task' + (tareas.length + 1);
        nuevaTareaLabel.textContent = tarea;

        // Crear el elemento <li> para la nueva tarea y agregar el checkbox y el label
        const nuevaTareaElemento = document.createElement('li');
        nuevaTareaElemento.appendChild(nuevaTareaCheckbox);
        nuevaTareaElemento.appendChild(nuevaTareaLabel);

        // Agregar la nueva tarea al array
        const nuevaTarea = {
            nombre: tarea,
            completada: false,
            descripcion: '',
            prioridad: 'normal'
        };
        tareas.push(nuevaTarea);

        // Agregar el elemento <li> al calendario de tareas
        const taskList = document.getElementById('taskList');
        taskList.appendChild(nuevaTareaElemento);

        // Agregar el evento de escucha al checkbox recién creado
        nuevaTareaCheckbox.addEventListener('change', function() {
            nuevaTarea.completada = this.checked;
            actualizarProgreso();
        });

        // Llamar a la función para actualizar el progreso
        actualizarProgreso();
    }
}

// Función para actualizar el progreso
function actualizarProgreso() {
    const checkboxes = document.querySelectorAll('#taskList input[type="checkbox"]');
    const totalTareas = checkboxes.length;
    let tareasCompletadas = 0;

    checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            tareasCompletadas++;
        }
    });

    const progresoTareas = document.getElementById('progresoTareas');
    const progreso = (tareasCompletadas / totalTareas) * 100;
    progresoTareas.textContent = `Tareas completadas: ${tareasCompletadas} / ${totalTareas}`;
}

// Esperar a que todos los elementos HTML estén cargados
document.addEventListener('DOMContentLoaded', function () {
    // Agregar evento al input para guardar la tarea estáticamente
    const newTaskInput = document.getElementById('newTaskInput');
    if (newTaskInput) {
        newTaskInput.addEventListener('keypress', function (event) {
            if (event.key === 'Enter') {
                guardarTarea();
            }
        });
    }

    // Agregar evento al botón para guardar la tarea y actualizar el progreso
    const addTaskButton = document.getElementById('addTaskButton');
    if (addTaskButton) {
        addTaskButton.addEventListener('click', function () {
            guardarTarea();
        });
    }
});
