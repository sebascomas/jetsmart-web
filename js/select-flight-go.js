// select-flight-go.js - Versión corregida y simplificada

document.addEventListener('DOMContentLoaded', () => {
    fixFlightInfo();
    updateDOM();
    listFlights();
});

const fixFlightInfo = () => {
    if (!info) info = { flightInfo: {} };
    if (!info.flightInfo) info.flightInfo = {};

    const f = info.flightInfo;
    if (!f.origin || typeof f.origin !== 'object') f.origin = { city: 'Bogotá', code: 'BOG', name: '' };
    if (!f.destination || typeof f.destination !== 'object') f.destination = { city: 'Medellín', code: 'MDE', name: '' };
    if (!f.flightDates) f.flightDates = [Date.now(), 0];
    if (!f.adults) f.adults = 1;
};

const updateDOM = () => {
    const f = info.flightInfo;
    const originCode = document.querySelector('#label-origin-code');
    const destCode = document.querySelector('#label-destination-code');

    if (originCode) originCode.textContent = f.origin.code || 'BOG';
    if (destCode) destCode.textContent = f.destination.code || 'MDE';
};

const listFlights = () => {
    const container = document.getElementById('tickets-list');
    if (!container) return;

    container.innerHTML = '';

    const sampleFlights = [
        { takeoff: '07:24', landing: '08:29' },
        { takeoff: '12:00', landing: '13:05' },
        { takeoff: '18:49', landing: '19:54' }
    ];

    sampleFlights.forEach((flight, index) => {
        const div = document.createElement('div');
        div.className = "border-blue-1 rounded-10 p-3 mt-2 cursor-pointer hover:bg-gray-100";
        div.innerHTML = `
            <div class="d-flex justify-space-between align-items-center">
                <div>
                    <p class="fw-bold">${info.flightInfo.origin.city} → ${info.flightInfo.destination.city}</p>
                    <p class="fs-5">${flight.takeoff} - ${flight.landing}</p>
                </div>
                <div class="text-end">
                    <p class="fw-bold fs-4">$${(PRECIO_BASE || 46900).toLocaleString('es-ES')} COP</p>
                    <small class="tc-gray">Tarifa SMART</small>
                </div>
            </div>
        `;

        div.addEventListener('click', () => selectThisFlight(index));
        container.appendChild(div);
    });
};

const selectThisFlight = (index) => {
    const f = info.flightInfo;

    // Asignar datos del vuelo seleccionado
    f.origin.ticket_type = 'smart';
    f.origin.ticket_sched = { takeoff: '07:24', landing: '08:29' };

    if (typeof updateLS === 'function') updateLS();

    const loader = document.querySelector('.loader');
    if (loader) loader.classList.add('show');

    setTimeout(() => {
        window.location.href = 'select-flight-back.html';
    }, 1200);
};
