const companyModel = require("../models/companyModel");
const companyPlanModel = require("../models/companyPlanModel");
const companySubscriptionModal = require("../models/companySubscriptionModal");
const draftJobModel = require("../models/draftJobModel");
const jobModel = require("../models/jobModel");
const userModel = require("../models/userModel");
const stripe = require("stripe")(
  "sk_test_51KqxC0SBkY4kbyYODyFDUhqKC9QLIVG9vSwy4CY8H59UoE0KdGjF5RRsKh91ONWRoFwmMSOs7POhvrPXHqQONU4k008UjnaguX"
);
exports.createCompanySubscription = async (req, res) => {
  const _user = req.user._id;
  let activeJobs1, proposals1;
  let views1;
  const { plan, paymentId, activeJobs, views, proposals } = req.body;
  const companyPlan = await companyPlanModel.findOne({ planName: plan });
  await companyModel
    .find({ userId: req.user._id })
    .update({ views: 0, proposals: 0, viewed: [], jobBoosts: 0 })
    .exec((err, result) => {
      console.log(result);
    });
  await companySubscriptionModal
    .find({ userId: _user })
    .exec(async (err, result) => {
      if (err) {
        res.send(err);
      } else {
        if (result.length !== 0) {
          companySubscriptionModal
            .findByIdAndDelete(result[0]._id)
            .exec(async (err, result) => {
              if (err) {
                res.send(err);
              } else {
                const companySubscription = new companySubscriptionModal({
                  userId: _user,
                  planName: plan,
                  paymentId,
                  activeJobs: companyPlan.activeJobs,
                  directHires: companyPlan.directHires,
                  draftJobs: companyPlan.draftJobs,
                  bookmarkPilots: companyPlan.bookmarkPilots,
                  suggestedPilots: companyPlan.suggestedPilots,
                  proBadge: companyPlan.proBadge,
                  boostJob: companyPlan.boostJob,
                });
                try {
                  const a1 = await companySubscription.save();
                  if (companyPlan.proBadge) {
                    companyModel
                      .findOne({ userId: _user })
                      .update({ companyPro: true })
                      .exec((err, result) => {
                        if (err) {
                        } else {
                        }
                      });
                  }
                  res.json(a1);
                } catch (err) {
                  res.send("error");
                }
              }
            });
        } else {
          const companySubscription = new companySubscriptionModal({
            userId: _user,
            planName: plan,
            paymentId,
            activeJobs: companyPlan.activeJobs,
            directHires: companyPlan.directHires,
            draftJobs: companyPlan.draftJobs,
            bookmarkPilots: companyPlan.bookmarkPilots,
            suggestedPilots: companyPlan.suggestedPilots,
            proBadge: companyPlan.proBadge,
            boostJob: companyPlan.boostJob,
          });
          try {
            const a1 = await companySubscription.save();
            if (companyPlan.proBadge) {
              companyModel
                .findOne({ userId: _user })
                .update({ companyPro: true })
                .exec((err, result) => {
                  if (err) {
                  } else {
                  }
                });
            }

            res.json(a1);
          } catch (err) {
            res.send("error");
          }
        }
      }
    });
};

exports.getSubscriptionCompany = async (req, res) => {
  console.log(req.body);
  await companySubscriptionModal
    .findOne({ userId: req.user._id })
    .exec(async (err, result4) => {
      if (result4 && result4.planName !== "free") {
        const subscription = await stripe.subscriptions.retrieve(
          result4.paymentId
        );
        await companySubscriptionModal
          .findOne({ userId: req.user._id })
          .exec(async (err, result) => {
            if (err) {
              res.send(err);
            } else {
              await companyModel
                .findOne({ userId: req.user._id })
                .exec((err, result1) => {
                  if (err) {
                    res.send(err);
                  } else {
                    jobModel
                      .find({ userId: req.user._id, status: "active" })
                      .exec((err, result2) => {
                        if (err) {
                          res.send(err);
                        } else {
                          draftJobModel
                            .find({ userId: req.user._id })
                            .exec((err, result3) => {
                              if (err) {
                                res.send(err);
                              } else {
                                res.status(200).json({
                                  views: result1.views ? result1.views : 0,
                                  proposals: result1.proposals
                                    ? result1.proposals
                                    : 0,
                                  jobBoosts: result1.jobBoosts,
                                  activeJobs: result2.length,
                                  draftJobs: result3.length,
                                  subscription: result,
                                  price: subscription.plan.amount,
                                  status: subscription.status,
                                  startDate: subscription.current_period_start,
                                  currency: subscription.plan.currency,
                                  endDate: subscription.current_period_end,
                                });
                              }
                            });
                        }
                      });
                  }
                });
            }
          });
      } else {
        res.send("No Subscription");
      }
    });
};

exports.cancelSubscription = async (req, res) => {
  await companyModel
    .find({ userId: req.user._id })
    .update({ companyPro: false })
    .exec((err, result) => {
      console.log(result);
    });
  await companySubscriptionModal
    .deleteOne({ userId: req.user._id })
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });

  companyPlanModel
    .findOne({ planName: "free" })
    .exec(async (err, planResult) => {
      if (err) {
        console.log(err);
      } else {
        const _subscription = new companySubscriptionModal({
          userId: req.user._id,
          planName: "free",
          activeJobs: planResult.activeJobs,
          directHires: planResult.directHires,
          draftJobs: planResult.draftJobs,
          bookmarkPilots: planResult.bookmarkPilots,
          suggestedPilots: planResult.suggestedPilots,
          boostJob: planResult.boostJob,
          proBadge: planResult.proBadge,
        });
        try {
          const a1 = await _subscription.save();
          console.log(a1);
        } catch (err) {
          console.log(err);
        }
      }
    });
};
