import Stripe from "stripe";

const stripeSecretKey =
  process.env.NODE_ENV === "production"
    ? process.env.STRIPE_SECRET_KEY_PROD
    : process.env.STRIPE_SECRET_KEY_TEST;

const stripe = new Stripe(stripeSecretKey);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price: "price_XXXXXXXXXXXXXX", // Replace with your Stripe Price ID
          quantity: 1,
        },
      ],
      success_url: `${req.headers.origin}/success`,
      cancel_url: `${req.headers.origin}/yearbook`, // You can change this
    });

    res.status(200).json({ sessionId: session.id });
  } catch (err) {
    console.error("Stripe Checkout Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
