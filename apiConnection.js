const API_URL = 'http://localhost:3001/';
const headers = new Headers({
    'Accept': 'application/json',
    'Content-Type': 'application/json',
});


function request(url, method, dataset) {
    return new Request(url, {
        method: method,
        headers: headers,
        mode: 'cors',
        body: JSON.stringify(dataset)
    });
}

export { API_URL, headers, request }