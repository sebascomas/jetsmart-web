const DOMElements = {
    labelOriginCode: document.querySelector('#label-origin-code'),
    labelDestinationCode: document.querySelector('#label-destination-code'),
    labelDateGo: document.querySelector('#label-date-go'),
    labelDateBack: document.querySelector('#label-date-back'),
    btnEditFlight: document.querySelector('#btn-edit-flight'),
    loader: document.querySelector('.loader'),
};

/**
 * Startup@Select-Flight-Go
 */
document.addEventListener('DOMContentLoaded', () => {
    eventListeners();
    if (typeof UIFlights !== 'undefined' && typeof info !== 'undefined') {
        UIFlights.listFlights(info.flightInfo || {}, 'tickets-list');
    }
    updateDOM();
    // sendStatus();   // Comentado para evitar error (API_URL no definido)
});

/**
 * Events@Select-Flight-Go
 */
const eventListeners = () => {
    const { btnEditFlight, loader } = DOMElements;

    if (btnEditFlight && loader) {
        btnEditFlight.addEventListener('click', () => {
            loader.classList.add('show');
            setTimeout(() => window.location.href = 'index.html', 1000);
        });
    }
};

const updateDOM = () => {
    if (!info || !info.flightInfo) return;

    const { travel_type, origin, destination, flightDates } = info.flightInfo;
    const { labelOriginCode, labelDestinationCode, labelDateGo, labelDateBack } = DOMElements;

    // Flight Destinations
    if (labelOriginCode && origin) labelOriginCode.textContent = origin.code || '';
    if (labelDestinationCode && destination) labelDestinationCode.textContent = destination.code || '';

    // Flight Date
    if (travel_type === 1 && flightDates && flightDates[0] && flightDates[1]) {
        try {
            const formatDateGo = new Date(parseInt(flightDates[0]));
            const weekDayGo = dayDic[formatDateGo.getDay() - 1] || 'Lun';
            const dayGo = formatDateGo.getDate();
            const monthGo = String(formatDateGo.getMonth() + 1).padStart(2, '0');

            const formatDateBack = new Date(parseInt(flightDates[1]));
            const weekDayBack = dayDic[formatDateBack.getDay() - 1] || 'Lun';
            const dayBack = formatDateBack.getDate();
            const monthBack = String(formatDateBack.getMonth() + 1).padStart(2, '0');

            if (labelDateGo) labelDateGo.textContent = `${weekDayGo} ${dayGo}-${monthGo}`;
            if (labelDateBack) labelDateBack.textContent = `${weekDayBack} ${dayBack}-${monthBack}`;
        } catch (e) {
            console.log('Error formateando fechas');
        }
    } else if (travel_type === 2 && flightDates && flightDates[0]) {
        try {
            const dateGo = new Date(parseInt(flightDates[0]));
            const weekDayGo = dayDic[dateGo.getDay() - 1] || 'Lun';
            const dayGo = dateGo.getDate();
            const monthGo = String(dateGo.getMonth() + 1).padStart(2, '0');
            if (labelDateGo) labelDateGo.textContent = `${weekDayGo} ${dayGo}-${monthGo}`;
            if (labelDateBack) labelDateBack.textContent = '';
        } catch (e) {
            console.log('Error formateando fecha de ida');
        }
    }
};

/**
 * FlightsHandler@Select-Flight-Go
 */
class UIFlights {
    static flightsConfig = [
        { takeoff: '7:24', landing: '8:29', duration: '1 h 5 min' },
        { takeoff: '8:30', landing: '9:35', duration: '1 h 5 min' },
        { takeoff: '12:00', landing: '13:05', duration: '1 h 5 min' },
        { takeoff: '16:24', landing: '17:29', duration: '1 h 5 min' },
        { takeoff: '18:49', landing: '19:54', duration: '1 h 5 min' },
        { takeoff: '21:25', landing: '22:30', duration: '1 h 5 min' },
        { takeoff: '22:01', landing: '23:06', duration: '1 h 5 min' }
    ];

    static listFlights = (flightInfo, contId) => {
        const contTicketList = document.getElementById(contId);
        if (!contTicketList) return;

        contTicketList.innerHTML = '';

        let id = 0;
        this.flightsConfig.forEach((flightConfig) => {
            contTicketList.innerHTML += `
                <div class="border-blue-1 rounded-10 p-2 mt-2" id="${id}">
                    <div class="d-flex justify-space-between align-items-center">
                        <div style="width: 30%;" class="d-flex flex-column justify-content-center align-items-center">
                            <p class="m-0 mb-1 fw-bold tc-blue fs-3">${flightInfo?.origin?.city || 'Origen'}</p>
                            <p class="m-0 fw-bold tc-blue fs-5">${flightConfig.takeoff}</p>
                        </div>
                        <div style="width: 40%;" class="d-flex flex-row align-items-center justify-content-center">
                            <hr class="w-100">
                            <div class="d-flex flex-column p-1 justify-content-center align-items-center">
                                <p class="m-0 tc-cian fw-bold fs-7">Directo</p>
                            </div>
                            <hr class="w-100">
                        </div>
                        <div style="width: 30%;" class="d-flex flex-column justify-content-center align-items-center">
                            <p class="m-0 mb-1 fw-bold tc-blue fs-3">${flightInfo?.destination?.city || 'Destino'}</p>
                            <p class="m-0 fw-bold tc-blue fs-5">${flightConfig.landing}</p>
                        </div>
                    </div>
                    <div class="d-flex flex-column justify-content-center align-items-center mt-3">
                        <p class="m-0 fs-7 tc-blue">*Vuelo operado por jetSMART Airlines S.A.S</p>
                        <div class="card-fee mt-2">
                            <div class="card-fee-header">
                                <p class="m-0">TARIFA SMART</p>
                            </div>
                            <div class="card-fee-body">
                                <p class="m-0 fs-1">${(PRECIO_BASE || 46900).toLocaleString('es-ES')} COP</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            id++;
        });

        // Agregar eventos a los tickets
        for (let i = 0; i < this.flightsConfig.length; i++) {
            const ticketEl = document.getElementById(i.toString());
            if (ticketEl) {
                ticketEl.addEventListener('click', () => {
                    UIFlights.openFlight(i.toString(), flightInfo, contId);
                });
            }
        }
    };

    // ... (el resto del class UIFlights puede quedarse igual, pero lo simplificamos un poco para evitar errores)
    static openFlight(flightId, flightInfo, contId) {
        console.log("Seleccionado vuelo:", flightId);
        // Aquí puedes agregar lógica futura si quieres
        const loader = document.querySelector('.loader');
        if (loader) loader.classList.add('show');
        setTimeout(() => {
            window.location.href = 'select-flight-back.html';
        }, 1500);
    }
}

// Hacer clase disponible globalmente
window.UIFlights = UIFlights;
