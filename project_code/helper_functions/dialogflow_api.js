const dialogflow = require('@google-cloud/dialogflow');
const fs = require('fs');

const CREDENTIALS = JSON.parse(fs.readFileSync('./student-wellbeing-chatbot-9bui-4c7bd588f1aa.json', 'utf-8'));

const PROJECID = CREDENTIALS.project_id;

const CONFIGURATION = {
    credentials: {
        private_key: CREDENTIALS.private_key,
        client_email: CREDENTIALS.client_email
    }
}

const sessionClient = new dialogflow.SessionsClient(CONFIGURATION);

const detectIntent = async (languageCode, queryText, sessionId) => {

    let sessionPath = sessionClient.projectAgentSessionPath(PROJECID, sessionId);

    let request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: queryText,
                languageCode: languageCode,
            },
        },
    };

    try {
        const responses = await sessionClient.detectIntent(request);
        console.log("DATA:");
        console.log(responses);

        const r = responses[0].queryResult;

        // fulfillmentText = chatbot response, convert to JSON for reason I do not yet know
        result = JSON.stringify({
            text: r.fulfillmentText,
            buttons: ["I like this response", "I don't like this response"] // pressing the buttons registers it as a text message from user
        });

        return {
            status: 1,
            text: result
        };
    } catch (error) {
        console.log(`Error at dialogflow-api.js detectIntent --> ${error}`);
        return {
            status: 1,
            // text: '{"text": "I don\'t quite understand what you said.", "buttons": [\'button 1\', \'button 2\']}'
            text: 'Error at dialogflow detect intent.'
        };
    }
};

detectIntent('en', 'hello', 'abcdefg123456')
    .then((res) => {
        console.log(res);
    })
//     .then((res) => {
//         console.log(err);
//     })

module.exports = {
    detectIntent
};