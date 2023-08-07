const { profile } = require('console');
const express = require('express');
const path = require('path');
const app = express();
const port = 8000;

app.set('view engine', 'ejs');
// setting the path for the views folder so that it can be accesed outside the program folder
app.set('views', path.join(__dirname, '/views'));
//setting the path for the public folder so that we we can access our own scripts and styles
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
    console.log(`listening at port:${port}`);
})
// for parsing the post request we need to use req.body

// req.body==> contains key-value pairs of data submitted in the request body. By default it is undefined. and is populated when we use body parsing middleware such as express.json() or express.urlencoded().


// to use the express.urlencoded() we have to pass it inside the app.use

app.use(express.urlencoded({ extended: true }));
// to parse the json files we use the express.json() middleware
app.use(express.json());

// adding the uuid package by npm installing it for getting unique id's
const { v4: uuid } = require('uuid');
const pizzaData = [
    {
        "name": "Blooming Onion & paperika",
        "discription": "Hot & spicy pizza with a new spicy peri peri sauce and topped with onion & red",
        "Size": "Medium",
        "crust": "New Hand Tossed",
        "price": "329",
        "img": "https://images.dominos.co.in/BlazingOnionPaprikaCustom.jpg",
        "id": 1
    },
    {
        "name": "Fiery Sausage & Paprika",
        "discription": "A super spicy chicken pizza with a new spicy peri peri sauce & topped with flavorful",
        "Size": "Medium",
        "crust": "New Hand Tossed",
        "price": "449",
        "img": "https://images.dominos.co.in/FierySausagePaprikaCustom.jpg",
        "id": 2
    },
    {
        "name": "Farmhouse",
        "discription": "Delightful combination of onion, capsicum, tomato & grilled mushroom",
        "Size": "Medium",
        "crust": "New Hand Tossed",
        "price": "554",
        "img": "https://images.dominos.co.in/farmhouse.png",
        "id": 3
    },
    {
        "name": "Pepper Barbecue Chicken",
        "discription": "Pepper barbecue chicken for that extra zing",
        "Size": "Medium",
        "crust": "New Hand Tossed",
        "price": "445",
        "img": "https://images.dominos.co.in/new_pepper_barbeque_chicken.jpg",
        "id": 4
    },
    {
        "name": "Margherita",
        "discription": "Classic delight with 100% real mozzarella cheese",
        "Size": "Medium",
        "crust": "Pan crust",
        "price": "245",
        "img": "https://images.dominos.co.in/new_margherita_2502.jpg",
        "id": 5
    },
    {
        "name": "Peppy Paneer",
        "discription": "Classic delight with 100% real mozzarella cheese",
        "Size": "Medium",
        "crust": "Pan crust",
        "price": "469",
        "img": "https://images.dominos.co.in/new_peppy_paneer.jpg",
        "id": 6
    }
]
let userdata = [
    {
        username: "mbiswajeet@gmail.com",
        password: "log123bm",
        name: "Biswajeet Mohapatra",
        contact: "791298012",
        address: "At plot No 1712/4244 , Harachandi sahi ,old town, Bhubaneswar",
        city: "bhubaneswar",
        state: "Odisha",
        country: "India",
        id: uuid()
    }

]


app.get('/', (req, res) => {
    const title = "Home";
    res.render('home.ejs', { pizzaData, title });
})
app.get('/home', (req, res) => {
    const title = "Home";
    res.render('home.ejs', { pizzaData, title });
})

app.get('/Product', (req, res) => {
    const title = "Product";
    res.render('product.ejs', { pizzaData, title });
})
app.get('/about', (req, res) => {
    const title = "About";
    res.render('about.ejs', { title });
})


let IsLogin = false;

app.post('/add-to-cart', (req, res) => {
    if (IsLogin) {
        const data = req.body;
        const Quantity = data.Quantity;
        const title = "Cart";
        let count = 0;
        for (let i = 0; i < Quantity.length; i++) {
            if (Quantity[i] > 0) {
                count++;
            }
        }
        setTimeout(() => {
            res.render('Cart.ejs', { pizzaData, Quantity, count, user, title });
        }, 3000)

    }
    else {
        res.redirect('/login')
    }
})
app.get('/login', (req, res) => {
    if (IsLogin) {
        let title = "Profile";
        res.render('profile.ejs', { user, title })
    }
    else {
        setTimeout(() => {
            let title = "Login";
            const heading = "Login to your account";
            const mail = "USERNAME";
            const key = "username";
            const route = "login";
            res.render('login.ejs', { title, heading, mail, key, route });
        }, 3000)

    }

})

let user; // to get the details of a specific user from the userdata array
app.post('/login', (req, res) => {

    const { username, password } = req.body;
    user = userdata.find((p) => p.password === password);
    if (user) {
        IsLogin = true;
        res.redirect('/product')
    }
    else {
        res.send(`<h1>No data found for username ${username}</h1>`)
    }
})
// adding route to logout
app.get('/logout', (req, res) => {
    IsLogin = false;
    res.redirect('/home');
})
// adding a route to create a user
app.get('/create', (req, res) => {
    const title = "Create your profile";
    const heading = "create your profile";
    const route = "create";
    const method = "POST";
    res.render('createUser.ejs', { title, heading, route, method });
})
// fetching data from the form by adding a post route
app.post('/create', (req, res) => {
    const data = req.body;
    const { username, password, name, address, city, state, country, contact } = req.body;
    userdata.push({ username, password, name, address, city, state, country, contact, id: uuid() });
    res.redirect('/login');
})

// validating request from the user for updateing data
app.get('/validate-user', (req, res) => {
    const heading = "Validate Your Account"
    const mail = "USER_ID";
    const title = "validate-user";
    const key = "id";
    const route = "validate-user";
    res.render('login.ejs', { heading, mail, title, key, route });
})
let userid, password;
app.post('/validate-user', (req, res) => {
    userid = req.body.id;
    password = req.body.password;
    if (user.id === userid) {
        if (user.password === password) {
            res.redirect('/Edit');
        }
        else {
            res.redirect('/validate-user');
        }

    }
    else {
        res.redirect('/validate-user');
    }
})

// adding route for patcing or updateing data
app.get('/Edit', (req, res) => {
    const title = "Edit your profile"
    const heading = "Edit your profile"
    const route = "Edit";
    const method = "PATCH";
    res.render('createUser.ejs', { title, heading, route, method });
});
// now for patching route we need to add method overide we have installed it and going to require it
//
// adding the uuid for generating new id


const methodOverride = require('method-override');
app.use(methodOverride('_method'));
app.patch('/Edit', (req, res) => {
    const newData = req.body;
    let found = false
    for (let user of userdata) {
        // now before matching the data we need to have a unique id for each profile
        if (user.id === userid) {
            found = true;
            user.username = newData.username;
            user.password = newData.password;
            user.name = newData.name;
            user.state = newData.state;
            user.city = newData.city;
            user.address = newData.address;
            user.country = newData.country;
            user.contact = newData.contact;
        }
        else {
            found = false;
        }
    }
    if (found) {
        res.redirect('/login');
    }
    else {
        res.send('could not update the data')
    }
})
