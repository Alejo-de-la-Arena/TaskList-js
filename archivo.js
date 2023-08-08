const tareas = {}; // Objeto para almacenar todas las tareas

// Función para guardar una nueva tarea
function guardarTarea() {
    const tareaInput = document.getElementById('newTaskInput');
    const tarea = tareaInput.value.trim();
    if (tarea !== '') {
        // Agregar la nueva tarea al objeto
        const nuevaTareaKey = 'tarea' + (Object.keys(tareas).length + 1);
        tareas[nuevaTareaKey] = { nombre: tarea, completada: false };

        // Almacenar el objeto actualizado en el LocalStorage
        localStorage.setItem('tareas', JSON.stringify(tareas));

        // Crear y mostrar la tarea en la lista
        const nuevaTareaCheckbox = document.createElement('input');
        nuevaTareaCheckbox.type = 'checkbox';
        nuevaTareaCheckbox.id = nuevaTareaKey;

        const nuevaTareaLabel = document.createElement('label');
        nuevaTareaLabel.htmlFor = nuevaTareaKey;
        nuevaTareaLabel.textContent = tarea;

        const nuevaTareaElemento = document.createElement('li');
        nuevaTareaElemento.appendChild(nuevaTareaCheckbox);
        nuevaTareaElemento.appendChild(nuevaTareaLabel);

        const taskList = document.getElementById('taskList');
        taskList.appendChild(nuevaTareaElemento);

        nuevaTareaCheckbox.addEventListener('change', function() {
            tareas[nuevaTareaKey].completada = this.checked;
            actualizarProgreso();
            // Actualizar el estado de la tarea completada si es necesario
            // Puedes adaptar esta parte según tus necesidades
        });

        // Actualizar progreso
        actualizarProgreso();
    }
}

// Función para cargar tareas desde el objeto en el archivo al cargar la página
function cargarTareasDesdeArchivo() {
    const taskList = document.getElementById('taskList');
    for (const tareaKey in tareas) {
        const nuevaTareaCheckbox = document.createElement('input');
        nuevaTareaCheckbox.type = 'checkbox';
        nuevaTareaCheckbox.id = tareaKey;
        nuevaTareaCheckbox.checked = tareas[tareaKey].completada;

        const nuevaTareaLabel = document.createElement('label');
        nuevaTareaLabel.htmlFor = tareaKey;
        nuevaTareaLabel.textContent = tareas[tareaKey].nombre;

        const nuevaTareaElemento = document.createElement('li');
        nuevaTareaElemento.appendChild(nuevaTareaCheckbox);
        nuevaTareaElemento.appendChild(nuevaTareaLabel);

        taskList.appendChild(nuevaTareaElemento);

        nuevaTareaCheckbox.addEventListener('change', function() {
            tareas[tareaKey].completada = this.checked;
            actualizarProgreso();
            // Actualizar el estado de la tarea completada si es necesario
            // Puedes adaptar esta parte según tus necesidades
        });
    }

    // Actualizar progreso
    actualizarProgreso();
}

// Función para actualizar el progreso
function actualizarProgreso() {
    const totalTareas = Object.keys(tareas).length;
    let tareasCompletadas = 0;

    for (const tareaKey in tareas) {
        if (tareas[tareaKey].completada) {
            tareasCompletadas++;
        }
    }

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

    // Cargar tareas desde el objeto en el archivo al cargar la página
    cargarTareasDesdeArchivo();
});