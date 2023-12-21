const companySubscriptionModal = require("../models/companySubscriptionModal");
const paymentModel = require("../models/paymentModel");

const stripe = require('stripe')('sk_test_51KqxC0SBkY4kbyYODyFDUhqKC9QLIVG9vSwy4CY8H59UoE0KdGjF5RRsKh91ONWRoFwmMSOs7POhvrPXHqQONU4k008UjnaguX');
exports.createPayment = async (req, res)=>{
    const User = req.user._id
    const { plan, transactionId, price, gst, status,name, line1, line2, city, state, country, pinCode, gstNo } =
    req.body;
  const _industry = new paymentModel({
   userId: User, plan, transactionId, price, gst, status,name, line1, line2, city, state, country, pinCode, gstNo
  });
  try {
    const a1 = await _industry.save();
    res.json(a1);
  } catch (err) {
    res.send("error");
  }
}
exports.getPayments = async(req, res)=>{
    const User = req.user._id;
    paymentModel.find({userId: User}).sort({createdAt: -1}).exec((err, result)=>{
        if(err){
            res.send(err)
        }else{
            res.send(result)
        }
    })
}

exports.startPaymentProcess = async(req, res)=>{
  const name= req.user.name;
console.log(req.body)
  const User = req.user._id;
  const customers = await stripe.customers.list({
    email: req.user.email,
  });
  let productId;
  //product id is price id
  const{line1, line2, pin_code, city, state, country, planName} = req.body;
  if(planName === "Gold Monthly" && country !== "IN"){
    productId = 'price_1KtPLkSBkY4kbyYOGEE3vSSL'
  } else if(planName === "Platinum Monthly" && country !== "IN"){
    productId = 'price_1KtPNCSBkY4kbyYOgvncGHTq'
  } else if(planName === "Gold Yearly" && country !== "IN"){
    productId = 'price_1KtPUZSBkY4kbyYO6mpXI2D4'
  } else if(planName === "Platinum Yearly" && country !== "IN"){
    productId = 'price_1KtPP7SBkY4kbyYOIN2kKOE3'
  } else if(planName === "Gold Monthly" && country === "IN"){
    productId = 'price_1KtPQQSBkY4kbyYO2D3HQzkJ'
  } else if(planName === "Platinum Monthly" && country === "IN"){
    productId = 'price_1KtPTSSBkY4kbyYOnDgl2nlK'
  } else if(planName === "Gold Yearly" && country === "IN"){
    productId = 'price_1KtPUZSBkY4kbyYO6mpXI2D4'
  } else if(planName === "Platinum Yearly" && country === "IN"){
    productId = 'price_1KtPVfSBkY4kbyYOz4Nr5ZH9'
  } else{
    console.log("Wrong Data")
  }

  if(customers.data.length !== 0){
    console.log("Customer exists")
    const subscription = await stripe.subscriptions.create({
      customer: customers.data[0].id,
      items: [{
        price: productId,
      }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });
    console.log(subscription)
    res.send({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    });
  }else{
    console.log("New Customer")
    const customer = await stripe.customers.create({
      name: req.body.name,
      email: req.user.email,
      address:{
      line1: line1,
      line2: line2,
      postal_code: pin_code,
      city: city,
      state: state,
      country: country
      }
    });
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{
        price: productId,
      }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });
    res.send({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    });
  }
  

 

}
exports.getInvoice = async(req, res)=>{


  const subscription = await stripe.subscriptions.retrieve(
    'sub_1KtRxESBkY4kbyYORtPMLob7'
  );
  res.send(subscription)
}


exports.startCompanyPayment = async(req, res)=>{
  const name= req.user.name;

  const User = req.user._id;
  const customers = await stripe.customers.list({
    email: req.user.email,
  });
  let productId;
  //product id is price id
  const{line1, line2, pin_code, city, state, country, planName} = req.body;
  if(planName === "Gold Monthly" && country !== "IN"){
    productId = 'price_1KyW8QSBkY4kbyYOGXOyoduw'
  } else if(planName === "Platinum Monthly" && country !== "IN"){
    productId = 'price_1KyWBKSBkY4kbyYOlbm4szVj'
  } else if(planName === "Gold Quarterly" && country !== "IN"){
    productId = 'price_1KyWAXSBkY4kbyYOGe3Zrh7N'
  } else if(planName === "Platinum Quarterly" && country !== "IN"){
    productId = 'price_1KyWCCSBkY4kbyYOmRwQ5gyX'
  } else if(planName === "Gold Monthly" && country === "IN"){
    productId = 'price_1KyWDSSBkY4kbyYOx1B1XjQV'
  } else if(planName === "Platinum Monthly" && country === "IN"){
    productId = 'price_1KyWFASBkY4kbyYOyL05AR5i'
  } else if(planName === "Gold Quarterly" && country === "IN"){
    productId = 'price_1KyWEQSBkY4kbyYOQpI2pVTe'
  } else if(planName === "Platinum Quarterly" && country === "IN"){
    productId = 'price_1KyWG4SBkY4kbyYOp95FyzKh'
  } else{
    console.log("Wrong Data")
  }

  if(customers.data.length !== 0){
    console.log("Customer exists")
    const subscription = await stripe.subscriptions.create({
      customer: customers.data[0].id,
      items: [{
        price: productId,
      }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });
    res.send({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    });
  }else{
    console.log("New Customer")
    const customer = await stripe.customers.create({
      name: req.body.name,
      email: req.user.email,
      address:{
      line1: line1,
      line2: line2,
      postal_code: pin_code,
      city: city,
      state: state,
      country: country
      }
    });
    console.log(customer)
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{
        price: productId,
      }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });
    res.send({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    });
  }
  

 

}


