const DOMElements = {
    labelOriginCode: document.querySelector('#label-origin-code'),
    labelDestinationCode: document.querySelector('#label-destination-code'),
    labelDateGo: document.querySelector('#label-date-go'),
    labelDateBack: document.querySelector('#label-date-back'),
    btnEditFlight: document.querySelector('#btn-edit-flight'),
    loader: document.querySelector('.loader'),
    contTicketGo: document.querySelector('#ticket-go'),
};

/**
 * Startup@Select-Flight-Back
 */
document.addEventListener('DOMContentLoaded', () => {
    eventListeners();
    if (typeof UIFlights !== 'undefined' && typeof info !== 'undefined') {
        UIFlights.listFlights(info.flightInfo || {}, 'tickets-list');
    }
    updateDOM();
    // sendStatus();   // Comentado para evitar error
});

/**
 * Events@Select-Flight-Back
 */
const eventListeners = () => {
    const { btnEditFlight, loader, contTicketGo } = DOMElements;

    if (btnEditFlight && loader) {
        btnEditFlight.addEventListener('click', () => {
            loader.classList.add('show');
            setTimeout(() => window.location.href = 'index.html', 1000);
        });
    }

    if (contTicketGo) {
        contTicketGo.addEventListener('click', () => {
            loader.classList.add('show');
            setTimeout(() => window.location.href = 'select-flight-go.html', 2000);
        });
    }
};

const updateDOM = () => {
    if (!info?.flightInfo) return;

    const { travel_type, origin = {}, destination = {}, flightDates = [] } = info.flightInfo;
    const { labelOriginCode, labelDestinationCode, labelDateGo, labelDateBack, contTicketGo } = DOMElements;

    // Códigos de aeropuerto
    if (labelOriginCode) labelOriginCode.textContent = origin.code || '';
    if (labelDestinationCode) labelDestinationCode.textContent = destination.code || '';

    // Fechas
    try {
        if (travel_type === 1 && flightDates[0] && flightDates[1]) {
            const dateGo = new Date(parseInt(flightDates[0]));
            const dateBack = new Date(parseInt(flightDates[1]));

            const weekDayGo = dayDic[dateGo.getDay() - 1] || 'Lun';
            const weekDayBack = dayDic[dateBack.getDay() - 1] || 'Lun';

            const dayGo = dateGo.getDate();
            const monthGo = String(dateGo.getMonth() + 1).padStart(2, '0');

            const dayBack = dateBack.getDate();
            const monthBack = String(dateBack.getMonth() + 1).padStart(2, '0');

            if (labelDateGo) labelDateGo.textContent = `${weekDayGo} ${dayGo}-${monthGo}`;
            if (labelDateBack) labelDateBack.textContent = `${weekDayBack} ${dayBack}-${monthBack}`;
        }
    } catch (e) {
        console.log('Error formateando fechas');
    }

    // Mostrar resumen del ticket
    if (contTicketGo && typeof showTicketResume === 'function') {
        showTicketResume(contTicketGo, info.flightInfo, 'go');
    }
};

/**
 * FlightsHandler@Select-Flight-Back
 */
class UIFlights {
    static flightsConfig = [
        { takeoff: '4:59', landing: '6:06', duration: '1 h 7 min' },
        { takeoff: '9:30', landing: '10:37', duration: '1 h 7 min' },
        { takeoff: '10:15', landing: '11:22', duration: '1 h 7 min' },
        { takeoff: '12:44', landing: '13:51', duration: '1 h 7 min' },
        { takeoff: '15:49', landing: '16:56', duration: '1 h 7 min' },
        { takeoff: '16:05', landing: '17:13', duration: '1 h 7 min' },
        { takeoff: '20:25', landing: '21:37', duration: '1 h 7 min' },
    ];

