 const API_URL='https://cinema-node.herokuapp.com/';

 const headers = new Headers({
    'Accept': 'application/json',
    'Content-Type': 'application/json',
});


function request(url, method, dataset,headerz) {
    return new Request(url, {
        method: method,
        headers: headers,
        mode: 'cors',
        body: JSON.stringify(dataset)
    });
}


fetch(request(API_URL + "films", 'GET'))
    .then(res => res.json())
    .then(films => {
console.log(films);
    });