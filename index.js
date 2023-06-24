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
const topBanner = require('./data/topBanner.json');
const adminList = require('./data/admin.json');



app.get('/', (req, res) => {
    res.send('gogoshop server is running');
})


app.get('/search', (req, res) => {
    const searchQuery = req.query.q;
    console.log(searchQuery);
    const products = allproducts.filter(product => product.name.toLowerCase().includes(searchQuery.toLowerCase()))
    res.send(products)
})


app.get('/home', (req, res) => {
    console.log('req for ', req.path);

    res.send({ categories, topBanner, bottomBanner, footerData });


})
app.get('/footer', (req, res) => {
    console.log('req for ', req.path);

    res.send(footerData);


})
app.post('/footer', (req, res) => {
    
    console.log(req.body);

    res.send(true);


})

// app.get('/category/:category_slug')

app.get('/sub-category/:subcategory_slug', (req, res) => {
    console.log('req for ', req.path);
    let allProductsData = [];
    let IndividualProduct = null;


    const subcategory = subcategories.find(item => item.subcategory_slug === req.params.subcategory_slug);



    if (subcategory) {
        subcategory.products.map(subCatProductItem => {

            IndividualProduct = allproducts.find(productItem => productItem._id === subCatProductItem._id);


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


        cartItem = allproducts.find(productItem => productItem._id === i._id);
if(!cartItem){

}
        cart.push({
            "img": cartItem.img,
            "name": cartItem.name,
            "_id": cartItem._id,
            "size": cartItem.size,
            "sellingPrice": cartItem.sellingPrice,
            "quantity": i.quantity
        }
        )
    })
    return cart;
}


app.delete('/carts', (req, res) => {

    console.log(req.body._id);

    for (let i = 0; i < cartsdata.length; i++) {
        if (cartsdata[i]._id === req.body._id) {
            cartsdata.splice(i, 1);
            break; // Assuming there is only one object with "_id": "901"
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
    console.log(req.params.product_slug_name)

    res.send(allproducts.find(item => item.slug_name === req.params.product_slug_name))

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
        email: 'hossainahamed6872@gmail.com',
        address: '29/1,Road 21, New Chasara,jamtola,Narayanganj',
        gender: 'Male',
        imgURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D&w=1000&q=80'
    }
    res.send({ user: user, token: 'ksdfjjkldsfjsalk' })

})




// admin 

app.post('/admin/jwt', (req, res) => {
    const admindata = req.body.logininfo;
    console.log(admindata)

    const response = {
        email: 'djfjkjsda',
        jwt: 'dasjjjdsakf'

    }



    res.send(response)

})

app.post('/admin/signout', (req, res) => {


    console.log(req.body)

    res.send(true)

})


//  get adminlist 
app.get('/admin/admin-list', (req, res) => {

    res.send(adminList)

})




// req to change pass 
app.patch('/admin/admin-list/:admin_Id/changePass', (req, res) => {
    console.log(req.params.admin_Id)
    res.send(adminList)
})

// req to delete admin 
app.delete('/admin/admin-list/:admin_Id/delete', (req, res) => {
    console.log(req.params.admin_Id);
    res.send(adminList)
})

app.post('/admin/admin-list/add-admin', (req, res) => {
    console.log(req.body)
    res.send(adminList)
})



// get all categories 
app.get('/admin/category-list', (req, res) => {
    res.send(categories);
})


// upload new category 
app.post('/admin/category-list/upload-category', (req, res) => {
    console.log("cate", req.body)

    /*
    
    update the category 
    then send to me
    */
    console.log('dasa')
    res.send(categories);
})

// get category data for editting 
app.get('/admin/category-list/:category_slug/edit', (req, res) => {


    res.send(categories.find(category => category.category_slug === req.params.category_slug));
})

// update category data after editing 
app.patch('/admin/category-list/:category_slug/edit', (req, res) => {
    console.log(req.body)

    res.send(true);
})


// send category data after delete 
app.delete('/admin/category-list/:category_slug/delete', (req, res) => {
    console.log(req.params.category_slug)

    res.send(categories);
})


// update status of category data after editing 
app.patch('/admin/category-list/:category_slug/edit-status', (req, res) => {
     console.log(req.body)

    res.send(true);
})


// get all subcategories 
app.get('/admin/subcategory-list', (req, res) => {
    res.send(subcategories);
})


// post new subcategory 
app.post('/admin/subcategory-list/upload-subcategory', (req, res) => {
 console.log(req.body)

    res.send(true);
})

// get specific sub category for edit 
app.get('/admin/subcategory-list/:subcategory_slug/edit', (req, res) => {


    res.send({ categories });
})

// update specific sub category after edit 
app.patch('/admin/subcategory-list/:subcategory_slug/edit', (req, res) => {


    res.send({});
})

// update status of subcategory data after editing 
app.patch('/admin/subcategory-list/:subcategory_slug/edit-status', (req, res) => {
     console.log(req.body);

    res.send({});
})


// delete status of subcategory data after editing 
app.delete('/admin/subcategory-list/:subcategory_slug/delete', (req, res) => {
     console.log(req.params.subcategory_slug);

    res.send(subcategories);
})

// prdouct ______________

// get all [product for product list]  
app.get('/admin/products-list', (req, res) => {
    res.send(allproducts);
})



// get all subcategories  & that product 
app.patch('/admin/products-list/:product_slug_name/edit', (req, res) => {
    res.send(allproducts);
})


// get all subcategories  & that product 
app.patch('/admin/products-list/:product_slug_name/edit-status', (req, res) => {
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

// inventory _____________
app.get('/admin/inventory/:product_slug/add', (req, res) => {
    console.log(req.params.product_slug)

    res.send(allproducts.find(item => item.slug_name === req.params.product_slug))

})


app.patch('/admin/inventory/:product_slug/add', (req, res) => {
    console.log(req.body)

    res.send(true)

})


app.listen(port, () => {
    console.log('server is running on port ', port);
})