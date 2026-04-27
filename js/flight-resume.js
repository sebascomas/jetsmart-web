const DOMElements = {
    labelOriginCode: document.querySelector('#label-origin-code'),
    labelDestinationCode: document.querySelector('#label-destination-code'),
    labelDateGo: document.querySelector('#label-date-go'),
    labelDateBack: document.querySelector('#label-date-back'),
    btnEditFlight: document.querySelector('#btn-edit-flight'),
    loader: document.querySelector('.loader'),
    contTicketGo: document.querySelector('#ticket-go'),
    contTicketBack: document.querySelector('#ticket-back'),
    labelTotal: document.querySelector('#total-resume'),
    btnNextStep: document.querySelector('#btn-next-step'),
};

/**
 * Startup@Flight-Resume
 */
document.addEventListener('DOMContentLoaded', () => {
    eventListeners();
    updateDOM();
    // sendStatus();   // Comentado para evitar error
});

/**
 * Events@Flight-Resume
 */
const eventListeners = () => {
    const { btnEditFlight, loader, btnNextStep, contTicketGo, contTicketBack } = DOMElements;

    if (btnEditFlight && loader) {
        btnEditFlight.addEventListener('click', () => {
            loader.classList.add('show');
            setTimeout(() => window.location.href = 'index.html', 1000);
        });
    }

    if (btnNextStep && loader) {
        btnNextStep.addEventListener('click', () => {
            loader.classList.add('show');
            setTimeout(() => window.location.href = 'passengers-info.html', 2000);
        });
    }

    if (contTicketGo && loader) {
        contTicketGo.addEventListener('click', () => {
            loader.classList.add('show');
            setTimeout(() => window.location.href = 'select-flight-go.html', 2000);
        });
    }

    if (contTicketBack && loader) {
        contTicketBack.addEventListener('click', () => {
            loader.classList.add('show');
            setTimeout(() => window.location.href = 'select-flight-back.html', 2000);
        });
    }
};

const updateDOM = () => {
    if (!info?.flightInfo) return;

    const { travel_type, origin = {}, destination = {}, adults = 1, children = 0, flightDates = [] } = info.flightInfo;
    const { labelOriginCode, labelDestinationCode, labelDateGo, labelDateBack, contTicketGo, contTicketBack, labelTotal } = DOMElements;

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
        } else if (travel_type === 2 && flightDates[0]) {
            const dateGo = new Date(parseInt(flightDates[0]));
            const weekDayGo = dayDic[dateGo.getDay() - 1] || 'Lun';
            const dayGo = dateGo.getDate();
            const monthGo = String(dateGo.getMonth() + 1).padStart(2, '0');

            if (labelDateGo) labelDateGo.textContent = `${weekDayGo} ${dayGo}-${monthGo}`;
            if (labelDateBack) labelDateBack.textContent = '';
        }
    } catch (e) {
        console.log('Error formateando fechas');
    }

    // Mostrar tickets
    if (contTicketGo) showTicketResume(contTicketGo, info.flightInfo, 'go');
    if (contTicketBack && travel_type === 1) showTicketResume(contTicketBack, info.flightInfo, 'back');

    // Calcular total
    if (labelTotal) {
        const totalLight = PRECIO_BASE * (adults + children);
        const totalSmart = PRECIO_BASE * (MULTIPLICADORES_PRECIO?.smart || 1.7) * (adults + children);
        const totalFull = PRECIO_BASE * (MULTIPLICADORES_PRECIO?.full || 3) * (adults + children);

        let total = 0;
        if (origin.ticket_type === 'light') total += totalLight;
        else if (origin.ticket_type === 'smart') total += totalSmart;
        else if (origin.ticket_type === 'full') total += totalFull;

        if (travel_type === 1) {
            if (destination.ticket_type === 'light') total += totalLight;
            else if (destination.ticket_type === 'smart') total += totalSmart;
            else if (destination.ticket_type === 'full') total += totalFull;
        }

        labelTotal.textContent = '$ ' + total.toLocaleString('es-ES') + ' COP';
    }
};

/**
 * Función para mostrar resumen de ticket (go o back)
 */
const showTicketResume = (contTicket, flightInfo, flightType) => {
    if (!contTicket || !flightInfo) return;

    contTicket.innerHTML = '';

    const adults = flightInfo.adults || 1;
    const children = flightInfo.children || 0;
    const totalBase = (PRECIO_BASE || 46900) * (adults + children);

    try {
        const isGo = flightType === 'go';
        const ticketType = isGo ? flightInfo.origin?.ticket_type : flightInfo.destination?.ticket_type;
        const sched = isGo ? flightInfo.origin?.ticket_sched : flightInfo.destination?.ticket_sched;

        let ticketHTML = '';

        if (ticketType === 'smart') {
            ticketHTML = `<div class="bg-cian p-2 mt-2 rounded-10 d-flex justify-space-between align-items-center"><img src="./assets/media/l_pack_smart.png" width="120px"><p class="tc-white fs-1 m-0">${totalBase.toLocaleString('es-ES')} COP</p></div>`;
        } else if (ticketType === 'full') {
            ticketHTML = `<div class="bg-blue-2 p-2 mt-2 rounded-10 d-flex justify-space-between align-items-center"><img src="./assets/media/l_pack_full.png" width="120px"><p class="tc-white fs-1 m-0">${totalBase.toLocaleString('es-ES')} COP</p></div>`;
        } else {
            ticketHTML = `<div class="bg-gray-2 p-2 mt-2 rounded-10 d-flex justify-space-between align-items-center"><img src="./assets/media/l_vuela_ligero.png" width="100px"><p class="fs-1 m-0">${totalBase.toLocaleString('es-ES')} COP</p></div>`;
        }

        const cityFrom = isGo ? flightInfo.origin?.city : flightInfo.destination?.city;
        const cityTo = isGo ? flightInfo.destination?.city : flightInfo.origin?.city;
        const takeoff = sched?.takeoff || '---';
        const landing = sched?.landing || '---';

        contTicket.innerHTML = `
            <div class="border-blue-1 rounded-10 p-2">
                <p class="fw-bold fs-3 tc-blue text-center m-0">${isGo ? 'Vuelo Ida' : 'Vuelo Regreso'}</p>
                <div class="d-flex justify-space-between align-items-center">
                    <div style="width: 30%;" class="d-flex flex-column justify-content-center align-items-center">
                        <p class="m-0 fw-bold tc-blue fs-3">${cityFrom}</p>
                        <p class="m-0 fw-bold tc-blue fs-5">${takeoff}</p>
                    </div>
                    <div style="width: 40%;" class="d-flex flex-row align-items-center justify-content-center">
                        <hr class="w-100">
                        <p class="m-0 tc-cian fw-bold fs-7">Directo</p>
                        <hr class="w-100">
                    </div>
                    <div style="width: 30%;" class="d-flex flex-column justify-content-center align-items-center">
                        <p class="m-0 fw-bold tc-blue fs-3">${cityTo}</p>
                        <p class="m-0 fw-bold tc-blue fs-5">${landing}</p>
                    </div>
                </div>
                ${ticketHTML}
            </div>
        `;
    } catch (e) {
        console.log('Error mostrando resumen del ticket');
        contTicket.innerHTML = '<p class="text-center">Error al cargar el resumen</p>';
    }
};

// Hacer funciones disponibles globalmente si es necesario
window.showTicketResume = showTicketResume;
