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

const Allorders = require('./data/AllOrders.json');
const PreviousOrderDetailInfo = require('./data/PreviousOrderDetailInfo.json');
const bottomBanner = require('./data/bottomBanner.json');
const topBanner  = require('./data/topBanner.json');



app.get('/', (req, res) => {
    res.send('gogoshop server is running');
})


app.get('/home', (req, res) => {
    console.log('req for ', req.path);

    res.send({ categories, topBanner,bottomBanner, footerData });


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

app.patch('/carts', (req, res) => {
    console.log(req.body);


    cartsdata.push(req.body);


    let cart = cartWithImage(cartsdata);
    res.send(cart)


})


app.post('/carts', (req, res) => {
    console.log(req.body);
    res.send(cartsdata)

})

const cartWithImage = parameterData => {
    let cart = [];
    let cartItem = null;


    parameterData.map(i => {


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
    return cart;
}


app.delete('/carts', (req, res) => {

    console.log(req.body.product_id);

    for (let i = 0; i < cartsdata.length; i++) {
        if (cartsdata[i].product_id === req.body.product_id) {
            cartsdata.splice(i, 1);
            break; // Assuming there is only one object with "product_id": "901"
        }
    }



    let cart = cartWithImage(cartsdata);
    res.send(cart)


})


app.get('/carts', (req, res) => {
    let cart = cartWithImage(cartsdata);
    res.send(cart);

})


app.get('/confirmedCartItems', (req, res) => {
    let cart = cartWithImage(cartsdata);
    const shippingCharge = 150;
    res.send({
        "products": cart,
        "shippingCharge": shippingCharge
    });

})


app.get('/productDetail/:product_slug_name', (req, res) => {

    res.send(allproducts.find(item => item.product_slug === req.params.product_slug_name))

})



app.get('/allOrders', (req, res) => {

    res.send(Allorders)

})

app.get('/completedOrder/:orderId', (req, res) => {

    console.log(PreviousOrderDetailInfo)
    res.send(PreviousOrderDetailInfo)

})

app.post('/user', (req, res) => {

    console.log(PreviousOrderDetailInfo)
    res.send(PreviousOrderDetailInfo)

})


app.post('/jwt', (req, res) => {
    const userData = req.body;
    console.log(userData.email);

    const user = {
        id: 32984,
        name: 'Hossain Ahamed',
        phone: '01868726172',
        email:'hossainahamed6872@gmail.com',
        address: '29/1,Road 21, New Chasara,jamtola,Narayanganj',
        gender: 'Male',
        imgURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D&w=1000&q=80'
    }
    res.send({user:user , token: 'ksdfjjkldsfjsalk'})

})

app.post('/admin/jwt', (req, res) => {
    const admindata = req.body;
    console.log(admindata);

    res.send(admindata)

})



// admin 



// get all categories 
app.get('/admin/category-list', (req, res) => {
    res.send(categories);
})


// upload new category 
app.post('/admin/category-list/upload-category', (req, res) => {
    res.send(categories);
})

// get category data for editting 
app.get('/admin/category-list/:category_slug/edit', (req, res) => {
  

    res.send(categories.find(category =>category.category_slug === req.params.category_slug));
})

// update category data after editing 
app.patch('/admin/category-list/:category_slug/edit', (req, res) => {
  

    res.send(categories.find(category =>category.category_slug === req.params.category_slug));
})


// update status of category data after editing 
app.patch('/admin/category-list/:category_slug/edit-status', (req, res) => {
  

    res.send({});
})


// get all subcategories 
app.get('/admin/subcategory-list', (req, res) => {
    res.send(subcategories);
})


// post new subcategory 
app.post('admin/subcategory-list/upload-subcategory', (req, res) => {
  

    res.send({});
})

// get specific sub category for edit 
app.get('/admin/subcategory-list/:subcategory_slug/edit', (req, res) => {
  

    res.send({});
})

// update specific sub category after edit 
app.patch('/admin/subcategory-list/:subcategory_slug/edit', (req, res) => {
  

    res.send({});
})

// update status of subcategory data after editing 
app.patch('/admin/subcategory-list/:subcategory_slug/edit-status', (req, res) => {
  

    res.send({});
})

// prdouct ______________

// get all subcategories 
app.get('/admin/products-list', (req, res) => {
    res.send(allproducts);
})


// __________________________________top banner admin_______________________________
app.get('/admin/top-banner', (req, res) => {
    res.send(topBanner);
})

// new top banner upload 
app.post('/admin/top-banner', (req, res) => {
    res.send(subcategories);
})


// bottom banner admin
app.get('/admin/bottom-banner', (req, res) => {
    res.send(bottomBanner);
})


// all banner 
app.post('/admin/bottom-banner', (req, res) => {
    res.send(subcategories);
})

app.listen(port, () => {
    console.log('server is running on port ', port);
})