const tareas = {};

function obtenerFechaPersonalizada() {
    const fecha = new Date();
    const diaSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const mesActual = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return `${diaSemana[fecha.getDay()]}, ${fecha.getDate()} de ${mesActual[fecha.getMonth()]} de ${fecha.getFullYear()}`;
}

//funcion para asignar
function generarColorAleatorio() {
    const letras = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letras[Math.floor(Math.random() * 16)];
    }
    return color;
}

function guardarTarea() {
    const tareaInput = document.getElementById('newTaskInput');
    const tarea = tareaInput.value.trim();
    if (tarea !== '') {
        const nuevaTareaKey = 'tarea' + (Object.keys(tareas).length + 1);
        tareas[nuevaTareaKey] = { nombre: tarea, completada: false };

        const nuevaTarea = {
            nombre: tarea,
            completada: false,
            vencimiento: obtenerFechaPersonalizada(),
            horaVencimiento: ''
        };

        const nuevaTareaHoraInput = document.createElement('input');
        nuevaTareaHoraInput.type = 'time';
        nuevaTareaHoraInput.id = nuevaTareaKey + '_hora';
        nuevaTareaHoraInput.placeholder = 'Hora de vencimiento';

        nuevaTareaHoraInput.addEventListener('change', function () {
            nuevaTarea.horaVencimiento = this.value;
            const horaActual = new Date().getHours();
            const minutosActuales = new Date().getMinutes();
            const horaVencimiento = nuevaTarea.horaVencimiento.split(':')[0];
            const minutosVencimiento = nuevaTarea.horaVencimiento.split(':')[1];

            if (parseInt(horaVencimiento) < horaActual || (parseInt(horaVencimiento) === horaActual && parseInt(minutosVencimiento) < minutosActuales)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'No puedes establecer una hora de vencimiento anterior a la hora actual',
                });
            }
        });

        // Almacenar el objeto actualizado en el LocalStorage
        localStorage.setItem('tareas', JSON.stringify(tareas));

        const nuevaTareaCheckbox = document.createElement('input');
        nuevaTareaCheckbox.type = 'checkbox';
        nuevaTareaCheckbox.id = nuevaTareaKey;

        const nuevaTareaLabel = document.createElement('label');
        nuevaTareaLabel.htmlFor = nuevaTareaKey;
        nuevaTareaLabel.textContent = tarea;

        const nuevaTareaElemento = document.createElement('li');
        nuevaTareaElemento.style.backgroundColor = generarColorAleatorio(); // Asigna un color aleatorio a la tarea
        nuevaTareaElemento.appendChild(nuevaTareaCheckbox);
        nuevaTareaElemento.appendChild(nuevaTareaLabel);
        nuevaTareaElemento.appendChild(nuevaTareaHoraInput);

        const taskList = document.getElementById('taskList');
        taskList.appendChild(nuevaTareaElemento);

        nuevaTareaCheckbox.addEventListener('change', function () {
            tareas[nuevaTareaKey].completada = this.checked;
            actualizarProgreso();

            if (this.checked) {
                const horaActual = new Date().getHours();
                const minutosActuales = new Date().getMinutes();
                const horaVencimiento = tareas[nuevaTareaKey].horaVencimiento.split(':')[0];
                const minutosVencimiento = tareas[nuevaTareaKey].horaVencimiento.split(':')[1];

                if (parseInt(horaVencimiento) >= horaActual || (parseInt(horaVencimiento) === horaActual && parseInt(minutosVencimiento) < minutosActuales)) {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Felicidades!',
                        text: 'Completaste tu tarea! ',
                    });
                }
            }
        });

        nuevaTareaHoraInput.addEventListener('change', function () {
            tareas[nuevaTareaKey].horaVencimiento = this.value;
            verificarVencimiento(tareas[nuevaTareaKey]);
        });

        actualizarProgreso();
    }
}

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

        const nuevaTareaHoraInput = document.createElement('input');
        nuevaTareaHoraInput.type = 'time';
        nuevaTareaHoraInput.id = tareaKey + '_hora';
        nuevaTareaHoraInput.value = tareas[tareaKey].horaVencimiento;
        nuevaTareaElemento.appendChild(nuevaTareaHoraInput);

        taskList.appendChild(nuevaTareaElemento);

        nuevaTareaCheckbox.addEventListener('change', function () {
            tareas[tareaKey].completada = this.checked;
            actualizarProgreso();

            if (this.checked) {
                const horaActual = new Date().getHours();
                const minutosActuales = new Date().getMinutes();
                const horaVencimiento = tareas[tareaKey].horaVencimiento.split(':')[0];
                const minutosVencimiento = tareas[tareaKey].horaVencimiento.split(':')[1];

                if (parseInt(horaVencimiento) < horaActual || (parseInt(horaVencimiento) === horaActual && parseInt(minutosVencimiento) < minutosActuales)) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Atención',
                        text: 'Completaste la tarea después de su hora de vencimiento',
                    });
                }
            }
        });

        nuevaTareaHoraInput.addEventListener('change', function () {
            tareas[tareaKey].horaVencimiento = this.value;
            verificarVencimiento(tareas[tareaKey]);
        });
    }
    actualizarProgreso();
}

function verificarVencimiento(tarea) {
    if (tarea.horaVencimiento !== '') {
        const horaCreacion = parseInt(tarea.vencimiento.split(' ')[5].split(':')[0]);
        const minutosCreacion = parseInt(tarea.vencimiento.split(':')[1]);
        const horaVencimiento = parseInt(tarea.horaVencimiento.split(':')[0]);
        const minutosVencimiento = parseInt(tarea.horaVencimiento.split(':')[1]);

        if (horaVencimiento < horaCreacion || (horaVencimiento === horaCreacion && minutosVencimiento < minutosCreacion)) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No puedes resolver la tarea antes de crearla!',
            });
        } 
    }
}

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

document.addEventListener('DOMContentLoaded', function () {
    const newTaskInput = document.getElementById('newTaskInput');
    if (newTaskInput) {
        newTaskInput.addEventListener('keypress', function (event) {
            if (event.key === 'Enter') {
                guardarTarea();
            }
        });
    }

    const addTaskButton = document.getElementById('addTaskButton');
    if (addTaskButton) {
        addTaskButton.addEventListener('click', function () {
            guardarTarea();
        });
    }
    cargarTareasDesdeArchivo();
});

