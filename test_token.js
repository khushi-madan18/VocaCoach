const axios = require('axios');

const apiKey = "fda6984b3c4e4645a967efb9e168adb6";

async function testEndpoint(name, url, method, params) {
    console.log(`--- Testing ${name} ---`);
    console.log(`URL: ${url}`);
    console.log(`Method: ${method}`);
    console.log(`Params: ${JSON.stringify(params)}`);

    try {
        const config = {
            method: method,
            url: url,
            headers: {
                authorization: apiKey,
                "content-type": "application/json",
            },
            data: method === 'POST' ? params : undefined,
            params: method === 'GET' ? params : undefined
        };

        const response = await axios(config);
        console.log(`SUCCESS:`, response.data);
    } catch (error) {
        console.error(`FAILED:`, error.response ? error.response.data : error.message);
    }
    console.log("\n");
}

async function run() {
    const v2Url = "https://api.assemblyai.com/v2/realtime/token";

    // Test 15: v2 POST with expires_in_seconds AND speech_model
    await testEndpoint("Test 15: v2 POST correct params?", v2Url, "POST", {
        expires_in_seconds: 3600,
        speech_model: "universal-streaming-english"
    });

}

run();
