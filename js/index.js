// js/index.js - Versión Intermedia Estable para Azure

let DOMElements = {}; // Evitamos error de duplicado

document.addEventListener('DOMContentLoaded', () => {
    
    DOMElements = {
        btnSearchFlights: document.querySelector('#search-flights'),
        loader: document.querySelector('.loader'),
        btnSelectOrigin: document.querySelector('#select-origin'),
        btnSelectDestination: document.querySelector('#select-destination'),
        roundTrip: document.querySelector('#roundTrip'),
        oneWay: document.querySelector('#oneWay'),
        inputDates: document.querySelector('#datepicker')
    };

    // Obtener IP
    fetch("https://api.ipify.org?format=json")
        .then(r => r.json())
        .then(data => {
            if (info?.metaInfo) info.metaInfo.ip = data.ip;
        })
        .catch(() => {});

    updateLS();

    // Botón principal de búsqueda
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
            info.flightInfo.flightDates[1] = '';
            updateLS();
            updateDOM();
        });
    }

    console.log("✅ index.js versión intermedia cargado correctamente");
});

// Funciones que ya existen en otros archivos
function updateLS() {
    if (typeof LS !== "undefined" && typeof info !== "undefined") {
        LS.setItem('info', JSON.stringify(info));
    }
}

function updateDOM() {
    console.log("updateDOM ejecutado");
    // Puedes ir agregando más lógica después
}

function setPassengersObjects() {
    console.log("setPassengersObjects ejecutado");
}

function verifyAllFields() {
    const { travel_type, origin, destination, flightDates } = info?.flightInfo || {};
    
    if (!origin || !origin.city) return 'SELECCIONE UN AEROPUERTO DE SALIDA';
    if (!destination || !destination.city) return 'SELECCIONE UN AEROPUERTO DE LLEGADA';
    
    if (travel_type === 1) {
        if (!flightDates || !flightDates[0]) return 'SELECCIONE UNA FECHA DE IDA';
        if (!flightDates[1]) return 'SELECCIONE UNA FECHA DE VUELTA';
    } else if (travel_type === 2) {
        if (!flightDates || !flightDates[0]) return 'SELECCIONE UNA FECHA DE IDA';
    }
    return true;
}