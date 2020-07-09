import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import StripeCheckout from "react-stripe-checkout";

function App() {
    const [product, setProduct] = useState({
        name: "ProductName",
        price: 150,
        productBy: "Author",
    });

    const makePayment = (token) => {
        const body = {
            token,
            product,
        };
        const headers = {
            "Content-Type": "application/json",
        };

        return fetch(`https://loaclhost:8282/payment`, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
        })
            .then((response) => {
                console.log("Response ", response);
                const { status } = response;
                console.log("STATUS ", status);
            })
            .catch((err) => console.log(err));
    };

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />

                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
                <StripeCheckout
                    stripeKey={process.env.REACT_APP_KEY}
                    token={makePayment}
                    name="Buy Product"
                    amount={product.price * 100}
                    currency="INR"
                    shippingAddress
                    billingAddress
                >
                    <button className="btn-large blue ">
                        Buy {product.name} at {product.price} Rs Now
                    </button>
                </StripeCheckout>
            </header>
        </div>
    );
}

export default App;
