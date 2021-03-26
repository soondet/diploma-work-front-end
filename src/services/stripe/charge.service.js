import Stripe from "stripe";
const stripe = new Stripe(
  "sk_test_51IYmp7KQZz31etWb8WKtm8xmtA0G7qgO9BwfeGpKkCHiC6VgSVLfIIn0OmaFlNrGOVcMccVVM4m9mv8Mg7i4Sm8600HMFehlJP"
);

export default async (req, res) => {
  const { id, amount } = req.body;

  try {
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: "USD",
      description: "Delicious",
      payment_method: id,
      confirm: true,
    });

    console.log(payment);

    return res.status(200).json({
      confirm: "abc123",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: error.message,
    });
  }
};
