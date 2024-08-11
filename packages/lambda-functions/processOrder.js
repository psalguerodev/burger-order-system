const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  const orderId = event.orderId;
  const orderDetails = event.orderDetails;

  try {
    const params = {
      TableName: "OrdersTable",
      Item: {
        orderId: orderId,
        orderDetails: orderDetails,
        status: "Processed",
      },
    };

    await dynamodb.put(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Order processed successfully!",
        orderId: orderId,
      }),
    };

    
  } catch (error) {
    console.error("Error processing order:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error processing order",
        error: error.message,
      }),
    };
  }
};
