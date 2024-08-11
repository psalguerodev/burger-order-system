// lambda-functions/notifyUser.js

const AWS = require('aws-sdk');
const sns = new AWS.SNS(); // Usamos SNS para notificar al usuario

exports.handler = async (event) => {
    console.log("Received event:", JSON.stringify(event, null, 2));

    const orderId = event.orderId;
    const userEmail = event.userEmail;

    try {
        // Construir el mensaje
        const message = `Your order ${orderId} has been processed successfully.`;

        // Parámetros para el mensaje SNS
        const params = {
            Message: message,
            Subject: 'Order Notification',
            MessageAttributes: {
                'email': {
                    DataType: 'String',
                    StringValue: userEmail
                }
            },
            TopicArn: process.env.SNS_TOPIC_ARN // ARN del tópico SNS configurado en las variables de entorno
        };

        // Publicar mensaje en SNS
        await sns.publish(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Notification sent successfully',
                orderId: orderId
            })
        };
    } catch (error) {
        console.error('Error notifying user:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error notifying user',
                error: error.message
            })
        };
    }
};
