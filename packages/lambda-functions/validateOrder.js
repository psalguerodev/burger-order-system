const AWS = require('aws-sdk');
const eventBridgge = new AWS.EventBridge();

exports.handler = async (event) => {
    const order = JSON.parse(event.body);

    if (order && order.items && order.items.length > 0) {
        const params = {
            Entries: [
                {
                    EventBusName: process.env.EVENT_BUS_NAME,
                    Source: 'burger.order',
                    DetailType: 'OrderValidated',
                    Detail: JSON.stringify({
                        orderId: order.orderId,
                        items: order.items
                    })
                }
            ]
        };

        await eventBridgge.putEvents(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Order validated successfully!'
            })
        }
    } else {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Invalid order data'
            })
        }
    }

}