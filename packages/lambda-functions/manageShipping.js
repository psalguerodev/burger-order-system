// lambda-functions/manageShipping.js

const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS(); // Usamos SNS para notificar el estado del envío

exports.handler = async (event) => {
    console.log("Received event:", JSON.stringify(event, null, 2));

    const orderId = event.orderId;

    try {
        // Lógica para gestionar el envío
        // Aquí podrías incluir la lógica para interactuar con servicios de envío o actualizar el estado en DynamoDB

        const params = {
            TableName: 'OrdersTable',
            Key: {
                orderId: orderId
            },
            UpdateExpression: 'set #status = :status',
            ExpressionAttributeNames: {
                '#status': 'status'
            },
            ExpressionAttributeValues: {
                ':status': 'Shipped'
            }
        };

        await dynamoDB.update(params).promise();

        // Notificar sobre el envío usando SNS
        const messageParams = {
            Message: `Order ${orderId} has been shipped.`,
            TopicArn: process.env.SNS_TOPIC_ARN // ARN del tópico SNS configurado en las variables de entorno
        };

        await sns.publish(messageParams).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Order shipped successfully',
                orderId: orderId
            })
        };
    } catch (error) {
        console.error('Error managing shipping:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error managing shipping',
                error: error.message
            })
        };
    }
};
