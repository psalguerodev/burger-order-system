// src/logError/index.js

const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');

// Crear una instancia del cliente de DynamoDB
const dynamodb = new DynamoDBClient({ region: 'us-east-1' }); // Configura la región según sea necesario

exports.handler = async (event) => {
    try {
        console.log('Event:', JSON.stringify(event, null, 2));

        // Suponiendo que el evento tiene la estructura { "orderId": "some-id", "errorMessage": "..." }
        const { orderId, errorMessage } = event;

        // Validar que los datos necesarios estén presentes
        if (!orderId || !errorMessage) {
            throw new Error('Invalid error data');
        }

        // Preparar el objeto para guardar en DynamoDB
        const errorLog = {
            TableName: 'ErrorLogTable', // Nombre de la tabla DynamoDB donde se almacenan los errores
            Item: {
                OrderId: { S: orderId },
                ErrorMessage: { S: errorMessage },
                Timestamp: { S: new Date().toISOString() }
            }
        };

        const command = new PutItemCommand(errorLog);
        await dynamodb.send(command);

        // Retornar una respuesta exitosa
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Error logged successfully',
                orderId
            })
        };
    } catch (error) {
        console.error('Error:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error logging the error',
                error: error.message
            })
        };
    }
};
