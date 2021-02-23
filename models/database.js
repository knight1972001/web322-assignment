var products=[{
    img: '/images/topContent/mousecake.jpg',
    title: 'Strawberry GreenTea Mousse Cake',
    des: 'With a special combination of strawberry and green tea, the cake will give you a special flavor',
    price: '$12',
    type: 'cake'
},
{
    img: '/images/topContent/tartcake.jpg',
    title: 'Gluten Free Lemon (Sliced)',
    des: 'With an easy press-in almond shortbread crust and luscious, tangy lemon curd, this French-style gluten-free lemon tart is an easier version of the classic. This is the same recipe as my gluten-free lemon bars, just in a different shape!',
    price: '$15',
    type: 'cake'
},
{
    img: '/images/topContent/chessecake.jpg',
    title: 'Oreo Cheese Cake (Sliced)',
    des: 'This Oreo Cheesecake is thick, creamy and filled with cookies and cream! It’s baked in an Oreo crust and topped with white chocolate ganache and homemade whipped cream! With the amount of Oreos baked into it, this is the BEST Oreo Cheesecake you’ll ever have!',
    price: '$12',
    type: 'cake'
},{
    img: '/images/topContent/hamPizza.jpg',
    title: 'Spanish Chorizo and Serrano Ham Pizza',
    des: 'If you believe pizza was made for meat and meat alone, this new pizza is for you!  Made using our fermented Turkish dough to give it a crispy crust and delicious flavour, we add tomato sauce, chorizo, ham and aged white cheddar.',
    price: '$6 per piece',
    type: 'pizza'
},{
    img: '/images/topContent/hawaiiPizza.jpg',
    title: 'Hawaiian Pizza',
    des: 'The perfect on-the-go size, enjoy this classic tropical pizza made with tomato sauce, ham, pineapple and topped with aged white cheddar.  Our Pizzas are made using our fermented Turkish dough, making the crust flavourful and the just the right amount of crispy.',
    price: '$6 per piece',
    type: 'pizza'
},{
    img: '/images/topContent/threeCheese.jpg',
    title: 'Three-Cheese Veggie Pizza',
    des: 'This pizza is perfect for those who don\'t want pizza with too much meat. We add tomato sauce, aged white cheddar, red peppers, mushrooms and olives for the classic vegetarian pizza.',
    price: '$6 per piece',
    type: 'pizza'
}]

var heroContent =[{
        img: '/images/freshCake.jpg',
        title: 'Fresh Cake Daily',
        des: 'At Meu Bakery, fresh comes first. Even the simplest of cakes, we guarantee that the day you walk into our bakery is the day we bake it.'
    },{
        img: '/images/material.jpg',
        title: 'Quality Guaranteered',
        des: 'To make delicious cakes all the ingredients are carefully examined from the dough to the egg. For us, this is priority before we start making a cake.'
    },{
        img: '/images/giving.jpg',
        title: 'End of giving day',
        des: 'The cakes at the end of the day will be donated to the great community. This not only helps provide the cake to those who need it, but also helps reduce food waste'
    }]

module.exports.getHeroContent=function(){
    return heroContent;
}

module.exports.getAllCake=function(){
    let cakes=[];
    for(let i=0;i<products.length; i++){
        if(products[i].type == 'cake'){
            cakes.push(products[i]);
        }
    }
    return cakes;
}
module.exports.getAllPizza=function(){
    let pizza=[];
    for(let i=0;i<products.length; i++){
        if(products[i].type == 'pizza'){
            pizza.push(products[i]);
        }
    }
    return pizza;
}

module.exports.getAllProducts=function(){
    return products;
}