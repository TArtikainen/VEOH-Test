const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.set("views", "views");
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded( { extended: false } )); // for body-parser

app.use(express.static(__dirname + "/public")); // for opening the public directory and give access to main.css

const port = process.env.PORT || 4000;

function Product(productname, price, id) {
    this.productname = productname;
    this.price = price;
    this.id = id;
}

const product1 = new Product("orange", 10, 1);
const product2 = new Product("apple", 11, 2);
const product3 = new Product("banana", 12, 3);

const products = new Array(10);

products.fill("");

let product;

// products[2] = product3;

function placeProduct(product, id) {
    products[id-1] = product;
};

placeProduct(product3, 3);

const fontURL = "https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,600&display=swap";

console.log(products);

app.get("/", (req, res) => {
    res.render("index.ejs", { title : "Vegetable store", css : "main.css", fontURL, products } );
});

app.get("/admin", (req, res) => {
    res.render("admin.ejs", { title : "Vegetable store", subtitle: "Admin", css : "main.css", fontURL, products } );
});

app.post("/admin", (req, res) => {
    console.log(req.body.productname);
    if (req.body.productname.length == 0 || req.body.price.length == 0) {
        console.log("the user didn't add anything");
    } else {
        product = new Product(req.body.productname, Number(req.body.price), Number(req.body.id));
        placeProduct(product, req.body.id);
        
        
        // products.push(product);
        console.log(products);
    }
    res.redirect("/admin");
});

app.get("/updateproduct/:id", (req, res) => {
    
    // console.log(products);
    product = products[req.params.id-1];

    // console.log(req.params);
    // console.log(product);
    res.render("updateproduct.ejs", { title : "Vegetable store", subtitle: "update product", css : "../main.css", fontURL, products, product } );
});

app.post("/updateproduct/:id", (req, res) => {
    // console.log("--START OF UPDATE--");
    // console.log(products);
    // console.log(req.body.id);
    // console.log(product);
    if (req.body.id == product.id) {
        products[product.id-1].productname = req.body.productname;
        products[product.id-1].price = Number(req.body.price);
    } else {
        products[product.id-1] = "";
        product = new Product(req.body.productname, Number(req.body.price), Number(req.body.id));
        placeProduct(product, req.body.id);
    }
    // console.log(products);
    // console.log("--END OF UPDATE--");
    res.redirect("/admin");
});

app.get("/deleteproduct/:id", (req, res) => {

    product = products[req.params.id-1];    

    res.render("deleteproduct.ejs", { title : "Vegetable store", subtitle: "delete a product", css : "../main.css", fontURL, product });
});

app.post("/deleteproduct-confirmed/:id", (req, res) => {
    
    products[req.params.id-1] = "";

    res.redirect("/admin");
});

app.listen(8080, () => console.log(`Server is ready on ${port}.`));