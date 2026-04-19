"use client"
import { AppContextType, Application, AppProviderProps, User } from "@/lib/type";
import { createContext, useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";
import axios from "axios";
import { redirect } from "next/navigation";

export const utils_service = "http://localhost:5001"
export const auth_service = "http://localhost:5000"
export const user_service = "http://localhost:5002"
export const job_service = "http://localhost:5003"
export const payment_service = "http://localhost:5004"

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);
    const [isAuth, setIsAuth] = useState(false);

    async function fetchUser() {
        try {
            setLoading(true);
            const { data } = await axios.get(`${user_service}/api/user/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setUser(data.user);
            setIsAuth(true);
        } catch (error) {
            console.log("this is the error", error)
            console.log(error);
            setIsAuth(false);
        } finally {
            setLoading(false);
        }
    }

    const updateProfileHandler = async (formData: any) => {
        try {
            const { data } = await axios.put(`${user_service}/api/user/update/pic`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success("Profile Updated Successfully");
            fetchUser();
        } catch (e: any) {
            toast.error("Something went wrong");
        }
    };

    const updateUser = async (name: string, phoneNumber: string, bio: string) => {
        try {
            const { data } = await axios.put(`${user_service}/api/user/update/profile`, { name, phoneNumber, bio }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success("Profile Updated Successfully");
            fetchUser();
        } catch (error: any) {
            toast.error(error.response.data.message);

        }
    }

    const updateResumeHandler = async (formData: any) => {
        try {
            const { data } = await axios.put(`${user_service}/api/user/update/resume`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success(data.message);
            fetchUser();
        } catch (e: any) {
            toast.error("Something went wrong");
        }
    };

    async function logoutUser() {
        Cookies.set("token", "", { expires: 0 });
        setUser(null);
        setIsAuth(false);
        toast.success("Logout successfully");
        redirect("/login");
    }

    useEffect(() => {
        fetchUser();
    }, [])

    async function addSkill(skill: string) {
        setBtnLoading(true);
        try {
            const { data } = await axios.put(`${user_service}/api/user/add/skill`, { skillName: skill }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success(data.message);
            fetchUser();
        } catch (error: any) {
            toast.error(error.response.data.message);
        } finally {
            setBtnLoading(false);
        }
    }

    async function removeSkill(skill: string) {
        setBtnLoading(true);
        try {
            const { data } = await axios.put(`${user_service}/api/user/delete/skill`, { skillName: skill }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success(data.message);
            fetchUser();
        } catch (error: any) {
            toast.error(error.response.data.message);
        } finally {
            setBtnLoading(false);
        }
    }

    async function applyJob(job_id: number) {
        setBtnLoading(true);
        try {
            const { data } = await axios.post(`${user_service}/api/user/apply/${job_id}`,
                { job_id }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success(data.message);
            fetchApplications();
        } catch (e: any) {
            console.log(e);
            toast.error(e.response.data.message)
        } finally { setBtnLoading(false) }

    }

    const [applications, setApplications] = useState<Application[] | null>(null);
    async function fetchApplications() {
        try {
            const { data } = await axios.get(`${user_service}/api/user/applications/all`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setApplications(data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchApplications();
    }, [])

    const token = Cookies.get("token");
    return (
        <AppContext.Provider
            value={{
                user,
                loading,
                btnLoading,
                isAuth,
                setUser,
                setLoading,
                setBtnLoading,
                setIsAuth,
                logoutUser,
                updateProfileHandler,
                updateResumeHandler,
                updateUser,
                addSkill,
                removeSkill,
                applyJob,
                fetchApplications,
                applications,
                fetchUser
            }}
        >
            {children}
            <Toaster />
        </AppContext.Provider>
    );
}

export const useAppData = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppData must be used within AppProvider");
    }
    return context;
}