"use client"
import Loading from '@/components/loading';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { job_service, useAppData } from '@/context/AppContext'
import { Application, Job } from '@/lib/type';
import axios from 'axios';
import { ArrowLeft, ArrowRight, Briefcase, Building2, CheckCircle2, MapPin } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import Link from 'next/link';

const JobPage = () => {
    const { id } = useParams();
    const { user, isAuth, applyJob, applications, btnLoading } = useAppData()
    const router = useRouter();
    const [job, setJob] = useState<Job | null>(null)
    const [applied, setApplied] = useState(false)
    const [jobApplications, setjobApplications] = useState<Application[] | null>([])
    const token = Cookies.get("token")

    useEffect(() => {
        if (applications && id) {
            const hasApplied = applications.some((item: any) => item.job_id.toString() === id);
            setApplied(hasApplied);
        }
    }, [applications, id])

    const applyJobHandler = (id: number) => {
        applyJob(id);
    }
    const [loading, setLoading] = useState(true);
    async function fetchSingleJob() {
        setLoading(true);
        console.log("Fetching Started....")
        try {
            const { data } = await axios.get(`${job_service}/api/job/${id}`)
            console.log(data);
            setJob(data)
        } catch (error: any) {
            console.log(error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false)
        }
    }

    async function fetchJobApplications() {
        try {
            const { data } = await axios.get(`${job_service}/api/job/${id}/applications`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setjobApplications(data)
        } catch (error: any) {
            console.log(error);
            toast.error("Something went wrong");
        }
    }

    useEffect(() => {
        fetchSingleJob();
    }, [id])

    useEffect(() => {
        if (user && job && user.role === "recruiter") {
            fetchJobApplications();
        }
    }, [user, job])

    const [filterStatus, setfilterStatus] = useState("All")

    const filteredApplications = filterStatus === 'All' ? jobApplications : jobApplications?.filter((app: Application) => app.status === filterStatus)

    const [value, setValue] = useState("")
    const updateApplicationHandler = async (applicationId: number) => {
        if (value === "") return toast.error("Please select a status")
        try {
            const { data } = await axios.put(`${job_service}/api/job/update/${applicationId}`, { status: value }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success("Application updated successfully")
            fetchJobApplications();
        } catch (error: any) {
            console.log(error);
            toast.error("Something went wrong");
        }
    }
    return (
        <div className='min-h-screen bg-secondary/30'>

            {loading ? <Loading /> : <>

                {
                    job && <div className='max-w-5xl mx-auto px-4 py-8'>

                        <Button variant={"ghost"} className='mb-6 gap-2' onClick={() => router.back()}>
                            <ArrowLeft size={18} /> Back to jobs
                        </Button>

                        <Card className='overflow-hidden shadow-lg border-2 mb-6'>
                            <div className='bg-blue-600 p-8 border-b'>
                                <div className='flex items-start justify-between gap-4 flex-wrap'>
                                    <div className='flex-1 text-white'>
                                        <div className='flex items-center gap-3 mb-3'>
                                            <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${job.is_active ? "bg-green-100 dark:bg-green-900/30 text-green-500" : "bg-red-100  dark:bg-red-900/30 text-red-600"}`}>
                                                {job.is_active ? "Open" : "Closed"}
                                            </span>
                                        </div>

                                        <h1 className='text-3xl md:text-4xl font-bold mb-4'
                                        >
                                            {job.title}
                                        </h1>
                                        <div className='flex items-center gap--2 text-base opacity-70 mb-2'>
                                            <Building2 size={18} />
                                            <span>Company Name</span>
                                        </div>
                                    </div>

                                    {
                                        user && user.role === "jobseeker" && <div className='shrink-0'>
                                            {
                                                applied ? <>
                                                    <div className='flex items-center gap-2 px-6 py-6 rounded-lg bg-green-100 dark:bg-gray-900/30 text-green-600 font-medium'>
                                                        <CheckCircle2 size={20} /> Already Applied
                                                    </div>
                                                </> : <>
                                                    {
                                                        job.is_active && <Button onClick={() => applyJobHandler(job.job_id)} disabled={btnLoading} className='gap-2 h-12 px-8'>

                                                            <Briefcase size={18} />
                                                            {btnLoading ? "Applying" : "Easy Apply"}

                                                        </Button>
                                                    }
                                                </>
                                            }
                                        </div>
                                    }
                                </div>
                            </div>

                            {/* details */}
                            <div className='p-8'>
                                <div className='grid md:grid-cols-3 gap-6 mb-8'>
                                    <div className='flex items-center gap-3 p-4 rounded-lg border bg-background'>
                                        <div className='h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0'>
                                            <MapPin size={20} className='text-blue-600' />
                                        </div>
                                        <div>
                                            <p className='text-xs opacity-70 font-medium mb-1'>Location</p>
                                            <p className='font-semibold'>{job.location}</p>
                                        </div>
                                    </div>

                                    <div className='flex items-center gap-3 p-4 rounded-lg border bg-background'>
                                        <div className='h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0'>
                                            <MapPin size={20} className='text-blue-600' />
                                        </div>
                                        <div>
                                            <p className='text-xs opacity-70 font-medium mb-1'>Salary</p>
                                            <p className='font-semibold'>${job.salary} P.A.</p>
                                        </div>
                                    </div>

                                    <div className='flex items-center gap-3 p-4 rounded-lg border bg-background'>
                                        <div className='h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0'>
                                            <MapPin size={20} className='text-blue-600' />
                                        </div>
                                        <div>
                                            <p className='text-xs opacity-70 font-medium mb-1'>Openings</p>
                                            <p className='font-semibold'>{job.openings}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* description */}
                                <div className='space-y-4'>
                                    <h2 className='text-2xl font-bold flex items-center gap-2'><Briefcase size={24} className='text-blue-600' />Job Description</h2>
                                    <div className='p-6 rounded-lg bg-secondary border'>
                                        <p className='text-base loading-relaxed whitespace-pre-line'>{job.description}</p>
                                    </div>
                                </div>

                            </div>
                        </Card>
                    </div>
                }
            </>}

            {user && user.user_id === job?.posted_by_recruiter_id && (
                <div className='max-w-5xl mx-auto px-4 pb-12'>
                    <div className='flex items-center justify-between mb-6 flex-wrap gap-4 bg-background p-4 rounded-lg border shadow-sm'>
                        <h2 className='text-2xl font-bold flex items-center gap-2'>
                            <CheckCircle2 size={24} className='text-blue-600' /> All Applications
                        </h2>
                        <div className='flex items-center gap-3'>
                            <label htmlFor='filter-status' className='text-sm font-medium'>
                                Filter Status:
                            </label>
                            <select id='filter-status' value={filterStatus} onChange={e => setfilterStatus(e.target.value)} className='p-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-blue-500'>
                                <option value="">All Status</option>
                                <option value="Submitted">Submitted</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Hired">Hired</option>
                            </select>
                        </div>
                    </div>

                    {jobApplications && jobApplications.length > 0 ? (
                        <>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                {filteredApplications?.map(e => (
                                    <Card key={e.application_id} className='overflow-hidden shadow-sm hover:shadow-md transition-shadow border-2'>
                                        <div className='p-5'>
                                            <div className='flex items-start justify-between mb-4'>
                                                <div>
                                                    <h3 className='font-semibold text-lg mb-2'>Application #{e.application_id}</h3>
                                                    <div className='flex gap-4 text-sm'>
                                                        <Link target='_blank' href={`/account/${e.applicant_id}`} className='text-blue-600 hover:text-blue-800 font-medium hover:underline flex items-center gap-1'>
                                                            User Profile
                                                        </Link>
                                                        <span className='text-muted-foreground'>|</span>
                                                        <Link target='_blank' href={e.resume} className='text-blue-600 hover:text-blue-800 font-medium hover:underline flex items-center gap-1'>
                                                            View Resume
                                                        </Link>
                                                    </div>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${e.status === 'Hired' ? 'bg-green-100 text-green-700 dark:bg-green-900/40' :
                                                        e.status === 'Rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/40' :
                                                            'bg-blue-100 text-blue-700 dark:bg-blue-900/40'
                                                    }`}>
                                                    {e.status}
                                                </span>
                                            </div>

                                            <div className='pt-4 border-t mt-2 flex items-center gap-3'>
                                                <select
                                                    defaultValue={""}
                                                    onChange={evt => setValue(evt.target.value)}
                                                    className='flex-1 p-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                                                >
                                                    <option value="" disabled>Change Status...</option>
                                                    <option value="Submitted">Submitted</option>
                                                    <option value="Rejected">Rejected</option>
                                                    <option value="Hired">Hired</option>
                                                </select>
                                                <Button onClick={() => updateApplicationHandler(e.application_id)} variant="default" size="sm" className='px-4'>
                                                    Update
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                            {filteredApplications?.length === 0 && (
                                <div className='text-center py-12 bg-background rounded-lg border border-dashed border-gray-300 dark:border-gray-700'>
                                    <p className='text-muted-foreground font-medium'>No applications match the selected filter.</p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className='text-center py-12 bg-background rounded-lg border border-dashed border-gray-300 dark:border-gray-700'>
                            <p className='text-muted-foreground font-medium'>No applications received yet.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default JobPage