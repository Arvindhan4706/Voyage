import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20" as any,
}) : null;

export async function POST(req: Request) {
  try {
    const { destination, basePrice = 1000, useCoins = false, payLater = false } = await req.json();
    
    const coinDiscount = useCoins ? 2500 : 0;
    const taxes = Math.round(basePrice * 0.18);
    let finalAmount = basePrice + taxes - coinDiscount;
    
    // Minimum amount fallback
    if (finalAmount < 0) finalAmount = 0;
    
    // Pay later logic (20% deposit)
    if (payLater) {
      finalAmount = Math.round(finalAmount * 0.2);
    }
    
    if (!stripe) {
      console.log("No Stripe keys found. Returning mock success URL with amount: ", finalAmount);
      return NextResponse.json({ url: "/en/success?mock=true" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Voyage AI: ${destination || "Luxury"} Booking`,
              description: `Premium Reservation ${payLater ? '(20% Deposit)' : '(Full Payment)'} ${useCoins ? 'with VoyageCoins Applied' : ''}`,
            },
            unit_amount: finalAmount * 100, // Amount in paise
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        destination,
        payLater: payLater.toString(),
        useCoins: useCoins.toString(),
        discountApplied: coinDiscount.toString()
      },
      success_url: `${req.headers.get("origin")}/en/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
