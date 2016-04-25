var restify = require('restify');
var server = require('./server');

var client = restify.createJsonClient({
    url: 'http://localhost:3000'
});

// a static product to CREATE READ UPDATE DELETE

var testProduct = {
    id: "123",
    name: "Sri Harsha Chennavajjala",
    os: "Windows 10",
    chipset: "AMD",
    cpu: "Quad Core AMD A8",
    gpu: "AMD Radeon R8"
};


function getAllProducts() {
    client.get('/products', function (err, req, res, products) {
        if (err) {
            console.log("An error occurred >>>>>>");
            console.log(err);
            return err;
        } else {
            console.log("Total products " + products.length);
            console.log('All products >>>>>>>');
            console.log(products);
            return "success";
        }
    });
}

function saveProduct(product) {
    var p = product ? product : testProduct; // override with global product if nothing is supplied
    client.post('/product', p, function (err, req, res, product) {
        if (err) {
            console.log("An error occurred >>>>>>");
            console.log(err);
        } else {
            console.log('Product saved >>>>>>>');
            console.log(product);
        }
    });
}

function getOneProduct(id) {
    var id = id ? id : testProduct.id;
    client.get('/product/' + id, function (err, req, res, product) {
        if (err) {
            console.log("An error occurred >>>>>>");
            console.log(err);
        } else {
            console.log('Product with id ' + id + '  >>>>>>>');
            console.log(product);
        }
    });
}

function updateProduct(product) {
    var p = product ? product : testProduct;
    p.price = "1000 USD",
    client.put('/product/' + p.id, p, function (err, req, res, status) {
        if (err) {
            console.log("An error occurred >>>>>>");
            console.log(err);
        } else {
            console.log('Product saved >>>>>>>');
            console.log(status);
        }

    });
}


// to see the output when you the run the client, A nested async callback system to do the above steps
console.log("\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> \n");
client.get('/products', function (err, req, res, products) {
    if (err) console.log("Oops : ", err);
    else console.log('Total products : ', products.length);
    console.log("\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> \n");

    client.post('/product', testProduct, function (err, req, res, prod) {
        if (err) console.log("Oops : ", err);
        else console.log('Inserted product : ', prod);
        console.log("\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> \n");

        client.get('/product/' + testProduct.id, function (err, req, res, prod) {
            if (err) console.log("Oops : ", err);
            else console.log('Product with ID :' + testProduct.id + ' :: ', prod);
            console.log("\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> \n");

            client.put('/product/' + testProduct.id, {
                price: "999 USD"
            }, function (err, req, res, status) {
                if (err) console.log("Oops : ", err);
                else console.log('Product Updated status :', status);
                console.log("\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> \n");

                client.get('/product/' + testProduct.id, function (err, req, res, prod) {
                    if (err) console.log("Oops : ", err);
                    else console.log('Product with ID :' + testProduct.id + ' :: ', prod);
                    console.log("\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> \n");

                    //client.del('/product/' + testProduct.id, function (err, req, res, status) {
                    //    if (err) console.log("Oops : ", err);
                    //    else console.log('Product deleted status :', status);
                    //    console.log("\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> \n");
                    //    client.get('/products', function (err, req, res, products) {
                    //        if (err) console.log("Oops : ", err);
                    //        else console.log('Total products : ', products.length);
                    //        console.log("\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> \n");
                    //    });
                    //
                    //});
                });
            });
        });
    });
});