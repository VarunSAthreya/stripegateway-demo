const { v4: uuid } = require("uuid");
const cors = require("cors");
const express = require("express");
const stripe = require("stripe")(`${process.env.STRIPE_SECRET_KEY}`);

const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(cors());

// ROUTES

app.get("/", (req, res) => {
    res.send("It works ");
});

app.post("/payment", (req, res) => {
    const { product, token } = req.body;
    console.log("PRODUCT", product);
    console.log("PRICE", product.price);
    const idempontencyKey = uuid();

    return stripe.customers
        .create({
            email: token.email,
            source: token.id,
        })
        .then((customer) => {
            stripe.charges.create(
                {
                    amount: product.price * 100,
                    currency: "inr",
                    customer: customer.id,
                    receipt_email: token.email,
                    description: `purchase of ${product.name}`,
                    shipping: {
                        name: token.card.name,
                        address: {
                            country: token.card.address_country,
                        },
                    },
                },
                { idempontencyKey }
            );
        })
        .then((result) => res.status(200).json(result))
        .catch((err) => console.log(err));
});

// LISTEN

app.listen(8282, () => console.log("listening at port 8282"));
