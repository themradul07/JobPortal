"use client"
import { job_service, useAppData } from '@/context/AppContext'
import React, { useEffect, useRef, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import toast from 'react-hot-toast'
import Loading from '@/components/loading'
import { Card, CardDescription, CardTitle } from '@/components/ui/card'
import { Award, Briefcase, Building, Building2, Eye, File, Globe, Plus, Trash2 } from 'lucide-react'
import { Company as CompanyType, User } from '@/lib/type'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

const Company = ({ user, isYourAccount }: { user: User, isYourAccount: boolean }) => {
    const { loading, btnLoading, setBtnLoading, setLoading } = useAppData();
    const addRef = useRef<HTMLButtonElement | null>(null);
    const token = Cookies.get("token");
    const [compLoading, setcompLoading] = useState(false);

    const fetchCompanies = async () => {
        try {
            setcompLoading(true);
            const { data } = await axios.get(`${job_service}/api/job/company/all`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(data)
            if (data.companies?.length > 0) {
                setCompanies(data.companies);
            }
        } catch (error: any) {
            console.log(error);

        }finally{
            setcompLoading(false)
        }
    }
    useEffect(() => {
        fetchCompanies();
    }, [])
    const openDialog = () => {
        if (addRef.current) {
            addRef.current.click();
        }
    }

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [website, setWebsite] = useState("");
    const [logo, setLogo] = useState<File | null>(null);
    const [companies, setCompanies] = useState<CompanyType[]>([]);

    const clearData = () => {
        setName("");
        setDescription("");
        setWebsite("");
        setLogo(null);
    }

    async function addCompanyHandler() {
        if (!name || !description || !website || !logo) {
            toast.error("Please Provide all details");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("website", website);
        formData.append("file", logo);

        try {
            setBtnLoading(true);
            const token = Cookies.get("token");
            const { data } = await axios.post(`${job_service}/api/job/create/new`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success(data.message);
            clearData();
            fetchCompanies();
            if (addRef.current) {
                addRef.current.click();
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
        } finally {
            setBtnLoading(false);
        }
    }

    async function deleteCompanyHandler(id: number) {
        if(!confirm("Are you sure you want to delete this company?")){
            return;
        }
        setLoading(true);
        try {
            setBtnLoading(true);
            const token = Cookies.get("token");
            const { data } = await axios.delete(`${job_service}/api/job/company/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success(data.message);
            fetchCompanies();
        } catch (error: any) {
            toast.error(error.response.data.message);
        } finally {
            setBtnLoading(false);
            setLoading(false)
        }
    }

    if (loading) return <Loading />

    return (
        <div className='max-w-7xl mx-auto px-4 py-6'>
            <Card className='shadow-lg border-2 overflow-hidden'>
                <div className='bg-blue-500 p-6 border-b'>
                    <div className='flex items-center justify-between flex-wrap gap-4'>
                        <div className='flex items-baseline gap-3 mb-4'>
                            <div className='h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center'>
                                <Building2 size={20} className='text-blue-600' />
                            </div>
                            <CardTitle className='text-2xl font-bold text-white'>{isYourAccount ? "My Companies" : "User Companies"}</CardTitle>
                            {isYourAccount && <CardDescription className='text-xs text-blue-100'>Manage your registered companies {companies?.length}/3</CardDescription>}
                        </div>
                        {companies.length < 3 && <Button onClick={openDialog} className='gap-2'>
                            <Plus size={18} />
                            Add Company
                        </Button>}
                    </div>

                </div>

                <div className='p-6'>
                    {compLoading ? <Loading /> : <>
                    {companies?.length > 0 ? <div className='grid gap-4'>
                        {companies.map((c) => (
                    
                            <div key={c.company_id} className='flex items-center gap-4 p-4 rounded-lg border-2 hover:bordeer-blue-500 transition-all bg-background'>
                                <div className='h-16 w-16 rounded-full border-2 overflow-hidden shrink-0 bg-background'>
                                    <img src={c.logo} alt={c.name} className='w-full h-full object-cover' />
                                </div>

                                {/* Company Info */}
                                <div className='flex-1 min-w-0'>
                                    <h3 className='font-semibold text-lg mb-1 truncate'>{c.name}</h3>
                                    <p className='text-sm text-muted-foreground truncate line-clamp-2 mb-2'>{c.description}</p>
                                    <a href={c.website} target='_blank' className='text-xs text-blue-500 hover:underline items-center flex gap-1'>
                                        <Globe size={12} />    {c.website}
                                    </a>
                                </div>

                                {/* Actions */}
                                <div className='flex items-center gap-2 shrink-0'>
                                    <Link href={`/account/company/${c.company_id}`}>
                                        <Button size="icon" variant="outline" className='gap-2'>
                                            <Eye size={16} />
                                        </Button>
                                    </Link>
                                    <Button size="icon" variant="destructive" className='gap-2' onClick={() => deleteCompanyHandler(c.company_id)}>
                                        <Trash2 size={16} />
                                    </Button>

                                </div>
                            </div>
                        ))}
                    </div> : <>
                        <div className='text-center py-12'>
                            <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4'>
                                <Building2 size={32} className='text-gray-400 dark:text-gray-600' />
                            </div>
                            <h3 className='text-xl font-semibold mb-2'>No Companies Found</h3>
                            <p className='text-muted-foreground mb-4'>Add your first company and start posting Jobs</p>
                        </div>
                    </>}
                    </>}
                </div>
            </Card>

            {/* Add Company Dialog  */}
            <Dialog>
                <DialogTrigger asChild>
                    <Button className='hidden' ref={addRef}>

                    </Button>
                </DialogTrigger>
                <DialogContent className='sm:mx-w-[550px]'>
                    <DialogHeader>
                        <DialogTitle className='text-2xl flex items-center gap-2 '>
                            <Building2 className='text-blue-600' />Add New Company
                        </DialogTitle>
                    </DialogHeader>
                    <div className='space-y-5 py-4'>
                        <div className='space-y-2'>
                            <Label htmlFor='name' className='text-sm font-medium flex items-center gap-2'>
                                <Briefcase size={16} /> Company Name
                            </Label>
                            <Input
                                id='name'
                                value={name}
                                type='text'
                                onChange={(e) => setName(e.target.value)} placeholder='Enter Company Name'
                                className='h-11'
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor='description' className='text-sm font-medium flex items-center gap-2'>
                                <File size={16} /> Company Description
                            </Label>
                            <Input
                                id='description'
                                value={description}
                                type='text'
                                onChange={(e) => setDescription(e.target.value)} placeholder='Enter Company Description'
                                className='h-11'
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor='website' className='text-sm font-medium flex items-center gap-2'>
                                <Globe size={16} /> Company Website
                            </Label>
                            <Input
                                id='website'
                                value={website}
                                type='text'
                                onChange={(e) => setWebsite(e.target.value)} placeholder='Enter Company Website'
                                className='h-11'
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor='logo' className='text-sm font-medium flex items-center gap-2'>
                                <Briefcase size={16} /> Company Logo
                            </Label>
                            <Input
                                id='logo'
                                type='file'
                                accept='image/*'
                                onChange={(e) => setLogo(e.target.files?.[0] || null)}
                                className='items-center'
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button disabled={btnLoading} onClick={addCompanyHandler} className='w-full h-11'>
                            {btnLoading ? "Adding Company..." : "Add Company"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Company // toast.error(error.response.data.message);