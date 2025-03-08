const checkoutbtn = document.querySelector('#checkout');

checkoutbtn.addEventListener('click', () => {

    console.log("button clicked");

    fetch('/checkout-session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        // should be here to grab shopping cart info
        body: JSON.stringify(
            {
                // items: [
                //     { id: 1, quantity: 2 },
                //     { id: 2, quantity: 7 }
                // ]
            }
        )
    }).then(res => {

        if (res.ok) {
            return res.json();
        } else {
            return res.json().then(json => Promise.reject(json)) // throws an error
        }

    }).then(({ url }) => {

        window.location = url;

    }).catch(e => {

        console.log(e.error);

    });

});

const buyerdashboard = document.querySelector('#buyer-dashboard');

buyerdashboard.addEventListener('click', () => {

    console.log("button clicked");

    fetch('/payment-dashboard', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify(
            // {
            //     email: document.getElementById("email").value
            // }
        )
    }).then(res => {

        if (res.ok) {
            return res.json();
        } else {
            return res.json().then(json => Promise.reject(json)) // throws an error
        }

    }).then(({ url }) => {

        window.location = url;

    }).catch(e => {

        console.log(e.error);

    });

});

const stripeacc = document.querySelector('#create-stripe-connect-acc');

stripeacc.addEventListener('click', () => {

    console.log("button clicked");

    fetch('/account-connect', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify(
            {
                email: document.getElementById("email").value
            }
        )
    }).then(res => {

        if (res.ok) {
            return res.json();
        } else {
            return res.json().then(json => Promise.reject(json)) // throws an error
        }

    }).then(({ url }) => {

        window.location = url;

    }).catch(e => {

        console.log(e.error);

    });

});

const linkacc = document.querySelector('#link-stripe-connect-acc');

linkacc.addEventListener('click', () => {

    console.log("button clicked");

    fetch("/account_link", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            //account: connectedAccountId,
            account: 'acct_1R0EMhFWFoWYGzJM'
        }),
    })
        .then((response) => response.json())
        .then((json) => {
            const { url, error } = json;

            if (error) {
                console.log("error");
                return;
            }
            window.location.href = url;
        });

});