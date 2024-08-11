// src/notifyUser/index.js

const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

// Crear una instancia del cliente de SES
const ses = new SESClient({ region: 'us-east-1' }); // Configura la región de SES según sea necesario

exports.handler = async (event) => {
    try {
        console.log('Event:', JSON.stringify(event, null, 2));

        // Suponiendo que el evento tiene la estructura { "orderId": "some-id", "userEmail": "user@example.com", "message": "..." }
        const { orderId, userEmail, message } = event;

        // Validar que los datos necesarios estén presentes
        if (!orderId || !userEmail || !message) {
            throw new Error('Invalid notification data');
        }

        // Configurar los parámetros del correo electrónico
        const params = {
            Destination: {
                ToAddresses: [userEmail]
            },
            Message: {
                Body: {
                    Text: {
                        Charset: "UTF-8",
                        Data: `Dear user,\n\nWe encountered an issue with your order ${orderId}:\n\n${message}\n\nBest regards,\nYour Company`
                    }
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: 'Order Notification'
                }
            },
            Source: 'no-reply@yourdomain.com' // Reemplaza con tu dirección de correo electrónico verificada en SES
        };

        const command = new SendEmailCommand(params);
        await ses.send(command);

        // Retornar una respuesta exitosa
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Notification sent successfully',
                orderId
            })
        };
    } catch (error) {
        console.error('Error:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error notifying user',
                error: error.message
            })
        };
    }
};
