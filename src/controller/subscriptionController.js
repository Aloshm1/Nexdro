const subscriptionPlansModel = require("../models/subscriptionPlansModel");
const stripe = require("stripe")(
  "sk_test_51KqxC0SBkY4kbyYODyFDUhqKC9QLIVG9vSwy4CY8H59UoE0KdGjF5RRsKh91ONWRoFwmMSOs7POhvrPXHqQONU4k008UjnaguX"
);

exports.createSubscription = async (req, res) => {
  const {
    name,
    description,
    price,
    gst,
    validity,
    images,
    videos,
    images3d,
    draft,
    multiple,
    approval,
    jobNotifications,
    suggestions,
    proLabel,
    rearrange,
    hireButton,
    forWhom,
  } = req.body;
  const _industry = new subscriptionPlansModel({
    name,
    description,
    price,
    gst,
    validity,
    images,
    videos,
    images3d,
    draft,
    multiple,
    approval,
    jobNotifications,
    suggestions,
    proLabel,
    rearrange,
    hireButton,
    forWhom,
  });
  try {
    const a1 = await _industry.save();
    res.json(a1);
  } catch (err) {
    res.send("error");
  }
};

exports.getSubscriptions = async (req, res) => {
  await subscriptionPlansModel.find({}).exec((err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
};
exports.getSubscription = async (req, res) => {
  await subscriptionPlansModel
    .findOne({ _id: req.body.id })
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
};

exports.getCardDetails = async (req, res) => {
  const customers = await stripe.customers.list({
    email: req.body.email,
  });
  if (customers.data.length == 0) {
    res.send("No such customer");
  } else {
  const paymentMethods = await stripe.customers.listPaymentMethods(
    customers.data[0].id,
    { type: "card" }
  );

  if (paymentMethods.data.length > 0) {
    let card = paymentMethods.data[0];
    res.json({
      last4digits: card.card.last4,
      expMonth: card.card.exp_month,
      expYear: card.card.exp_year,
      brand: card.card.brand,
    });
  } else {
    res.send("No Payments Yet");
  }
  }
  };