exports.startAddonPayment = async(req, res)=>{
  const name= req.user.name;

  const User = req.user._id;
  const customers = await stripe.customers.list({
    email: req.user.email,
  });
  let productId;
  //product id is price id
  const{line1, line2, pin_code, city, state, country, planName} = req.body;
  if(planName === "Job Addon" && country !== "IN"){
    productId = 'price_1LcMSESBkY4kbyYOO2EjCNCD'
  } else if(planName === "DirectHire Addon" && country !== "IN"){
    productId = 'price_1LcMTVSBkY4kbyYOFBscM0Wt'
  } else if(planName === "BoostJob Addon" && country !== "IN"){
    productId = 'price_1LcMUCSBkY4kbyYOfjSFhAWS'
  } else if(planName === "Combo Addon" && country !== "IN"){
    productId = 'price_1LcMV8SBkY4kbyYOGgTCdhj3'
  } else if(planName === "Gold Monthly" && country === "IN"){
    productId = 'price_1KyWDSSBkY4kbyYOx1B1XjQV'
  } else if(planName === "Platinum Monthly" && country === "IN"){
    productId = 'price_1KyWFASBkY4kbyYOyL05AR5i'
  } else if(planName === "Gold Quaterly" && country === "IN"){
    productId = 'price_1KyWEQSBkY4kbyYOQpI2pVTe'
  } else if(planName === "Platinum Quaterly" && country === "IN"){
    productId = 'price_1KyWG4SBkY4kbyYOp95FyzKh'
  } else{
    console.log("Wrong Data")
  }

  if(customers.data.length !== 0){
    console.log("Customer exists")
    const subscription = await stripe.price.create({
      customer: customers.data[0].id,
      items: [{
        price: productId,
      }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });
    res.send({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    });
  }else{
    console.log("New Customer")
    const customer = await stripe.customers.create({
      name: req.body.name,
      email: req.user.email,
      address:{
      line1: line1,
      line2: line2,
      postal_code: pin_code,
      city: city,
      state: state,
      country: country
      }
    });
    console.log(customer)
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{
        price: productId,
      }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });
    res.send({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    });
  }
  
}

exports.paymentIntends = async (req,res)=>{
  const{line1, line2, pin_code, city, state, country, amount, currency} = req.body;

  const customers = await stripe.customers.list({
    email: req.user.email,
  });
  if(customers.data.length > 0){
    const paymentIntent = await stripe.paymentIntents.create({
      customer:customers.data[0].id,
      amount: amount,
      currency: currency,
      automatic_payment_methods: {enabled: true},
      description:"Test Payment"
  
    });    
    res.send(paymentIntent.client_secret)
  }else{
    const customer = await stripe.customers.create({
      name: req.body.name,
      email: req.user.email,
      address:{
      line1: line1,
      line2: line2,
      postal_code: pin_code,
      city: city,
      state: state,
      country: country
      }
    });
    const paymentIntent = await stripe.paymentIntents.create({
      customer:customers.data[0].id,
      amount: amount,
      currency: currency,
      automatic_payment_methods: {enabled: true},
      description:"Test Payment"
    });    
    res.send(paymentIntent.client_secret)
  }

}
exports.updateSuccessAddon = async (req,res)=>{
  const {directHire, activeJobs, boostJobs} = req.body
  companySubscriptionModal.findOne({userId: req.user._id}).update({ $inc: { activeJobs:  activeJobs,boostJob: boostJobs ,directHires: directHire}}).exec((err,result)=>{

    if(err){
      res.send(err)
    }else{
      res.send(result)
    }
  })

}