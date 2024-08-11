// lambda-functions/logError.js

const AWS = require('aws-sdk');
const cloudwatch = new AWS.CloudWatchLogs();

exports.handler = async (event) => {
    console.log("Received event:", JSON.stringify(event, null, 2));

    const logGroupName = process.env.LOG_GROUP_NAME;
    const logStreamName = process.env.LOG_STREAM_NAME;
    const errorMessage = event.errorMessage || 'Unknown error occurred';

    try {
        // Crear log stream si no existe
        await cloudwatch.createLogStream({ logGroupName, logStreamName }).promise();

        // Registrar el error en el log
        const logEvents = [
            {
                message: JSON.stringify({
                    timestamp: new Date().toISOString(),
                    errorMessage: errorMessage
                }),
                timestamp: Date.now()
            }
        ];

        await cloudwatch.putLogEvents({
            logGroupName,
            logStreamName,
            logEvents
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Error logged successfully'
            })
        };
    } catch (error) {
        console.error('Error logging error:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error logging error',
                error: error.message
            })
        };
    }
};
