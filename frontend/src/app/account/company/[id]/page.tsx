"use client"

import { useParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import Cookies from 'js-cookie';
import { job_service, useAppData } from '@/context/AppContext';
import { Company as CompanyType, Job } from '@/lib/type';
import axios from 'axios';
import Loading from '@/components/loading';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Briefcase, Building2, CheckCircle, Clock, DollarSign, Eye, File, Globe, Laptop, MapPin, Pencil, Plus, Trash2, Users, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CompanyPage = () => {
    const { id } = useParams();
    const token = Cookies.get("token");
    const { user, isAuth } = useAppData();
    const [loading, setLoading] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);
    const [company, setCompany] = useState<CompanyType | null>(null);


    const fetchCompany = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${job_service}/api/job/company/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCompany(data);
            console.log("This is the data", data);
        } catch (error: any) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchCompany();
    }, [id])


    const isRecruiterOwner = user && company && user.user_id === company.recruiter_id


    const [isUpdatedModalOpen, setIsUpdatedModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null)
    const addModalRef = useRef<HTMLButtonElement>(null);
    const updateModalRef = useRef<HTMLButtonElement>(null)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [role, setRole] = useState("");
    const [salary, setSalary] = useState("");
    const [location, setLocation] = useState("");
    const [openings, setOpenings] = useState("")
    const [job_type, setJob_type] = useState("")
    const [work_location, setWork_location] = useState("")
    const [is_active, setIs_active] = useState(true)

    const clearInput = () => {
        setTitle("");
        setDescription("");
        setRole("")
        setSalary("")
        setLocation("");
        setOpenings("")
        setJob_type("");
        setWork_location("")
        setIs_active(true)
    }

    const addJobHandler = async () => {
        setBtnLoading(true)
        try {
            const jobData = {
                title,
                description,
                role,
                salary: Number(salary),
                location,
                openings: Number(openings),
                job_type,
                work_location,
                company_id: id,
            }
            await axios.post(`${job_service}/api/job/new`, jobData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success("Job added successfully");
            fetchCompany();
            clearInput();
            addModalRef.current?.click();

        } catch (e: any) {
            console.log(e);
            toast.error("Something went wrong");
        } finally {
            setBtnLoading(false)
        }
    }

    const deleteCompanyHandler = async () => {
        setBtnLoading(true)
        try {
            await axios.delete(`${job_service}/api/job/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success("Company deleted successfully");
            fetchCompany();
            clearInput();
        } catch (e: any) {
            console.log(e);
            toast.error("Something went wrong");
        } finally {
            setBtnLoading(false)
        }
    }

    const handleOpenUpdateModal = (job: Job) => {
        setSelectedJob(job);
        setTitle(job.title);
        setDescription(job.description);
        setRole(job.role);
        setSalary(String(job.salary));
        setLocation(String(job.location));
        setOpenings(String(job.openings));
        setJob_type(job.job_type);
        setWork_location(job.work_location);
        setIs_active(job.is_active);
        setIsUpdatedModalOpen(true);
    }

    const handleCloseUpdateModal = () => {
        setIsUpdatedModalOpen(false);
        setSelectedJob(null);
        clearInput();
    }

    const updateJobHandler = async () => {
        setBtnLoading(true)
        try {
            const jobData = {
                title,
                description,
                role,
                salary: Number(salary),
                location,
                openings: Number(openings),
                job_type,
                work_location,
                company_id: id,
                job_id: selectedJob?.job_id,
                is_active: is_active,
            }
            await axios.put(`${job_service}/api/job/${selectedJob?.job_id}`, jobData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success("Job updated successfully");
            fetchCompany();
            clearInput();
            handleCloseUpdateModal();
        } catch (e: any) {
            console.log(e);
            toast.error("Something went wrong");
        } finally {
            setBtnLoading(false)
        }
    }

    const deleteJobHandler = async (jobId: number) => {
        setBtnLoading(true)
        try {
            await axios.delete(`${job_service}/api/job/job/${jobId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success("Job deleted successfully");
            fetchCompany();
        } catch (e: any) {
            console.log(e);
            toast.error("Something went wrong");
        } finally {
            setBtnLoading(false)
        }
    }
    if (loading) return <Loading />
    return (
        <div className='min-h-screen bg-secondary/30 '>
            {company && <div className='max-w-6xl mx-auto px-4 py-8'>
                <Card className='overflow-hidden shadow-lg border-2 mb-8 py-8'>
                    <div className='h-32 bg-blue-600'>
                        <div className='px-8 pb-8'>
                            <div className='flex flex-col md:flex-row gap-6 items-start md:items-start md:mt-6 '>
                                <div className=' w-26 h-26 md:w-32 md:h-32 rounded-2xl border-4 border-background overflow-hidden shadow-xl bg-background shrink-0'>
                                    <img src={company.logo} alt="" className='w-full h-full object-cover rounded-2xl' />
                                </div>
                                <div className='flex-1 md:mb-4'>
                                    <h1 className='text-3xl font-bold text-white mb-2'>{company.name}</h1>
                                    <p className='text-base leading-relaxed opacity-80 max-w-3xl text-white'>
                                        {company.description}
                                    </p>
                                </div>
                                <Link href={`https://${company.website}`} target='_blank' className='md:mb-4' >
                                    <Button className='gap-2 h-11' >
                                        <Globe size={18} />
                                        Visit Website
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </Card>

                <Dialog>
                    {/* Job Openings */}
                    <Card className='shadow-lg border-2 overflow-hidden'>
                        <div className='bg-blue-600 border-b p-6'>
                            <div className='flex items-center  flex-wrap gap-4 w-full'>
                                <div className='flex items-center gap-3'>
                                    <div className='h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center'>
                                        <Briefcase size={20} className='text-blue-600 dark:text-blue-100' />
                                    </div>
                                </div>
                                <h2 className='text-2xl font-bold text-white'>Open Positions</h2>
                                <p className='text-sm opacity-70 text-white'>{company.jobs?.length || 0}{" "}
                                    {company.jobs?.length !== 1 ? "Openings" : "Opening"}
                                </p>
                                <div className='ml-auto'>


                                    {isRecruiterOwner && <>
                                        <DialogTrigger asChild>
                                            <Button className='gap-2 h-11'>
                                                <Plus size={18} /> Post New Job
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto custom-scrollbar'>
                                            <DialogHeader>
                                                <DialogTitle className='text-2xl flex items-center gap-2'>
                                                    <Plus size={24} /> Post a new Job
                                                </DialogTitle>
                                            </DialogHeader>
                                            <div className='space-y-5 py-4'>
                                                <div className='space-y-2'>
                                                    <Label htmlFor='title' className='text-sm font-medium flex items-center gap-2'>
                                                        <Briefcase size={16} /> Job Title
                                                    </Label>
                                                    <Input
                                                        id='title'
                                                        value={title}
                                                        type='text'
                                                        onChange={(e) => setTitle(e.target.value)} placeholder='Enter Job Title'
                                                        className='h-11'
                                                    />
                                                </div>
                                                <div className='space-y-2'>
                                                    <Label htmlFor='description' className='text-sm font-medium flex items-center gap-2'>
                                                        <File size={16} /> Job Description
                                                    </Label>
                                                    <Input
                                                        id='description'
                                                        value={description}
                                                        type='text'
                                                        onChange={(e) => setDescription(e.target.value)} placeholder='Enter Job Description'
                                                        className='h-11'
                                                    />
                                                </div>
                                                <div className='space-y-2'>
                                                    <Label htmlFor='role' className='text-sm font-medium flex items-center gap-2'>
                                                        <Building2 size={16} /> Role/Department
                                                    </Label>
                                                    <Input
                                                        id='role'
                                                        value={role}
                                                        type='text'
                                                        onChange={(e) => setRole(e.target.value)} placeholder='Enter Job Role'
                                                        className='h-11'
                                                    />
                                                </div>
                                                <div className='space-y-2'>
                                                    <Label htmlFor='salary' className='text-sm font-medium flex items-center gap-2'>
                                                        <DollarSign size={16} /> Salary
                                                    </Label>
                                                    <Input
                                                        id='salary'
                                                        value={salary}
                                                        type='text'
                                                        onChange={(e) => setSalary(e.target.value)} placeholder='Enter Job Salary'
                                                        className='h-11'
                                                    />
                                                </div>
                                                <div className='space-y-2'>
                                                    <Label htmlFor='openings' className='text-sm font-medium flex items-center gap-2'>
                                                        <Users size={16} /> Openings
                                                    </Label>
                                                    <Input
                                                        id='openings'
                                                        value={openings}
                                                        type='text'
                                                        onChange={(e) => setOpenings(e.target.value)} placeholder='Enter Number of Openings'
                                                        className='h-11'
                                                    />
                                                </div>
                                                {/* <div className='space-y-2'>
                                            <Label htmlFor='location' className='text-sm font-medium flex items-center gap-2'>
                                                <MapPin size={16} /> Location
                                            </Label>
                                            <Input
                                                id='location'
                                                value={location}
                                                type='text'
                                                onChange={(e) => setLocation(e.target.value)} placeholder='Enter Job Location'
                                                className='h-11'
                                            />
                                        </div> */}
                                                <div className='grid md:grid-cols-2 gap-4'>
                                                    <div className='space-y-2'>
                                                        <Label htmlFor='job_type' className='text-sm font-medium flex items-center gap-1'>
                                                            <Clock size={16} /> Job Type
                                                        </Label>
                                                        <Select value={job_type} onValueChange={setJob_type}>
                                                            <SelectTrigger className='h-11'>
                                                                <SelectValue placeholder='Select Job Type' />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value='Full-time'>Full Time</SelectItem>
                                                                <SelectItem value='Part-time'>Part Time</SelectItem>
                                                                <SelectItem value='Contract'>Contract</SelectItem>
                                                                <SelectItem value='Internship'>Internship</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className='space-y-2'>
                                                        <Label htmlFor='work_location' className='text-sm font-medium flex items-center gap-1'>
                                                            <Clock size={16} /> Work Location
                                                        </Label>
                                                        <Select value={work_location} onValueChange={setWork_location}>
                                                            <SelectTrigger className='h-11'>
                                                                <SelectValue placeholder='Select Work Location' />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value='On-site'>On-site</SelectItem>
                                                                <SelectItem value='Remote'>Remote</SelectItem>
                                                                <SelectItem value='Hybrid'>Hybrid</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                                <div className='space-y-2'>
                                                    <Label htmlFor='location' className='text-sm font-medium flex items-center gap-2'>
                                                        <MapPin size={16} /> Location
                                                    </Label>
                                                    <Input
                                                        id='location'
                                                        value={location}
                                                        type='text'
                                                        onChange={(e) => setLocation(e.target.value)} placeholder='Enter Job Location'
                                                        className='h-11'
                                                    />
                                                </div>
                                            </div>
                                            <DialogFooter >
                                                <DialogClose asChild>
                                                    <Button ref={addModalRef} variant='outline'>Cancel</Button>
                                                </DialogClose>
                                                <Button disabled={btnLoading} onClick={addJobHandler} type='submit'>{btnLoading ? "Posting job..." : "Post Job"}</Button>
                                            </DialogFooter>

                                        </DialogContent>
                                    </>}
                                </div>
                            </div>
                        </div>
                        <div className='p-6 bg-background'>
                            {company.jobs && company.jobs.length > 0 ? (
                                <div className='space-y-4'>
                                    {company.jobs.map((job) => (
                                        <div key={job.job_id} className='p-5 rounded-lg border-2 hover:border-blue-500 transition-all bg-background'>
                                            <div className='flex-1 min-w-0'>
                                                <div className='flex items-center gap-3 mb-3 flex-wrap'>
                                                    <h3 className='text-xl font-semibold truncate'>{job.title}</h3>
                                                    <span className={`text-xs px-3 py-1 rounded-full flex items-center gap-1 ${job.is_active ? "bg-green-100 dark:bg-green-900/30 text-green-600" : "bg-gray-100 dark:bg-gray-800 text-gray-600"}`}>
                                                        {job.is_active ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                                        {job.is_active ? "Active" : "Inactive"}
                                                    </span>
                                                </div>
                                                <div className='flex flex-col md:flex-row  items-start md:items-center gap-x-6 gap-y-3 text-sm'>
                                                    <div className='flex items-center gap-2 opacity-70'>
                                                        <Building2 size={16} />
                                                        <span>{job.role}</span>
                                                    </div>
                                                    <div className='flex items-center gap-2 opacity-70'>
                                                        <DollarSign size={16} />
                                                        <span>{job.salary ? `₹${job.salary.toLocaleString()}` : "Not Disclosed"}</span>
                                                    </div>

                                                    <div className='flex items-center gap-2 opacity-70'>
                                                        <MapPin size={16} />
                                                        <span>{job.location}</span>
                                                    </div>
                                                    <div className='flex items-center gap-2 opacity-70'>
                                                        <Laptop size={16} />
                                                        <span>{job.work_location}({job.job_type})</span>
                                                    </div>
                                                    <div className='flex items-center gap-2 opacity-70'>
                                                        <Users size={16} />
                                                        <span>{job.openings}</span>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className='flex items-center gap-2 mt-2'>
                                                <Link href={`/jobs/${job.job_id}`} >
                                                    <Button variant='outline' size='sm' className='gap-2'><Eye size={16} />View</Button>
                                                </Link>
                                                {
                                                    isRecruiterOwner && <>
                                                        <Button onClick={() => handleOpenUpdateModal(job)} variant='outline' size='sm' className='gap-2'>
                                                            <Pencil size={16} />Edit
                                                        </Button>
                                                        <Button onClick={() => deleteJobHandler(job.job_id)} variant='outline' size='sm' className='gap-2'>
                                                            <Trash2 size={16} />Delete
                                                        </Button>
                                                    </>
                                                }
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className='text-center py-12'>
                                    <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4'>
                                        <Briefcase size={32} className='opacity-40' />
                                    </div>
                                    <p>No jobs posted yet</p>
                                </div>
                            )}
                        </div>



                    </Card>
                </Dialog>

                <Dialog open={isUpdatedModalOpen} onOpenChange={setIsUpdatedModalOpen}>
                    <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto custom-scrollbar'>
                        <DialogHeader>
                            <DialogTitle className='text-2xl flex items-center gap-2'>
                                <Plus size={24} /> Post a new Job
                            </DialogTitle>
                        </DialogHeader>
                        <div className='space-y-5 py-4'>
                            <div className='space-y-2'>
                                <Label htmlFor='title' className='text-sm font-medium flex items-center gap-2'>
                                    <Briefcase size={16} /> Job Title
                                </Label>
                                <Input
                                    id='title'
                                    value={title}
                                    type='text'
                                    onChange={(e) => setTitle(e.target.value)} placeholder='Enter Job Title'
                                    className='h-11'
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='description' className='text-sm font-medium flex items-center gap-2'>
                                    <File size={16} /> Job Description
                                </Label>
                                <Input
                                    id='description'
                                    value={description}
                                    type='text'
                                    onChange={(e) => setDescription(e.target.value)} placeholder='Enter Job Description'
                                    className='h-11'
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='role' className='text-sm font-medium flex items-center gap-2'>
                                    <Building2 size={16} /> Role/Department
                                </Label>
                                <Input
                                    id='role'
                                    value={role}
                                    type='text'
                                    onChange={(e) => setRole(e.target.value)} placeholder='Enter Job Role'
                                    className='h-11'
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='salary' className='text-sm font-medium flex items-center gap-2'>
                                    <DollarSign size={16} /> Salary
                                </Label>
                                <Input
                                    id='salary'
                                    value={salary}
                                    type='text'
                                    onChange={(e) => setSalary(e.target.value)} placeholder='Enter Job Salary'
                                    className='h-11'
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='openings' className='text-sm font-medium flex items-center gap-2'>
                                    <Users size={16} /> Openings
                                </Label>
                                <Input
                                    id='openings'
                                    value={openings}
                                    type='text'
                                    onChange={(e) => setOpenings(e.target.value)} placeholder='Enter Number of Openings'
                                    className='h-11'
                                />
                            </div>
                            {/* <div className='space-y-2'>
                                            <Label htmlFor='location' className='text-sm font-medium flex items-center gap-2'>
                                                <MapPin size={16} /> Location
                                            </Label>
                                            <Input
                                                id='location'
                                                value={location}
                                                type='text'
                                                onChange={(e) => setLocation(e.target.value)} placeholder='Enter Job Location'
                                                className='h-11'
                                            />
                                        </div> */}
                            <div className='grid md:grid-cols-2 gap-4'>
                                <div className='space-y-2'>
                                    <Label htmlFor='job_type' className='text-sm font-medium flex items-center gap-1'>
                                        <Clock size={16} /> Job Type
                                    </Label>
                                    <Select value={job_type} onValueChange={setJob_type}>
                                        <SelectTrigger className='h-11'>
                                            <SelectValue placeholder='Select Job Type' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='Full-time'>Full Time</SelectItem>
                                            <SelectItem value='Part-time'>Part Time</SelectItem>
                                            <SelectItem value='Contract'>Contract</SelectItem>
                                            <SelectItem value='Internship'>Internship</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className='space-y-2'>
                                    <Label htmlFor='work_location' className='text-sm font-medium flex items-center gap-1'>
                                        <Clock size={16} /> Work Location
                                    </Label>
                                    <Select value={work_location} onValueChange={setWork_location}>
                                        <SelectTrigger className='h-11'>
                                            <SelectValue placeholder='Select Work Location' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='On-site'>On-site</SelectItem>
                                            <SelectItem value='Remote'>Remote</SelectItem>
                                            <SelectItem value='Hybrid'>Hybrid</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='location' className='text-sm font-medium flex items-center gap-2'>
                                    <MapPin size={16} /> Location
                                </Label>
                                <Input
                                    id='location'
                                    value={location}
                                    type='text'
                                    onChange={(e) => setLocation(e.target.value)} placeholder='Enter Job Location'
                                    className='h-11'
                                />
                            </div>
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='update-is_active' className='text-sm font-medium flex items-center gap-2 '>{
                                is_active ? <CheckCircle size={16} className='text-green-600' /> : <XCircle size={16} className='text-gray-50' />}
                                Status
                            </Label>

                            <Select value={is_active ? "true" : "false"} onValueChange={(value) => setIs_active(value === "true")}>
                                <SelectTrigger className='h-11'>
                                    <SelectValue placeholder='Select Status' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='true'>Active</SelectItem>
                                    <SelectItem value='false'>Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter >
                            <DialogClose asChild>
                                <Button ref={addModalRef} variant='outline'>Cancel</Button>
                            </DialogClose>
                            <Button disabled={btnLoading} onClick={updateJobHandler} type='submit'>{btnLoading ? "Updating job..." : "Update Job"}</Button>

                        </DialogFooter>

                    </DialogContent>


                </Dialog>
            </div>
            }
        </div>
    )
}

export default CompanyPage