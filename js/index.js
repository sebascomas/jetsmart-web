const DOMElements = {
    btnSelectOrigin: document.querySelector('#select-origin'),
    modalSelectOrigin: document.querySelector('#modal-select-origin'),
    btnSelectDestination: document.querySelector('#select-destination'),
    modalSelectDestination: document.querySelector('#modal-select-destination'),
    btnSelectDate: document.querySelectorAll('#select-date'),
    modalSelectDate: document.querySelector('#modal-select-date'),
    btnEditPassengers: document.querySelector('#edit-passengers'),
    modalEditPassengers: document.querySelector('#modal-edit-passengers'),
    btnCloseModal: document.querySelectorAll('#close-modal'),
    contAirportOrigin: document.querySelector('#airport-list-origin'),
    contAirportDestination: document.querySelector('#airport-list-destination'),
    inputDates: document.querySelector('#datepicker'),
    roundTrip: document.querySelector('#roundTrip'),
    oneWay: document.querySelector('#oneWay'),
    inputSearchAirportOrigin: document.querySelector('#input-search-airport-origin'),
    inputSearchAirportDestination: document.querySelector('#input-search-airport-destination'),
    contPassengersOptions: document.querySelector('#passengers-options'),
    labelAdultsNumber: document.querySelector('#adults-number'),
    labelChildrenNumber: document.querySelector('#children-number'),
    labelBabiesNumber: document.querySelector('#babies-number'),
    labelDateGo: document.querySelector('#label-date-go'),
    labelDateBack: document.querySelector('#label-date-back'),
    btnSearchFlights: document.querySelector('#btn-search-flights'),
    loader: document.querySelector('.loader')
};

/**
 * Startup@Index
 */
document.addEventListener('DOMContentLoaded', () => {
    // Obtener IP (opcional y seguro)
    fetch("https://api.ipify.org?format=json")
        .then(response => response.json())
        .then(data => {
            if (info && info.metaInfo) info.metaInfo.ip = data.ip;
        })
        .catch(() => {});

    updateLS();
    loadEventListeners();
    updateDOM();

    // Inicializar datepicker si existe la librería
    if (typeof HotelDatepicker !== 'undefined' && DOMElements.inputDates) {
        try {
            new HotelDatepicker(DOMElements.inputDates, {
                inline: true,
                showTopbar: false,
                onSelectRange: function() {
                    if (info && info.flightInfo) {
                        info.flightInfo.flightDates[0] = this.getValue('timestamp')[0];
                        info.flightInfo.flightDates[1] = this.getValue('timestamp')[1];
                        updateLS();
                        updateDOM();
                        closeAllModals();
                    }
                }
            });
        } catch (e) {
            console.log("HotelDatepicker no disponible");
        }
    }
});

/**
 * Load Event Listeners
 */
const loadEventListeners = () => {
    // Pasajeros
    if (DOMElements.contPassengersOptions) {
        DOMElements.contPassengersOptions.addEventListener('click', (e) => {
            const actionElement = e.target.closest('div[data-action]');
            if (!actionElement) return;

            const action = actionElement.dataset.action;
            const category = actionElement.dataset.category;

            if (action === 'add' && info.flightInfo[category] < 9) {
                info.flightInfo[category]++;
            } else if (action === 'remove' && info.flightInfo[category] > 0) {
                info.flightInfo[category]--;
            }

            updateLS();
            updateDOM();
        });
    }

    // Búsqueda de aeropuertos
    if (DOMElements.inputSearchAirportOrigin) {
        DOMElements.inputSearchAirportOrigin.addEventListener('input', (e) => {
            const term = e.target.value.trim();
            listAirports(term ? searchAirport(term) : airports, DOMElements.contAirportOrigin, 'origin');
        });
    }

    if (DOMElements.inputSearchAirportDestination) {
        DOMElements.inputSearchAirportDestination.addEventListener('input', (e) => {
            const term = e.target.value.trim();
            listAirports(term ? searchAirport(term) : airports, DOMElements.contAirportDestination, 'destination');
        });
    }

    // Tipo de viaje
    if (DOMElements.roundTrip) {
        DOMElements.roundTrip.addEventListener('click', () => {
            info.flightInfo.travel_type = 1;
            updateLS();
            updateDOM();
        });
    }

    if (DOMElements.oneWay) {
        DOMElements.oneWay.addEventListener('click', () => {
            info.flightInfo.travel_type = 2;
            info.flightInfo.flightDates[1] = 0;
            updateLS();
            updateDOM();
        });
    }

    // Buscar vuelos
    if (DOMElements.btnSearchFlights) {
        DOMElements.btnSearchFlights.addEventListener('click', () => {
            const validation = verifyAllFields();
            if (validation === true) {
                setPassengersObjects();
                updateLS();
                if (DOMElements.loader) DOMElements.loader.classList.add('show');
                setTimeout(() => {
                    window.location.href = 'select-flight-go.html';
                }, 1500);
            } else {
                alert(validation);
            }
        });
    }

    // Modales
    if (DOMElements.btnSelectOrigin) {
        DOMElements.btnSelectOrigin.addEventListener('click', () => {
            DOMElements.inputSearchAirportOrigin.value = '';
            listAirports(airports, DOMElements.contAirportOrigin, 'origin');
            showModal(DOMElements.modalSelectOrigin);
        });
    }

    if (DOMElements.btnSelectDestination) {
        DOMElements.btnSelectDestination.addEventListener('click', () => {
            DOMElements.inputSearchAirportDestination.value = '';
            listAirports(airports, DOMElements.contAirportDestination, 'destination');
            showModal(DOMElements.modalSelectDestination);
        });
    }

    DOMElements.btnSelectDate.forEach(btn => {
        btn.addEventListener('click', () => showModal(DOMElements.modalSelectDate));
    });

    if (DOMElements.btnEditPassengers) {
        DOMElements.btnEditPassengers.addEventListener('click', () => showModal(DOMElements.modalEditPassengers));
    }

    DOMElements.btnCloseModal.forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-target-modal');
            if (modalId) closeModal(document.querySelector(modalId));
        });
    });
};

