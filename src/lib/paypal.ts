'use server'
import axios from "axios";
import Transactions from "@/models/Transactions";
import Users from "@/models/Users";

const { NEXT_PAYPAL_BASE_URL, NEXT_PUBLIC_PAYPAL_CLIENT_ID, NEXT_PAYPAL_SECRET, NEXT_BASE_URL } = process.env;

export async function generateAccessToken(): Promise<string> {
    if (!NEXT_PUBLIC_PAYPAL_CLIENT_ID || !NEXT_PAYPAL_SECRET) return '';
    const response = await axios({
        url: `${NEXT_PAYPAL_BASE_URL}/v1/oauth2/token`,
        method: 'post',
        data: 'grant_type=client_credentials',
        auth: {
            username: NEXT_PUBLIC_PAYPAL_CLIENT_ID,
            password: NEXT_PAYPAL_SECRET
        }
    })
    return response.data.access_token as string
}

export const capturePayment = async (orderID: string, email: string): Promise<any> => {
    const accessToken = await generateAccessToken()
    const requestId = `req-${Date.now()}`;
    const response = await axios({
        url: `${NEXT_PAYPAL_BASE_URL}/v2/checkout/orders/${orderID}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'PayPal-Request-Id': requestId,
            'Prefer': 'return=minimal'
        }
    })

    const { status } = response.data
    const recordOrder = new Transactions({
        email,
        orderID,
        itemName: 'Logic gate Simulator premium',
        itemQuantity: 1,
        amount: 10.0,
        currency: 'USD',
        status,
        createdAt: new Date()
    });
    await recordOrder.save();
    if (status === 'COMPLETED') {
        await Users.findOneAndUpdate(
            { email },
            {
                subscribe: 'premium',
                updateAt: new Date()
            },
            { new: true }
        );
    }
    return status
}

export const createOrder = async (email: string) => {
    const accessToken = await generateAccessToken()
    const requestId = `req-${Date.now()}`;
    const response = await axios({
        url: NEXT_PAYPAL_BASE_URL + '/v2/checkout/orders',
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken,
            'PayPal-Request-Id': requestId
        },
        data: JSON.stringify({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    items: [
                        {
                            name: 'Logic gate Simulator premium',
                            description: 'One-time payment. No subscription',
                            quantity: 1,
                            unit_amount: {
                                currency_code: 'USD',
                                value: '10.00'
                            }
                        }
                    ],

                    amount: {
                        currency_code: 'USD',
                        value: '10.00',
                        breakdown: {
                            item_total: {
                                currency_code: 'USD',
                                value: '10.00'
                            }
                        }
                    }
                }
            ],

            application_context: {
                shipping_preference: 'NO_SHIPPING',
                user_action: 'PAY_NOW',
                brand_name: 'logic-gate.online'
            }
        })
    })
    console.log(response.data);

    const { id, status } = response.data;
    console.log({
        email,
        orderID: id,
        itemName: 'Logic gate Simulator premium',
        itemQuantity: 1,
        amount: 10.0,
        currency: 'USD',
        status,
        createdAt: new Date()
    });

    const recordOrder = new Transactions({
        email,
        orderID: id,
        itemName: 'Logic gate Simulator premium',
        itemQuantity: 1,
        amount: 10.0,
        currency: 'USD',
        status,
        createdAt: new Date()
    });
    await recordOrder.save();
    return id;
}

