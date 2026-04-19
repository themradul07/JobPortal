"use client"
import { user_service } from '@/context/AppContext';
import { User } from '@/lib/type';
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import Loading from '@/components/loading';
import Info from '../(components)/info';
import Skills from '../(components)/skills';
import Company from '../(components)/company';
import { AppliedJobs } from '../(components)/appliedJobs';

const UserAccountPage = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const fetchUser = async () => {
        const token = Cookies.get("token");
        setLoading(true);

        try {
            const response = await axios.get(`${user_service}/api/user/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUser(response.data.user);
        } catch (error: any) {
            console.log(error);
            toast.error(error.response.data.message);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchUser();
    }, [id]);

    if (loading) {
        return <Loading />
    }

    return (
        <>
            {user &&
                <div className='w-[90%] md:w-[60%] m-auto'>
                    <Info user={user} isYourAccount={false} />
                    {
                        user.role === "jobseeker" && <>
                        <Skills user={user} isYourAccount={false} />
                        </>
                    }
                  
                   
                    {
                        user.role === "recruiter" && <Company user={user} isYourAccount={false} />
                    }
                </div>
            }
        </>
    )
}

export default UserAccountPage