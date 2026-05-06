// js/index.js - Versión estable para Azure (mayo 2026)

document.addEventListener('DOMContentLoaded', () => {
    
    // Definimos DOMElements solo una vez
    window.DOMElements = {
        btnSearchFlights: document.querySelector('#search-flights'),
        loader: document.querySelector('.loader'),
        btnSelectOrigin: document.querySelector('#select-origin'),
        btnSelectDestination: document.querySelector('#select-destination'),
        roundTrip: document.querySelector('#roundTrip'),
        oneWay: document.querySelector('#oneWay')
    };

    // IP
    fetch("https://api.ipify.org?format=json")
        .then(r => r.json())
        .then(data => {
            if (info?.metaInfo) info.metaInfo.ip = data.ip;
        })
        .catch(() => {});

    if (typeof updateLS === "function") updateLS();

    // Botón de búsqueda
    if (window.DOMElements.btnSearchFlights) {
        window.DOMElements.btnSearchFlights.addEventListener('click', () => {
            if (typeof verifyAllFields === "function") {
                const validation = verifyAllFields();
                if (validation === true) {
                    if (typeof setPassengersObjects === "function") setPassengersObjects();
                    if (typeof updateLS === "function") updateLS();
                    
                    if (window.DOMElements.loader) window.DOMElements.loader.classList.add('show');
                    
                    setTimeout(() => {
                        window.location.href = 'select-flight-go.html';
                    }, 1500);
                } else {
                    alert(validation);
                }
            }
        });
    }

    console.log("✅ index.js estable cargado en Azure");
});