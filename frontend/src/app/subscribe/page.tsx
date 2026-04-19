"use client"
import { useRazorpay } from '@/components/scriptLoader'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import { payment_service, useAppData } from '@/context/AppContext'
import Loading from '@/components/loading'
import { Card } from '@/components/ui/card'
import { CheckCircle, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

const SubscriptionPage = () => {
    const razorpayLoaded = useRazorpay();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { fetchUser } = useAppData();
    const handleSubscribe = async () => {
        const token = Cookies.get("token")
        setLoading(true)
        const { data } = await axios.post(`${payment_service}/api/payment/checkout`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        var options = {
            "key": "rzp_test_SdSzLgNwHCRnij",
            "amount": "11900",
            "currency": "INR",
            "name": "Hire Bridge",
            "description": "Upgrade to Premium",
            "order_id": data.order.id, // This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            "handler": async function (response: any) {

                try {
                    const { data } = await axios.post(`${payment_service}/api/payment/verify`, {
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    fetchUser();
                    router.push(`/payment/successful/${data.order.id}`);

                } catch (e: any) {
                    toast.error("Something went wrong");
                }

            },
            "theme": {
                "color": "#3399cc"
            }
        };
        if (!razorpayLoaded) console.log("Something went wrong with the script")
        const razorpay = new window.Razorpay(options);
        razorpay.open();
    }

    if (loading) return <Loading />
    return (
        <div className='min-h-screen flex items-center justify-center px-4 py-12 bg-secondary/30'>
            <Card className='max-w-md w-full p-8 text-center shadow-lg border-2'>
                <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-4 mx-auto'>
                    <Crown size={32} className='text-blue-600' />
                </div>
                <h1 className='text-3xl font-bold mb-2'>Premium Subscription</h1>
                <p className='text-sm opacity-70 mb-6'>Boost your job Search</p>

                <div className='mb-6'>
                    <p className='text-5xl font-bold text-blue-600'>Rs.119</p>
                    <p className='text-sm opacity-60 mt-1'>Per Month</p>
                </div>

                <div className='space-y-3 mb-8 text-left'>
                    <div className='flex items-start gap-3'>
                        <CheckCircle size={20} className='text-green-600 shrink-0 mt-0.5' />
                        <p className='text-sm'>Your application will be shown first to recruiter
                        </p>
                    </div>

                    <div className='flex items-center gap-3'>
                        <CheckCircle size={20} className='text-green-600 shrink-0 mt-0.5' />
                        <p className='text-sm'>Priority Support</p>
                    </div>

                    <Button onClick={handleSubscribe} className='w-full h-12 text-base gap-2'>
                        <Crown size={18} /> Subscribe Now
                    </Button>

                </div>
            </Card>

        </div>
    )
}

export default SubscriptionPage