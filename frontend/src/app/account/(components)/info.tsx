"use client"
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAppData, user_service } from '@/context/AppContext'
import { AccountProps } from '@/lib/type'
import axios from 'axios'
import { AlertTriangle, Briefcase, Camera, CheckCircle2, Crown, Edit, FileText, Mail, Pencil, Phone, UserIcon } from 'lucide-react'
import Link from 'next/link'
import React, { ChangeEvent, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import Loading from '@/components/loading'

const Info = ({ user, isYourAccount }: AccountProps) => {
    const inputRef = useRef<HTMLInputElement | null>(null)
    const editRef = useRef<HTMLButtonElement | null>(null)
    const resumeRef = useRef<HTMLInputElement | null>(null)
    const [name, setName] = useState(user.name)
    const [phone, setPhone] = useState(user.phone_number)
    const [bio, setBio] = useState(user.bio)
    const { updateProfileHandler, updateResumeHandler, btnLoading, updateUser, setLoading, loading, setBtnLoading } = useAppData();

    const handleClick = async () => {
        inputRef.current?.click();
    }

    const changeHandler = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setBtnLoading(true);
            try {
                const formData = new FormData()
                formData.append("file", file);
                await updateProfileHandler(formData);
             
            } catch (error: any) {
                toast.error(error.response.data.message);
            } finally {
                setBtnLoading(false);
            }
        }
    }

    const updateUserProfile = async () => {
        setBtnLoading(true)
        try {
            await updateUser(name, phone, bio ? bio : "");
            
        } catch (error: any) {
            toast.error(error.response.data.message);
        } finally {
            setBtnLoading(false)
        }
    }

    const handleEditClick = () => {
        editRef.current?.click();
        setName(user.name)
        setPhone(user.phone_number)
        setBio(user.bio)
    }

    const changeResume = async (e: ChangeEvent<HTMLInputElement>) => {
        setBtnLoading(true)
        const file = e.target.files?.[0]
        try{if (file) {
            if (file.type !== "application/pdf") {
                toast.error("Please upload a PDF file");
                return;
            }
            const formData = new FormData()
            formData.append("file", file);
            await updateResumeHandler(formData);
        }} catch (error: any) {
            toast.error(error.response.data.message);
        } finally {
            setBtnLoading(false)
        }
    }

    const handleResumeClick = async () => {
        resumeRef.current?.click();
    }

    const router = useRouter();

    return (
        <div className='max-w-5xl mx-auto px-4 py-8'>
            <Card className='overflow-hidden shadow-lg border-2 '>
                <div className='h-32 bg-blue-500 relative'>
                    <div className='absolute -bottom-16 left-8'>
                        <div className='w-32 h-32 rounded-full border-4 border-background overflow-hidden shadow-xl bg-background'>
                            <img src={user.profile_pic ? (user?.profile_pic as string) : "/user.png"} alt="" className='w-full h-full object-cover' />
                        </div>
                        {isYourAccount && (<>
                            <Button variant={"secondary"} onClick={handleClick} className='absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition-colors'>
                                <Camera size={16} />
                            </Button>
                            <input type="file" ref={inputRef} onChange={changeHandler} className='hidden' accept='image/*' />
                        </>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <div className='pt-20 pb-8 px-8 '>
                    <div className='flex items-start justify-between flex-wrap gap-4'>
                        <div className='space-y-1'>
                            <div className='flex items-center gap-3'>
                                <h1 className='text-3xl font-bold'>{user.name}</h1>
                                {isYourAccount && <Button variant={"ghost"} size={"icon"} className='h-8 w-8' onClick={handleEditClick}>
                                    <Edit size={16} />
                                </Button>}
                            </div>
                            <div className='flex items-center gap-2 text-sm opacity-70'>
                                <Briefcase size={16} />
                                <span className='capitalize'>{user.role}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bio Section */}
                {user.role === "jobseeker" && user.bio && (
                    <div className='mt-6 mx-4 p-4 rounded-lg border'>
                        <div className='flex items-center gap-2 mb-2 text-sm font-medium  opacity-70'>
                            <FileText size={16} />
                            <span>Bio</span>
                        </div>
                        <p className='text-gray-600'>{user.bio}</p>
                    </div>
                )}

                {/* Contact Info */}
                <div className='mt-8 mx-4'>
                    <h2 className='text-lg font-semibold mb-4 flex items-center gap-2'>
                        <Mail size={20} className='text-blue-600' />
                        Contact Information
                    </h2>
                    <div className='grid md:grid-cols-2 gap-4'>
                        <div className='flex items-center gap-3 p-4 rounded-lg border hover:border-blue-500 transition-colors'>
                            <div className='h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center'>
                                <Mail size={18} className='text-blue-600' />
                            </div>
                            <div className='flex-1'>
                                <p className='text-sm font-medium'>Email</p>
                                <p className='text-gray-600'>{user.email}</p>
                            </div>
                        </div>

                        <div className='flex items-center gap-3 p-4 rounded-lg border hover:border-blue-500 transition-colors'>
                            <div className='h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center'>
                                <Phone size={18} className='text-blue-600' />
                            </div>
                            <div className='flex-1'>
                                <p className='text-sm font-medium'>Phone Number</p>
                                <p className='text-gray-600'>{user.phone_number}</p>
                            </div>
                        </div>
                    </div>

                    {/* Resume Section */}
                    {user.role === "jobseeker" && user.resume && (
                        <div className='mt-8 mx-4'>
                            <h2 className='text-lg font-semibold mb-4 flex items-center gap-2'>
                                <FileText size={20} className='text-blue-600' />
                                Resume
                            </h2>
                            <div className='flex items-center gap-3 p-4 rounded-lg border hover:border-blue-500 transition-colors'>
                                <div className='h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center'>
                                    <FileText size={20} className='text-red-600' />
                                </div>
                                <div className='flex-1'>
                                    <p className='text-sm font-medium'>Resume Document</p>
                                    <Link href={user.resume} className='text-gray-600 hover:text-blue-600 transition-colors'>View Resume pdf</Link>
                                </div>
                                <Button variant={"outline"} size={"sm"} onClick={handleResumeClick} className='cursor-pointer'>
                                    <input type="file" ref={resumeRef} onChange={changeResume} className='hidden' accept='application/pdf' />
                                    <Pencil size={16} />
                                </Button>
                            </div>
                        </div>
                    )}

                    {
                        isYourAccount && user.role === "jobseeker" && (
                            <div className='mt-8'>
                                <h2 className='text-lg font-semibold mt-4 flex items-center gap-2'>
                                    <Crown size={20} className='text-blue-600'/>
                                    Subscription Status                                       
                                </h2>
                                <div className='mt-4 p-6 rounded-lg bg-linear-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-950/20 border'>
                                    {!user.subscription ? (
                                        <div className='flex items-center justify-between flex-wrap gap-4'>
                                            <div>
                                                <p className='font-semibold text-lg mb-1'>
                                                    No Active Subscriptions
                                                </p>
                                                <p className='text-gray-600 dark:text-gray-400'>
                                                    Upgrade to Premium to unlock exclusive features
                                                </p>
                                            </div>
                                            <Button className='h-11 gap-2' onClick={() => router.push('/subscribe')}>
                                                <Crown size={18}/>
                                                Subscribe Now
                                            </Button>
                                        </div>
                                    ) : new Date(user.subscription).getTime() > Date.now() ? (
                                        <div className='flex items-center justify-between flex-wrap gap-4'>
                                            <div>
                                                <div className='flex items-center gap-2 mb-2'>
                                                    <CheckCircle2 size={20} className='text-green-600'/>
                                                    <p className='font-semibold text-green-600 text-lg'>Active Subscription</p>
                                                </div>
                                                <p className='text-sm opacity-70'>Valid until:{" "} {new Date(user.subscription).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric"
                                                })}</p>
                                            </div>
                                            <div className='flex items-center gap-2 px-4 py-2 rounded-full bg-green-700 text-white font-medium'>
                                                <CheckCircle2 size={18}/>Subscribed
                                            </div>
                                        </div>
                                    ) : (
                                        <div className='flex items-center justify-between flex-wrap gap-4'>
                                            <div>
                                                <div className='flex items-center gap-2 mb-2'>
                                                    <AlertTriangle size={20} className='text-red-600'/>
                                                    <p className='font-semibold text-red-600 text-lg'>Subscription Expired</p>
                                                </div>
                                                <p className='text-sm opacity-70'>Expired On:{" "} {new Date(user.subscription).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric"
                                                })}
                                                </p>
                                            </div>
                                            <Button variant={"destructive"} className='gap-2' onClick={() => router.push("/subscribe")}>
                                                <Crown size={18}/>
                                                Renew Subscription
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    }

                </div>
            </Card>

            <Dialog>
                <DialogTrigger asChild>
                    <Button ref={editRef} variant={"outline"} className='hidden'>Edit Profile</Button>
                </DialogTrigger>
                <DialogContent className='sm:max-w-[500px]'>
                    <DialogHeader>
                        <DialogTitle className='text-2xl'>Edit Profile</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className='space-y-5 py-4'>
                        <div className='space-y-2'>
                            <Label htmlFor='name' className='text-sm font-medium flex items-center gap-2'><UserIcon size={16} />Full Name</Label>
                            <Input id='name' value={name} onChange={(e) => setName(e.target.value)} className='w-full h-11' />
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='phone' className='text-sm font-medium flex items-center gap-2'><Phone size={16} />Phone Number</Label>
                            <Input id='phone' value={phone} onChange={(e) => setPhone(e.target.value)} className='w-full h-11' />
                        </div>

                        {user.role === "jobseeker" && <>
                            <div className='space-y-2'>
                                <Label htmlFor='bio' className='text-sm font-medium flex items-center gap-2'><FileText size={16} />Bio</Label>
                                <Input id='bio' value={bio || ""} onChange={(e) => setBio(e.target.value)} className='w-full h-11' />
                            </div>
                        </>
                        }
                        <DialogFooter>
                            <Button disabled={btnLoading} className='w-full h-11' type='submit' onClick={updateUserProfile}>{btnLoading ? "Saving..." : "Save changes"}</Button>
                        </DialogFooter>

                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Info