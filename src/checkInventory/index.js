// src/checkInventory/index.js

const { DynamoDBClient, GetItemCommand } = require('@aws-sdk/client-dynamodb');

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

        // Aquí podrías agregar lógica para verificar el inventario en DynamoDB o algún otro servicio
        // Ejemplo: Verificar si el inventario está disponible
        const inventoryParams = {
            TableName: 'InventoryTable', // Supongamos que tienes una tabla de inventario
            Key: {
                ItemId: { S: orderDetails.itemId } // El tipo de datos de DynamoDB puede ser diferente
            }
        };

        const command = new GetItemCommand(inventoryParams);
        const inventoryResult = await client.send(command);
        const inventoryStatus = inventoryResult.Item && inventoryResult.Item.Quantity.N > 0 ? 'Available' : 'Insufficient';

        // Decidir el siguiente estado basado en el inventario
        if (inventoryStatus === 'Available') {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: 'Inventory is available',
                    inventoryStatus
                })
            };
        } else {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: 'Inventory is insufficient',
                    inventoryStatus
                }),
                inventoryStatus
            };
        }
    } catch (error) {
        console.error('Error:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error checking inventory',
                error: error.message
            })
        };
    }
};
