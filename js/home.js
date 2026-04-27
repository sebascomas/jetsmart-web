/**
 * HOME.JS - Versión Corregida
 */

function updateLS() {
    if (typeof LS !== 'undefined') {
        LS.setItem("info", JSON.stringify(info));
    } else if (typeof window.LS !== 'undefined') {
        window.LS.setItem("info", JSON.stringify(info));
    }
}

// Esperar a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {

    const btnPersonas = document.getElementById("personas");
    const btnMano = document.getElementById("mano");

    if (btnPersonas) {
        btnPersonas.addEventListener("click", function (e) {
            e.preventDefault();
            
            if (info && info.checkerInfo) {
                info.checkerInfo.mode = "personas";
                updateLS();
            }

            window.location.href = "index.html";   // Cambiado a index.html (más seguro)
        });
    }

    if (btnMano) {
        btnMano.addEventListener("click", function (e) {
            e.preventDefault();
            
            if (info && info.checkerInfo) {
                info.checkerInfo.mode = "mano";
                updateLS();
            }

            window.location.href = "index.html";   // Cambiado a index.html
        });
    }
});
