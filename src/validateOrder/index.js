// src/validateOrder/index.js

const { DynamoDBClient, GetItemCommand } = require('@aws-sdk/client-dynamodb');

// Crear una instancia del cliente de DynamoDB
const client = new DynamoDBClient({ region: 'us-east-1' });

exports.handler = async (event) => {
    try {
        console.log('Event:', JSON.stringify(event, null, 2));
        
        // Suponiendo que el evento tiene la estructura { "orderId": "some-id", "orderDetails": { ... } }
        const { orderId, orderDetails } = event;

        // Validar el pedido (esto es un ejemplo, valida según tus criterios)
        if (!orderId || !orderDetails) {
            throw new Error('Invalid order data');
        }

        // Aquí podrías agregar lógica para validar el pedido en DynamoDB o algún otro servicio
        // Ejemplo: Verificar si el pedido ya existe
        const params = {
            TableName: 'OrderTable',
            Key: {
                OrderId: { S: orderId }  // El tipo de datos de DynamoDB puede ser diferente
            }
        };

        const command = new GetItemCommand(params);
        const result = await client.send(command);
        
        if (result.Item) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Order already exists',
                    orderId
                }),
                inventoryStatus: 'Insufficient'
            };
        }

        // Si todo está bien, continuar al siguiente estado
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Order is valid',
                orderId
            }),
            inventoryStatus: 'Available'
        };
    } catch (error) {
        console.error('Error:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error validating order',
                error: error.message
            })
        };
    }
};
