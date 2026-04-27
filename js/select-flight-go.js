// js/select-flight-go.js - Versión simplificada y corregida

document.addEventListener('DOMContentLoaded', () => {
    updateDOM();
    listFlights();
});

const updateDOM = () => {
    if (!info?.flightInfo) return;
    const { origin = {}, destination = {} } = info.flightInfo;

    const labelOrigin = document.querySelector('#label-origin-code');
    const labelDestination = document.querySelector('#label-destination-code');

    if (labelOrigin) labelOrigin.textContent = origin.code || '';
    if (labelDestination) labelDestination.textContent = destination.code || '';
};

const listFlights = () => {
    const container = document.getElementById('tickets-list');
    if (!container) return;

    container.innerHTML = '';

    // Solo mostramos 3 vuelos de ejemplo para simplificar
    const flights = [
        { id: 0, takeoff: '07:24', landing: '08:29' },
        { id: 1, takeoff: '12:00', landing: '13:05' },
        { id: 2, takeoff: '18:49', landing: '19:54' }
    ];

    flights.forEach(flight => {
        const div = document.createElement('div');
        div.className = "border-blue-1 rounded-10 p-3 mt-2 cursor-pointer";
        div.innerHTML = `
            <div class="d-flex justify-space-between align-items-center">
                <div>
                    <p class="fw-bold">${info.flightInfo.origin?.city || 'Origen'} → ${info.flightInfo.destination?.city || 'Destino'}</p>
                    <p>${flight.takeoff} - ${flight.landing}</p>
                </div>
                <p class="fw-bold fs-4">$${ (PRECIO_BASE || 46900).toLocaleString('es-ES') } COP</p>
            </div>
        `;

        div.addEventListener('click', () => {
            selectFlight(flight.id);
        });

        container.appendChild(div);
    });
};

const selectFlight = (flightId) => {
    if (!info?.flightInfo) return;

    info.flightInfo.origin.ticket_type = 'smart';   // Por defecto Smart
    info.flightInfo.origin.ticket_sched = { takeoff: '07:24', landing: '08:29' };

    if (typeof updateLS === 'function') updateLS();

    const loader = document.querySelector('.loader');
    if (loader) loader.classList.add('show');

    setTimeout(() => {
        window.location.href = 'select-flight-back.html';
    }, 1200);
};
