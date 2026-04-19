"use client"
import { auth_service, useAppData } from '@/context/AppContext'
import axios from 'axios'
import { redirect } from 'next/navigation'
import React, { FormEvent, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'
import Loading from '@/components/loading'
import { useRouter } from 'next/navigation'

const ResetPassword = () => {
    const token = Cookies.get("token")
    const [password, setPassword] = useState("")
    const [btnLoading, setBtnLoading] = useState(false)
    const { isAuth, loading } = useAppData();


    const submithandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setBtnLoading(true);
        try {
            const { data } = await axios.post(`${auth_service}/api/auth/reset/${token}`, {
                password
            })
            toast.success(data.message);
            setBtnLoading(false);
        } catch (error: any) {
            toast.error(error.response.data.message)
            setBtnLoading(false);
        }

    }
   
    const router = useRouter();
    useEffect(() => {
        if (isAuth && !loading) {
            router.push('/login');
        }
    }, [isAuth, router, loading])

    if (loading) return <Loading />;
    return (
        <div className='mt-20 md:mt-5 z-0'>
            <div className='md:w-1/3 border border-gray-400 rounded-lg p-8 flex flex-col w-full relative shadow-md m-auto'>
                <h1 className='text-2xl font-semibold mb-6 text-center'>Reset Password</h1>
                <form onSubmit={submithandler} className='flex flex-col gap-4'>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='password'>New Password</label>
                        <input type='text' id='password' value={password} onChange={(e) => setPassword(e.target.value)} className='border border-gray-400 rounded-lg p-2' required />
                    </div>
                    <button type='submit' className='bg-blue-500 text-white rounded-lg p-2' disabled={btnLoading}>{btnLoading ? "Upadating.." : "Update"}</button>
                </form>
            </div>
        </div>
    )
}

export default ResetPassword