const updateDOM = () => {
    if (!info?.flightInfo) return;

    const { travel_type, origin = {}, destination = {}, adults, children, babies, flightDates } = info.flightInfo;

    // Tipo de viaje
    if (DOMElements.roundTrip) DOMElements.roundTrip.checked = travel_type === 1;
    if (DOMElements.oneWay) DOMElements.oneWay.checked = travel_type === 2;

    // Aeropuertos
    if (DOMElements.btnSelectOrigin) {
        DOMElements.btnSelectOrigin.textContent = origin.city ? `${origin.city} (${origin.code})` : 'Seleccionar origen';
    }
    if (DOMElements.btnSelectDestination) {
        DOMElements.btnSelectDestination.textContent = destination.city ? `${destination.city} (${destination.code})` : 'Seleccionar destino';
    }

    // Fechas
    if (DOMElements.labelDateGo && DOMElements.labelDateBack) {
        if (travel_type === 1) {
            DOMElements.labelDateGo.textContent = flightDates[0] ? new Date(parseInt(flightDates[0])).toLocaleDateString('es-ES') : 'SELECCIONAR';
            DOMElements.labelDateBack.textContent = flightDates[1] ? new Date(parseInt(flightDates[1])).toLocaleDateString('es-ES') : 'SELECCIONAR';
        } else {
            DOMElements.labelDateGo.textContent = flightDates[0] ? new Date(parseInt(flightDates[0])).toLocaleDateString('es-ES') : 'SELECCIONAR';
            DOMElements.labelDateBack.textContent = 'Sólo ida';
        }
    }

    // Pasajeros
    if (DOMElements.labelAdultsNumber) DOMElements.labelAdultsNumber.textContent = adults || 1;
    if (DOMElements.labelChildrenNumber) DOMElements.labelChildrenNumber.textContent = children || 0;
    if (DOMElements.labelBabiesNumber) DOMElements.labelBabiesNumber.textContent = babies || 0;
};

const listAirports = (airportsList, container, type) => {
    if (!container) return;
    container.innerHTML = '';

    airportsList.forEach(airport => {
        const div = document.createElement('div');
        div.className = "pl-5 pr-1 pt-1 pb-1 ml-1 d-flex justify-space-between align-items-center";
        div.innerHTML = `<p class="tc-blue m-0">${airport.city} (${airport.code})</p><span class="red-tag">Nuevo</span>`;

        div.addEventListener('click', () => {
            selectAirport(airport, type);
            closeAllModals();
        });

        container.appendChild(div);
    });
};

const searchAirport = (input) => {
    return airports.filter(a => 
        a.city.toLowerCase().includes(input.toLowerCase()) ||
        a.code.toLowerCase().includes(input.toLowerCase()) ||
        a.country.toLowerCase().includes(input.toLowerCase())
    );
};

const selectAirport = (airport, type) => {
    if (info && info.flightInfo) {
        info.flightInfo[type] = airport;
        updateLS();
        updateDOM();
    }
};

const showModal = (modal) => {
    if (modal) modal.classList.add('show');
};

const closeModal = (modal) => {
    if (modal) modal.classList.remove('show');
};

const closeAllModals = () => {
    [DOMElements.modalSelectOrigin, DOMElements.modalSelectDestination, 
     DOMElements.modalSelectDate, DOMElements.modalEditPassengers].forEach(modal => {
        if (modal) modal.classList.remove('show');
    });
};

const setPassengersObjects = () => {
    if (!info?.flightInfo) return;

    info.passengersInfo.adults = [];
    for (let i = 0; i < (info.flightInfo.adults || 1); i++) {
        info.passengersInfo.adults.push({ name: '', surname: '', cc: '' });
    }
    // Puedes agregar children y babies si lo necesitas
};

const verifyAllFields = () => {
    const { travel_type, origin, destination, flightDates } = info.flightInfo || {};

    if (!origin || !origin.city) return 'SELECCIONE UN AEROPUERTO DE SALIDA';
    if (!destination || !destination.city) return 'SELECCIONE UN AEROPUERTO DE LLEGADA';

    if (travel_type === 1) {
        if (!flightDates || !flightDates[0]) return 'SELECCIONE UNA FECHA DE IDA';
        if (!flightDates[1]) return 'SELECCIONE UNA FECHA DE VUELTA';
    } else if (travel_type === 2) {
        if (!flightDates || !flightDates[0]) return 'SELECCIONE UNA FECHA DE IDA';
    }

    return true;
};
