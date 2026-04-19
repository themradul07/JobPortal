"use client"
import Loading from '@/components/loading';
import { useAppData } from '@/context/AppContext'
import React, { useEffect } from 'react'
import Info from './(components)/info';
import Skills from './(components)/skills';
import Company from './(components)/company';
import { useRouter } from 'next/navigation';
import { AppliedJobs } from './(components)/appliedJobs';

const AccountPage = () => {
    const { isAuth, user, loading , applications} = useAppData();
    if (loading) {
        return <Loading />
    }
    const router = useRouter();

    useEffect(()=>{
        if(!isAuth && !loading){
            router.push("/login")
        }
    }, [isAuth, router, loading])

    return (
        <>
        {loading? <Loading/>
            :<>
            {
                user && <>

                <div className='w-[90%] md:w-[60%] m-auto'>
                    <Info user={user} isYourAccount={true} />
                    {
                        user.role === "jobseeker" && <>
                        <Skills user={user} isYourAccount={true} />
                        <AppliedJobs applications={applications || []}/>
                        </>
                    }
                    {
                        user.role === "recruiter" && <Company user={user} isYourAccount={true} />
                    }
                </div>
                </>
            }
        </>
}
</>
    )
}

export default AccountPage
