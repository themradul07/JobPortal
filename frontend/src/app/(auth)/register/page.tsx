"use client"
import { auth_service, useAppData } from '@/context/AppContext'
import axios from 'axios'
import { redirect, useRouter } from 'next/navigation'
import React, { FormEvent, useState } from 'react'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'
import { Label } from '@/components/ui/label'
import { ArrowRight, Briefcase, Key, Lock, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import Loading from '@/components/loading'

const RegisterPage = () => {
    const [name, setName] = useState("")
    const [role, setRole] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [bio, setBio] = useState("")
    const [resume, setResume] = useState<File | null>(null)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [btnLoading, setBtnLoading] = useState(false)

    const { isAuth, setUser, loading, setIsAuth, setLoading } = useAppData();
    const router = useRouter();

    if (isAuth) return redirect('/');
    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setBtnLoading(true);
        const formData = new FormData();
        formData.append("role", role)
        formData.append("name", name)
        formData.append("email", email);
        formData.append("password", password)
        formData.append("phone_number", phoneNumber)

        if (role === "jobseeker") {
            formData.append("bio", bio)
            if (resume) {
                formData.append("file", resume);
            }
        }
        try {
            const { data } = await axios.post(`${auth_service}/api/auth/register`, formData)
            toast.success(data.message);
            Cookies.set("token", data.token, {
                expires: 15,
                secure: true,
                path: "/",
            })
            setUser(data.user);
            setIsAuth(true);

        } catch (e: any) {
            console.log(e);
            toast.error(e.response.data.message);
            setIsAuth(false);
        } finally {
            setBtnLoading(false);
        }
    }
    if (loading) return <Loading />
    return (
        <div className='min-h-screen flex items-center justify-center px-4 py-12'>
            <div className='w-full max-w-md'>
                <div className='text-center mb-8'>
                    <h1 className='text-3xl font-bold'>Join HireBridge</h1>
                    <p className='text-gray-600 mt-2'>Create your account to start a new journey</p>
                </div>
                <div className='border border-gray-400 rounded-2xl p-8 shadow-lg backdrop-blur-sm'>
                    <form onSubmit={submitHandler} className='space-y-5'>
                        <div className='space-y-2'>
                            <Label htmlFor='email' className='text-sm font-medium'>I want to</Label>
                            <div className='relative'>
                                <Briefcase className='icon-style' />
                                <select id='role' value={role}
                                    onChange={(e) => {
                                        setRole(e.target.value)
                                    }}
                                    className='w-full h-11 pl-10 pr-4 border-2 border-gray-300 rounded-md bg-transparent' required
                                >
                                    <option value="">Select your role</option>
                                    <option value="jobseeker">Find a Job</option>
                                    <option value="recruiter">Hire Talent</option>

                                </select>
                            </div>
                        </div>
                        {role && <>
                            <div className='space-y-2'>
                                <Label htmlFor='name' className='text-sm font-medium'>Full Name</Label>
                                <div className='relative'>
                                    <Mail className='icon-style' />
                                    <Input id="name" type="text" onChange={e => setName(e.target.value)} required className='pl-10 h-11' value={name} placeholder='John Doe' />
                                </div>
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='email' className='text-sm font-medium'> Email Address</Label>
                                <div className='relative'>
                                    <Mail className='icon-style' />
                                    <Input id="email" type="email" onChange={e => setEmail(e.target.value)} required className='pl-10 h-11' value={email} placeholder='you@example.com' />
                                </div>
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='bio' className='text-sm font-medium'>Bio</Label>
                                <div className='relative'>
                                    <Mail className='icon-style' />
                                    <Input id="bio" type="text" onChange={e => setBio(e.target.value)} required className='pl-10 h-11' value={bio} placeholder='Tell us about yourself...' />
                                </div>
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='phoneNumber' className='text-sm font-medium'> Phone Number</Label>
                                <div className='relative'>
                                    <Mail className='icon-style' />
                                    <Input id="phoneNumber" type="text" onChange={e => setPhoneNumber(e.target.value)} required className='pl-10 h-11' value={phoneNumber} placeholder='+9199999999999' />
                                </div>
                            </div>
                            {
                                role === "jobseeker" && (
                                    // <div className='space-y-5 pt-4 border-t border-gray-400'>
                                    <div className='space-y-2'>
                                        <Label htmlFor='email' className='text-sm font-medium'>Resume (PDF)</Label>
                                        <div className='relative'>
                                            <Mail className='icon-style' />
                                            <Input id="resume" type="file" accept='application/pdf' onChange={e => {
                                                if (e.target.files && e.target.files.length > 0) {
                                                    setResume(e.target.files[0]);
                                                }
                                            }} required className='pl-10 h-11' />
                                        </div>
                                    </div>
                                    // </div>
                                )
                            }
                            <div className='space-y-2'>
                                <Label htmlFor='password' className='text-sm font-medium'> Password</Label>
                                <div className='relative'>
                                    <Lock className='icon-style' />
                                    <Input id="password" type="password" onChange={e => setPassword(e.target.value)} required className='pl-10 h-11' value={password} placeholder='********' />
                                </div>

                                <div className='flex items-center justify-end'>
                                    <Link href={"/forgot"} className='text-sm text-blue-500 hover:underline transition-all'>Forgot Password?</Link>
                                </div>
                                <Button type='submit' disabled={btnLoading} className='w-full h-11'>
                                    {btnLoading ? 'Signing in...' : 'Register'}
                                    <ArrowRight size={18} />
                                </Button>
                            </div>
                        </>}
                    </form>

                    <div className='mt-6 pt-6 border-t border-gray-400'>
                        <p className='text-center text-sm'>
                            Already have an account? {" "}
                            <Link href={"/login"} className='text-blue-500 font-medium hover:underline transition-all'>
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage