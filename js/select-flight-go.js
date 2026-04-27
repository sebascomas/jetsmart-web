// =============================================
// select-flight-go.js - VERSIÓN CORREGIDA FINAL
// =============================================

document.addEventListener('DOMContentLoaded', () => {
    fixFlightData();
    updateHeader();
    renderFlights();
});

function fixFlightData() {
    if (!info) info = {};
    if (!info.flightInfo) info.flightInfo = {};

    const f = info.flightInfo;
    f.travel_type = f.travel_type || 1;
    f.adults = f.adults || 1;
    f.children = f.children || 0;
    f.babies = f.babies || 0;

    if (!f.origin || typeof f.origin !== 'object') {
        f.origin = { city: "Bogotá", code: "BOG", name: "" };
    }
    if (!f.destination || typeof f.destination !== 'object') {
        f.destination = { city: "Medellín", code: "MDE", name: "" };
    }
    if (!f.flightDates || !Array.isArray(f.flightDates)) {
        f.flightDates = [Date.now(), 0];
    }
}

function updateHeader() {
    const originLabel = document.querySelector('#label-origin-code');
    const destLabel = document.querySelector('#label-destination-code');

    if (originLabel) originLabel.textContent = info.flightInfo.origin.code || 'BOG';
    if (destLabel) destLabel.textContent = info.flightInfo.destination.code || 'MDE';
}

function renderFlights() {
    const container = document.getElementById('tickets-list');
    if (!container) return;

    container.innerHTML = '';

    const sampleFlights = [
        { takeoff: '07:24', landing: '08:29' },
        { takeoff: '12:00', landing: '13:05' },
        { takeoff: '18:49', landing: '19:54' }
    ];

    sampleFlights.forEach((flight, index) => {
        const card = document.createElement('div');
        card.className = "border-blue-1 rounded-10 p-3 mt-2 cursor-pointer";
        card.style.border = "2px solid #00abc8";

        card.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <strong>${info.flightInfo.origin.city} → ${info.flightInfo.destination.city}</strong><br>
                    <span>${flight.takeoff} - ${flight.landing}</span>
                </div>
                <div class="text-end">
                    <strong class="fs-4">$${(PRECIO_BASE || 46900).toLocaleString('es-ES')}</strong><br>
                    <small>Tarifa SMART</small>
                </div>
            </div>
        `;

        card.addEventListener('click', () => selectFlight(index));
        container.appendChild(card);
    });
}

function selectFlight(index) {
    const f = info.flightInfo;

    f.origin.ticket_type = 'smart';
    f.origin.ticket_sched = { takeoff: '07:24', landing: '08:29' };

    if (typeof updateLS === 'function') updateLS();

    const loader = document.querySelector('.loader');
    if (loader) loader.classList.add('show');

    setTimeout(() => {
        window.location.href = 'select-flight-back.html';
    }, 1000);
}
