"use server";

import { getUserSubscription } from "@/db/queries";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";
import { auth, currentUser } from "@clerk/nextjs/server";

const returnUrl = absoluteUrl("/shop");

export const createStripeUrl = async () => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!user || !userId) {
    throw new Error("User not found");
  }

  const userSubscription = await getUserSubscription();

  // Kundenportal nur bei aktivem Abo (dort kann man es verwalten oder kündigen).
  // Ein abgelaufenes Abo hat zwar noch eine Kunden-ID, im Portal kann man aber
  // kein neues Abo abschliessen. Darum geht es dann wieder zum Checkout.
  if (userSubscription?.isActive && userSubscription.stripeCustomerId) {
    const stripeSession = await stripe.billingPortal.sessions.create({
        customer: userSubscription.stripeCustomerId,
        return_url: returnUrl,
    })

    return { data: stripeSession.url };
  }

  const stripeSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    // Bestehenden Stripe-Kunden wiederverwenden, sonst legt Stripe einen neuen an.
    ...(userSubscription?.stripeCustomerId
      ? { customer: userSubscription.stripeCustomerId }
      : { customer_email: user.emailAddresses[0].emailAddress }),
    line_items: [
      {
        quantity: 1,
        price_data: {
            currency: "usd",
            product_data: {
                name: "Lingo Pro",
                description: "Unlimited Hearts"
            },
            unit_amount: 2000,
            recurring: {
                interval: "month"
            }
        }
      },
    ],
    metadata: {
        userId,
    },
    success_url: returnUrl,
    cancel_url: returnUrl,
  });

  return { data: stripeSession.url };
};
