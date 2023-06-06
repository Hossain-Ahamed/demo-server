const express = require('express');
const cors = require('cors');
const app = express();


app.use(cors());
app.use(express.json());


const port = process.env.PORT || 5000;


const footerData = require('./data/footer.json');
const AllproductsData = require('./data/subcategory.json');
const subcategories = require('./data/subcategory.json');
const orderstatus = require('./data/orderStatus.json');
const categories = require('./data/category.json');
const allproducts = require('./data/AllProducts.json');
const cartsdata = require('./data/cartsdata.json');
const productDetailInformation = require('./data/ProductDetail.json');
const Allorders = require('./data/AllOrders.json');
const PreviousOrderDetailInfo = require('./data/PreviousOrderDetailInfo.json')



app.get('/', (req, res) => {
    res.send('gogoshop server is running');
})


app.get('/home', (req, res) => {
    console.log('req for ', req.path);

    res.send({ categories, AllproductsData, footerData });


})
app.get('/sub-category/:subcategory_slug', (req, res) => {
    console.log('req for ', req.path);
    let allProductsData = [];
    let IndividualProduct = null;


    const subcategory = subcategories.find(item => item.subcategory_slug === req.params.subcategory_slug);



    if (subcategory) {
        subcategory.products.map(subCatProductItem => {

            IndividualProduct = allproducts.find(productItem => productItem.product_id === subCatProductItem.product_id);


            allProductsData.push(IndividualProduct)
        })
    }

    console.log(allProductsData.length);

    res.send({
        "subcategory_slug": subcategory.subcategory_slug,
        "subcategoryname": subcategory.subcategoryname,
        "products": allProductsData
    });


})




app.get('/orderstatus/:orderId', (req, res) => {

    console.log('req for ', req.path)


    if (orderstatus) {

        res.send(orderstatus);
    } else {

        res.send(403) //unauthorized
    }

})


app.get('/carts', (req, res) => {
    res.send(cartsdata)

})

app.patch('/carts', (req, res) => {
    console.log(req.body);
    res.send(cartsdata)

})
app.get('/cartsWithImage', (req, res) => {


    let cart = [];
    let cartItem = null;


    cartsdata.map(i => {


        cartItem = allproducts.find(productItem => productItem.product_id === i.product_id);

        cart.push({
            "img": cartItem.img,
            "name": cartItem.name,
            "product_id": cartItem.product_id,
            "size": cartItem.size,
            "buyingprice": cartItem.finalPrice,
            "quantity": i.quantity
        }
        )
    })
    
    
    res.send(cart)

})
app.get('/productDetail/:product_slug_name', (req, res) => {

    res.send(productDetailInformation.find(item => item.slug_name === req.params.product_slug_name))

})
app.get('/allOrders', (req, res) => {

    res.send(Allorders)

})

app.get('/completedOrder/:orderId', (req, res) => {

    console.log(PreviousOrderDetailInfo)
    res.send(PreviousOrderDetailInfo)

})





// //carousel img
// app.get('/carousel', (req, res) => {
//     res.send(carousel.filter(item => item.isActive === true));
// })



// // all courses
// app.get('/courses', (req, res) => {
//     res.send(courses.filter(item => item.isActive === true));
// })



// // individual course
// app.get('/courses/:courseID', (req, res) => {
//     let data = courses.find(item => item._id === req.params.courseID && item.isActive === true)
//     data ? res.send(data) : res.send([]);
// })


// // all blog
// app.get('/blog', (req, res) => {
//     res.send(blog);
// })



app.listen(port, () => {
    console.log('server is running on port ', port);
})