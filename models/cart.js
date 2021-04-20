module.exports=function Cart(oldCart){
    this.items=oldCart.items || {};
    this.totalQuantity=oldCart.totalQuantity || 0;
    this.totalPrice=oldCart.totalPrice || 0;
    this.tax=oldCart.tax || 0;
    this.orderTotal=oldCart.orderTotal || 0;

    this.add=function(item,id){
        var storedItem=this.items[id];
        if(!storedItem){
            storedItem=this.items[id]={item: item,quantity:0,price:0};
        }
        storedItem.quantity++;
        storedItem.price=storedItem.item.price * storedItem.quantity;
        this.totalQuantity++;
        this.totalPrice += storedItem.item.price;
        this.tax=this.totalPrice*13/100;
        this.orderTotal=this.totalPrice+this.tax;
        this.orderTotal=this.orderTotal.toFixed(2);
    };

    this.removeOne=function(item,id){
        var storedItem=this.items[id];
        if(!storedItem){
            storedItem=this.items[id]={item: item,quantity:0,price:0};
        }
        storedItem.quantity--;
        storedItem.price=storedItem.item.price * storedItem.quantity;
        if(storedItem.quantity==0){
            delete this.items[id];
        }
        this.totalQuantity--;
        this.totalPrice -= storedItem.item.price;
        this.tax=this.totalPrice*13/100;
        this.orderTotal=this.totalPrice+this.tax;
        this.orderTotal=this.orderTotal.toFixed(2);
    }

    this.removeAll=function(item,id){
        var storedItem=this.items[id];
        if(!storedItem){
            storedItem=this.items[id]={item: item,quantity:0,price:0};
        }
        delete this.items[id];

        this.totalQuantity=this.totalQuantity - storedItem.quantity;
        this.totalPrice = this.totalPrice - storedItem.price;
        this.tax=this.totalPrice*13/100;
        this.orderTotal=this.totalPrice+this.tax;
        this.orderTotal=this.orderTotal.toFixed(2);
    }

    this.generateArray=function(){
        var arr=[];
        for (var id in this.items){
            arr.push(this.items[id]);
        }
        return arr;
    };
}