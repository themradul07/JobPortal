"use client"
import { auth_service, useAppData } from '@/context/AppContext'
import axios from 'axios'
import { redirect } from 'next/navigation'
import React, { FormEvent, useState } from 'react'
import toast from 'react-hot-toast'

const ForgotPassword = () => {
    const [email, setEmail] = useState("")
    const [btnLoading, setBtnLoading] = useState(false)
    const {isAuth} = useAppData();

    
    const submithandler = async( e: FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setBtnLoading(true);
        try {
            const {data} = await axios.post(`${auth_service}/api/auth/forgot`,{
                email
            })
            toast.success(data.message);
            setBtnLoading(false);
        } catch (error:any) {
            toast.error(error.response.data.message)
            setBtnLoading(false);
            
        }

    }

  return (
    <div className='mt-20 md:mt-5 z-0'>
        <div className='md:w-1/3 border border-gray-400 rounded-lg p-8 flex flex-col w-full relative shadow-md m-auto'>
            <h1 className='text-2xl font-semibold mb-6 text-center'>Forgot Password</h1>
            <form onSubmit={submithandler} className='flex flex-col gap-4'>
                <div className='flex flex-col gap-2'>
                    <label htmlFor='email'>Email</label>
                    <input type='email' id='email' value={email} onChange={(e)=>setEmail(e.target.value)} className='border border-gray-400 rounded-lg p-2' required />
                </div>
                <button type='submit' className='bg-blue-500 text-white rounded-lg p-2' disabled={btnLoading}>{btnLoading ? "Sending..." : "Send"}</button>
            </form>
        </div>
    </div>
  )
}

export default ForgotPassword