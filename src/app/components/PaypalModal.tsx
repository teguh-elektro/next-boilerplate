'use client';
import React, { useEffect, useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { capturePayment, createOrder } from '@/lib/paypal';
import { useSession } from 'next-auth/react';

interface PaypalModalProps {
    email: string,
    isOpen: boolean;
    onClose: () => void;
}

const PayPalModal: React.FC<PaypalModalProps> = ({ email, isOpen, onClose }) => {
    const [showModal, setShowModal] = useState(false);
    const { data: session, update } = useSession()

    useEffect(() => {
        if (isOpen) {
            setShowModal(true);
        } else {
            setTimeout(() => setShowModal(false), 300); // Delay for fade-out animation
        }
    }, [isOpen]);

    const handlePayment = async (details: any) => {
        console.log('Transaction completed by ' + details.payer.name.given_name);
        // alert('Upgrade berhasil! Anda sekarang memiliki akses seumur hidup ke fitur premium.');
        onClose();
        update({ ...session });
    };

    const onApprove = async (data: any, actions: any) => {
        const details = await actions.order.capture();
        const status = await capturePayment(details.id, email);
        console.log('capturePayment', status);
        if (status === 'COMPLETED') handlePayment(details);
        else onError('tidak ada transaksi berhasil!')
    };

    const onError = (err: any) => {
        console.error('PayPal Button Error:', err);
    };

    return (
        <>
            {showModal && (
                <div
                    className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-300 ease-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    aria-hidden={!showModal}
                >
                    <div className={`bg-white rounded-xl shadow-2xl w-full max-w-lg p-8 md:p-10 relative overflow-y-auto max-h-[85vh] transform transition-transform duration-300 ease-in-out ${isOpen ? 'scale-100' : 'scale-95'}`}>
                        <div className='mb-4 grid gap-1.5'>
                            <h2 className="text-lg font-semibold tracking-tight md:text-xl">Upgrade Plan</h2>
                            <p className='text-sm'>You're currently on Free plan</p>
                        </div>

                        <div data-state="active" data-orientation="horizontal" role="tabpanel" aria-labelledby="radix-:r3q:-trigger-v0-level3" id="radix-:r3q:-content-v0-level3" tabIndex={0} className="ring-offset-background focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2" style={{ animationDuration: '0s' }}>
                            <div className="bg-muted border-alpha-200 flex h-64 flex-col gap-4 rounded-sm border p-4 text-sm">
                                <div className="flex flex-col gap-2">
                                    <h1 className="text-base font-semibold">Premium</h1>
                                    <div className="flex items-center gap-1">
                                        <span className="text-xl font-semibold">$10</span>
                                        <span className="align-text-bottom text-sm leading-7 text-gray-500">(One-time payment. No subscription)</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <p className="font-semibold">Features you will get:</p>
                                    <ul className="flex flex-col gap-3">
                                        <li className="flex items-center gap-2">
                                            <svg className="with-icon_icon__b4_Cj" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style={{ color: 'currentcolor', width: '20px', height: '20px' }}><path d="M20 6L9 17l-5-5"></path>
                                            </svg>
                                            +50 components access
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <svg className="with-icon_icon__b4_Cj" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style={{ color: 'currentcolor', width: '20px', height: '20px' }}><path d="M20 6L9 17l-5-5"></path>
                                            </svg>
                                            Auto save projects to your local device
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <svg className="with-icon_icon__b4_Cj" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style={{ color: 'currentcolor', width: '20px', height: '20px' }}><path d="M20 6L9 17l-5-5"></path>
                                            </svg>
                                            Share projects with QR Code
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="border-b border-gray-300 my-5 pb-5">

                            <PayPalScriptProvider
                                options={{
                                    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID as string,
                                    currency: 'USD'
                                }}
                            >
                                <PayPalButtons
                                    style={{
                                        layout: 'vertical',
                                        color: 'blue',
                                        shape: 'rect',
                                        label: 'pay',
                                    }}
                                    createOrder={async (data, actions) => await createOrder(email)}
                                    onApprove={onApprove}
                                    onError={onError}
                                />
                            </PayPalScriptProvider>

                        </div>

                        <button
                            onClick={onClose}
                            className="mt-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded text-base font-semibold transition duration-200 ease-in-out"
                        >
                            Cancel
                        </button>
                    </div>
                </div>

            )}
        </>
    );
};

export default PayPalModal;