    static listFlights = (flightInfo = {}, contId) => {
        const contTicketList = document.getElementById(contId);
        if (!contTicketList) return;

        contTicketList.innerHTML = '';

        let id = 0;
        this.flightsConfig.forEach((flightConfig) => {
            const precio = (PRECIO_BASE || 46900).toLocaleString('es-ES');

            contTicketList.innerHTML += `
                <div class="border-blue-1 rounded-10 p-2 mt-2" id="${id}">
                    <div class="d-flex justify-space-between align-items-center">
                        <div style="width: 30%;" class="d-flex flex-column justify-content-center align-items-center">
                            <p class="m-0 mb-1 fw-bold tc-blue fs-3">${flightInfo.destination?.city || 'Destino'}</p>
                            <p class="m-0 fw-bold tc-blue fs-5">${flightConfig.takeoff}</p>
                        </div>
                        <div style="width: 40%;" class="d-flex flex-row align-items-center justify-content-center">
                            <hr class="w-100">
                            <p class="m-0 tc-cian fw-bold fs-7">Directo</p>
                            <hr class="w-100">
                        </div>
                        <div style="width: 30%;" class="d-flex flex-column justify-content-center align-items-center">
                            <p class="m-0 mb-1 fw-bold tc-blue fs-3">${flightInfo.origin?.city || 'Origen'}</p>
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
                                <p class="m-0 fs-1">${precio} COP</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            id++;
        });

        // Agregar eventos
        for (let i = 0; i < this.flightsConfig.length; i++) {
            const el = document.getElementById(i.toString());
            if (el) {
                el.addEventListener('click', () => UIFlights.openFlight(i.toString(), flightInfo, contId));
            }
        }
    };

    static openFlight(flightId, flightInfo, contId) {
        console.log(`Vuelo de regreso seleccionado: ${flightId}`);
        const loader = document.querySelector('.loader');
        if (loader) loader.classList.add('show');

        setTimeout(() => {
            window.location.href = 'flight-resume.html';
        }, 1500);
    }
}

// Función auxiliar para mostrar resumen del ticket
const showTicketResume = (contTicket, flightInfo, flightType) => {
    if (!contTicket || !flightInfo) return;

    contTicket.innerHTML = '';

    const adults = flightInfo.adults || 1;
    const children = flightInfo.children || 0;
    const total = (PRECIO_BASE || 46900) * (adults + children);

    try {
        const formatDate = new Date(parseInt(flightInfo.flightDates[0]));
        const weekDay = dayDic[formatDate.getDay() - 1] || 'Lun';
        const day = formatDate.getDate();
        const month = String(formatDate.getMonth() + 1).padStart(2, '0');

        let ticketLabel = `<p class="fs-1 m-0">Selecciona tarifa</p>`;

        if (flightInfo.origin?.ticket_type === 'smart') {
            ticketLabel = `<div class="bg-cian p-2 mt-2 rounded-10 d-flex justify-space-between align-items-center"><img src="./assets/media/l_pack_smart.png" width="120px"><p class="tc-white fs-1 m-0">${total.toLocaleString('es-ES')} COP</p></div>`;
        } else if (flightInfo.origin?.ticket_type === 'full') {
            ticketLabel = `<div class="bg-blue-2 p-2 mt-2 rounded-10 d-flex justify-space-between align-items-center"><img src="./assets/media/l_pack_full.png" width="120px"><p class="tc-white fs-1 m-0">${total.toLocaleString('es-ES')} COP</p></div>`;
        }

        contTicket.innerHTML = `
            <div class="border-blue-1 rounded-10 p-2 mt-2">
                <p class="fw-bold fs-3 tc-blue text-center m-0">Vuelo Ida</p>
                <p class="fw-bold fs-6 tc-blue text-center m-0">${weekDay} ${day}-${month}</p>
                <div class="d-flex justify-space-between align-items-center">
                    <div style="width: 30%;" class="d-flex flex-column justify-content-center align-items-center">
                        <p class="m-0 fw-bold tc-blue fs-3">${flightInfo.origin?.city || ''}</p>
                    </div>
                    <div style="width: 40%;" class="d-flex flex-row align-items-center justify-content-center">
                        <hr class="w-100">
                        <p class="m-0 tc-cian fw-bold fs-7">Directo</p>
                        <hr class="w-100">
                    </div>
                    <div style="width: 30%;" class="d-flex flex-column justify-content-center align-items-center">
                        <p class="m-0 fw-bold tc-blue fs-3">${flightInfo.destination?.city || ''}</p>
                    </div>
                </div>
                ${ticketLabel}
            </div>
        `;
    } catch (e) {
        console.log('Error mostrando resumen del ticket');
    }
};

// Hacer clase disponible globalmente
window.UIFlights = UIFlights;
