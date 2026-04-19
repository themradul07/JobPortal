import React from "react";

export interface JobOptions{
    title: string;
    responsibilites: string;
    why: string;
}

export interface skillsToLearn{
    title : string;
    why: string;
    how: string;
}

export interface skillCategory{
    category: string;
    skills: skillsToLearn[];    
}

export interface LearningApproach{
    title : string;
    points: string[];
}

export interface CareerGuidanceResponse{
    summary: string;
    jobOptions: JobOptions[];
    skillsToLearn: skillCategory[];
    learningApproach: LearningApproach;
}

export interface ScoreBreakdown{
    formatting:{score: number; feedback: string};
    keywords:{score: number; feedback:string};
    structure:{score: number; feedback: string};
    readability:{score: number; feedback: string};        
}

export interface Suggestion{
    category: string;
    issue: string;
    recommendation: string;
    priority: "high"|"medium"|"low";
}

export interface ResumeAnalysisResponse{
    atsScore:number;
    scoreBreakdown: ScoreBreakdown;
    suggestions: Suggestion[];
    strengths: string[];
    summary: string;
}

export interface User{
    user_id: number;
    name: string;
    email: string;
    phone_number: string;
    role: "jobseeker"|"recruiter";
    bio: string|null;
    resume: string|null;
    resume_public_id: string|null;
    profile_pic: string|null;
    profile_pic_public_id: string|null;
    skills: string[];
    subscription: string|null;
    applications?:Application[]|null;
}

export interface AppContextType{
    user: User| null;
    loading: boolean;
    btnLoading: boolean;
    isAuth: boolean;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setBtnLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
    logoutUser: () => Promise<void>;
    updateProfileHandler: (formData: any) => Promise<void>;
    updateResumeHandler: (formData: any) => Promise<void>;
    updateUser:(name:string, bio:string, phone_number:string)=> Promise<void>;
    addSkill: (skill: string) => Promise<void>;
    removeSkill: (skill: string) => Promise<void>;
    applyJob : (job_id: number)=> Promise<void>;
    applications : Application[]|null;
    fetchApplications: (skill: string) => Promise<void>;
    fetchUser: ()=>Promise<void>;
}
export interface AppProviderProps{
    children: React.ReactNode;
}

export interface AccountProps {
    user:User;
    isYourAccount: boolean;
}

export interface Company {
    company_id: number;
    name: string;
    description: string;
    logo: string;
    logo_public_id: string;
    website: string;
    recruiter_id: number;
    created_at: string;
    jobs:Job[]|null;
}

export interface Job{
    job_id: number;
    title: string;
    description: string;
    salary: number|null;
    location: string|null;
    job_type: 'Full-time'|'Part-time'|'Contract'|'Temporary'|'Internship'|'Other';
    openings: number;
    role: string;
    work_location:"On-site"|"Remote"|"Hybrid";
    company_id: number;
    company_name: string;
    company_logo: string;
    posted_by_recruiter_id:number;
    created_at:string;
    is_active: boolean

}

type ApplicationStatus = 'Submitted'|'Rejected'|'Hired';

export interface Application {
    application_id : number;
    job_id: number;
    applicant_id: number;
    applicant_email:string;
    status:ApplicationStatus;
    resume: string;
    applied_at: string;
    subscribed: boolean;
    job_title: string;
    job_salary: string;
    job_location: string;
}


