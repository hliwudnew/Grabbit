const button = document.querySelector('button');

button.addEventListener('click', () => {

    console.log("button clicked");

    fetch('/checkout-session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        // should be here to grab shopping cart info
        body: JSON.stringify(
            {
                items: [
                    {id: 1, quantity: 2},
                    {id: 2, quantity: 7}
                ]
            }
        )
    }).then(res => {

        if(res.ok) {
            return res.json();
        }else{
            return res.json().then(json => Promise.reject(json)) // throws an error
        }

    }).then(({ url }) => {

        window.location = url;

    }).catch(e => {

        console.log(e.error);

    });

});