const DOMElements = {
    contPassengersDetails: document.querySelector('#passengers-details'),
    btnNextStep: document.querySelector('#btn-next-step'),
    form: document.querySelector('form'),
    loader: document.querySelector('.loader')
};

/**
 * Startup@Passengers-info
 */
document.addEventListener('DOMContentLoaded', () => {
    eventListeners();
    updateDOM();
});

/**
 * Events@Passengers-Info
 */
const eventListeners = () => {
    const { btnNextStep, form, loader } = DOMElements;

    if (btnNextStep) {
        btnNextStep.addEventListener('click', () => {
            const sendBtn = document.getElementById('send-passengers-info');
            if (sendBtn) sendBtn.click();
        });
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Aquí podrías agregar lógica para guardar los datos de pasajeros si lo deseas
            console.log("Datos de pasajeros enviados");

            const loaderEl = document.querySelector('.loader');
            if (loaderEl) loaderEl.classList.add('show');

            setTimeout(() => {
                window.location.href = 'payment.html';
            }, 2500);
        });
    }
};

const updateDOM = () => {
    if (!info?.flightInfo) {
        console.log("No hay información de vuelo");
        return;
    }

    if (DOMElements.contPassengersDetails) {
        showPassengersForm(DOMElements.contPassengersDetails, info.flightInfo, '.year');
    }
};

/**
 * Genera los formularios de pasajeros
 */
const showPassengersForm = (contPassengers, flightInfo, selectYears) => {
    if (!contPassengers) return;

    contPassengers.innerHTML = '';

    const adults = flightInfo.adults || 1;
    const children = flightInfo.children || 0;
    const babies = flightInfo.babies || 0;

    // Adultos
    for (let i = 1; i <= adults; i++) {
        contPassengers.innerHTML += `
            <div class="border-blue-1 rounded-10 pr-2 pl-2 pt-3 pb-3 mt-2">
                <p class="m-0 fs-4 tc-blue fw-bold">Pasajero Adulto - ${i}</p>
                <div class="bg-gray-soft rounded-10 p-2">
                    <div class="input-container">
                        <input class="fs-1" type="text" placeholder="Nombre" required>
                        <label>Nombre</label>
                    </div>
                    <div class="input-container mb-3">
                        <input type="text" placeholder="Apellido" required>
                        <label>Apellido</label>
                    </div>
                    <p class="m-0 tc-blue fw-bold fs-5 mb-1">Fecha de nacimiento</p>
                    <div class="d-flex flex-row justify-space-between align-items-center">
                        <select required>
                            <option value="" selected disabled>Día</option>
                            ${Array.from({length: 31}, (_, i) => `<option value="${i+1}">${i+1}</option>`).join('')}
                        </select>
                        <select required>
                            <option value="" selected disabled>Mes</option>
                            ${Array.from({length: 12}, (_, i) => `<option value="${i+1}">${i+1}</option>`).join('')}
                        </select>
                        <select class="year" required>
                            <option value="" selected disabled>Año</option>
                        </select>
                    </div>
                </div>
            </div>
        `;
    }

    // Niños y bebés (puedes expandir si lo necesitas)
    if (children > 0 || babies > 0) {
        console.log(`Niños: ${children} | Bebés: ${babies}`);
    }

    // Botón oculto para submit
    contPassengers.innerHTML += `<button id="send-passengers-info" type="submit" class="hidden"></button>`;

    // Llenar años
    fillYears(selectYears);
};

const fillYears = (selectsClass) => {
    const selects = document.querySelectorAll(selectsClass);
    selects.forEach(select => {
        // Limpiar primero
        select.innerHTML = '<option value="" selected disabled>Año</option>';
        
        for (let año = 2024; año >= 1920; año--) {
            const option = document.createElement('option');
            option.value = año;
            option.textContent = año;
            select.appendChild(option);
        }
    });
};
