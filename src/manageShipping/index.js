// src/manageShipping/index.js

const { DynamoDBClient, UpdateItemCommand } = require('@aws-sdk/client-dynamodb');

// Crear una instancia del cliente de DynamoDB
const dynamodb = new DynamoDBClient({ region: 'us-east-1' }); // Configura la región según sea necesario

exports.handler = async (event) => {
    try {
        console.log('Event:', JSON.stringify(event, null, 2));

        // Suponiendo que el evento tiene la estructura { "orderId": "some-id", "orderDetails": { ... } }
        const { orderId, orderDetails } = event;

        // Validar que los datos necesarios estén presentes
        if (!orderId || !orderDetails) {
            throw new Error('Invalid order data');
        }

        // Lógica para gestionar el envío (esto puede ser una llamada a un servicio externo, cálculos, etc.)
        // Por simplicidad, vamos a suponer que solo actualizamos el estado en DynamoDB
        const updateParams = {
            TableName: 'OrderTable', // Nombre de la tabla DynamoDB donde se almacena el pedido
            Key: {
                OrderId: { S: orderId }
            },
            UpdateExpression: 'SET #status = :status, shippingAt = :shippingAt',
            ExpressionAttributeNames: {
                '#status': 'status'
            },
            ExpressionAttributeValues: {
                ':status': { S: 'Shipped' },
                ':shippingAt': { S: new Date().toISOString() }
            }
        };

        const command = new UpdateItemCommand(updateParams);
        await dynamodb.send(command);

        // Simular una respuesta de un servicio de envío externo (opcional)
        // Por ejemplo, podrías hacer una llamada HTTP a un API de logística aquí

        // Retornar una respuesta exitosa
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Order is being shipped',
                orderId
            })
        };
    } catch (error) {
        console.error('Error:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error managing shipping',
                error: error.message
            })
        };
    }
};
