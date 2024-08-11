// lambda-functions/prepareOrder.js

const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log("Received event:", JSON.stringify(event, null, 2));

    const orderId = event.orderId;

    try {
        // Lógica para preparar la orden
        // Aquí podrías incluir lógica para interactuar con otros servicios o sistemas
        // Por simplicidad, solo estamos actualizando el estado en DynamoDB

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
                ':status': 'Prepared'
            }
        };

        await dynamoDB.update(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Order prepared successfully',
                orderId: orderId
            })
        };
    } catch (error) {
        console.error('Error preparing order:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error preparing order',
                error: error.message
            })
        };
    }
};
