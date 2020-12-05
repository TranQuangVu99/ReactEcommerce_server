const router = require('express').Router()
const moment = require('moment')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const verifyToken = require('../middlewares/verify-token')

const Order = require('../models/order')


const SHIPMENT ={
    normal:{
        price:30000,
        days:7
    },
    fast:{
        price:100000,
        days:3
    }
}

function shipmentPrice(shipmentOption){
    let estimated = moment().add(shipmentOption.days,"d").format("dddd MMMM Do")

    return {estimated ,price: shipmentOption.price}
}

router.post('/shipment',(req,res)=>{
    let shipment
    if(req.body.shipment==='normal'){
        shipment= shipmentPrice(SHIPMENT.normal)
    }else{
        shipment =shipmentPrice(SHIPMENT.fast)
    }

    res.json({succees : true, shipment: shipment})
})

router.post('/payment',verifyToken,(req,res) =>{
    let totalPrice = Math.round(req.body.totalPrice)
    
    stripe.customers.create({
        email : req.decoded.email 
    }).then(customer => {
        return stripe.customers.createSource(customer.id ,{
            source : 'tok_visa'
        })
    }).then(source =>{
        return stripe.charges.create({
            amount: totalPrice,
            currency : "VND",
            customer : source.customer
        }) 
    }).then( async charge => {
        let order = new Order()
        let carts = req.body.carts

        carts.map(product =>{
            order.products.push({
                productID : product.productID, 
                quantity : parseInt(product.quantity),
                price : product.price,
                capacity : product.capacity,
                color : product.indexColor,
                capacityCostPlus : product.capacityCostPlus,
                colorCostPlus : product.colorCostPlus,
                photo : product.photo
            })
        })
        order.estimatedDelivery = req.body.estimatedDelivery
        order.user = req.decoded._id
        await order.save()

        res.json({
            success : true,
            message : " Successfully made a payment"
        })
    }).catch(err =>{
        res.status(500).json({
            success: false,
            message: err.message,
          });
    })

    
})

router.post('/pay', async (req, res) => {
    const {email,totalPrice} = req.body;
    
    const paymentIntent = await stripe.paymentIntents.create({
        amount: totalPrice,
        currency: 'VND',
        // Verify your integration in this guide by including this parameter
        metadata: {integration_check: 'accept_a_payment'},
        receipt_email: email,
      });

      res.json({'client_secret': paymentIntent['client_secret']})
})

module.exports = router