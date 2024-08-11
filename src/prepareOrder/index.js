// src/prepareOrder/index.js

const { DynamoDBClient, UpdateItemCommand } = require('@aws-sdk/client-dynamodb');

// Crear una instancia del cliente de DynamoDB
const client = new DynamoDBClient({ region: 'us-east-1' });

exports.handler = async (event) => {
    try {
        console.log('Event:', JSON.stringify(event, null, 2));

        // Suponiendo que el evento tiene la estructura { "orderId": "some-id", "orderDetails": { ... } }
        const { orderId, orderDetails } = event;

        // Validar que los datos necesarios estén presentes
        if (!orderId || !orderDetails) {
            throw new Error('Invalid order data');
        }

        // Actualizar el estado del pedido en DynamoDB para reflejar que está en preparación
        const updateParams = {
            TableName: 'OrderTable', // Nombre de la tabla DynamoDB donde se almacena el pedido
            Key: {
                OrderId: { S: orderId } // El tipo de datos de DynamoDB puede ser diferente
            },
            UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt',
            ExpressionAttributeNames: {
                '#status': 'status'
            },
            ExpressionAttributeValues: {
                ':status': { S: 'Preparing' },
                ':updatedAt': { S: new Date().toISOString() }
            }
        };

        const command = new UpdateItemCommand(updateParams);
        await client.send(command);

        // Retornar una respuesta exitosa
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Order is being prepared',
                orderId
            })
        };
    } catch (error) {
        console.error('Error:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error preparing order',
                error: error.message
            })
        };
    }
};
