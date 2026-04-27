// select-flight-go.js - VERSIÓN FINAL SIMPLE Y FUNCIONAL

document.addEventListener('DOMContentLoaded', () => {
    initFlightData();
    renderFlightList();
});

function initFlightData() {
    if (!info) info = {};
    if (!info.flightInfo) info.flightInfo = {};

    const f = info.flightInfo;
    f.travel_type = f.travel_type || 1;
    f.adults = f.adults || 1;
    f.children = f.children || 0;

    if (!f.origin || typeof f.origin !== "object") {
        f.origin = { city: "Bogotá", code: "BOG" };
    }
    if (!f.destination || typeof f.destination !== "object") {
        f.destination = { city: "Medellín", code: "MDE" };
    }
}

function renderFlightList() {
    const container = document.getElementById("tickets-list");
    if (!container) return;

    container.innerHTML = "";

    const flights = [
        { takeoff: "07:24", landing: "08:29" },
        { takeoff: "12:00", landing: "13:05" },
        { takeoff: "18:49", landing: "19:54" }
    ];

    flights.forEach((flight) => {
        const card = document.createElement("div");
        card.className = "border-blue-1 rounded-10 p-3 mt-2 cursor-pointer";
        card.innerHTML = `
            <div class="d-flex justify-space-between align-items-center">
                <div>
                    <p class="fw-bold">${info.flightInfo.origin.city} → ${info.flightInfo.destination.city}</p>
                    <p>${flight.takeoff} - ${flight.landing}</p>
                </div>
                <div class="text-end">
                    <p class="fw-bold fs-4">$${(PRECIO_BASE || 46900).toLocaleString("es-ES")} COP</p>
                </div>
            </div>
        `;

        card.addEventListener("click", () => {
            selectFlight();
        });

        container.appendChild(card);
    });
}

function selectFlight() {
    const f = info.flightInfo;
    f.origin.ticket_type = "smart";
    f.origin.ticket_sched = { takeoff: "07:24", landing: "08:29" };

    if (typeof updateLS === "function") updateLS();

    const loader = document.querySelector(".loader");
    if (loader) loader.classList.add("show");

    setTimeout(() => {
        window.location.href = "select-flight-back.html";
    }, 800);
}
