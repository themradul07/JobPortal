import { useAppData } from '@/context/AppContext'
import { Job } from '@/lib/type'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from './ui/card'
import { ArrowRight, Briefcase, Building2, CheckCircle, DollarSign, MapPin } from 'lucide-react'
import Link from 'next/link'
import { Button } from './ui/button'

interface JobCardProps {
  job: Job
}

const JobCard = ({ job }: JobCardProps) => {
  const { user, btnLoading, applyJob, applications } = useAppData();
  const [applied, setApplied] = useState(false)

  const applyJobHandler = (id: number) => {
    applyJob(id);
  }

  useEffect(() => {
    if (applications && job.job_id) {
      applications.forEach((item: any) => {
        if (item.job_id === job.job_id) setApplied(true)
      })
    }
  }, [applications, job.job_id])

  return (
    <Card className='w-full max-w-[380px] hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 border-2 hover:border-blue-500 group bg-card flex flex-col'>
      <CardHeader className='space-y-4 pb-4'>
        <div className='flex items-start gap-4'>
          <Link href={`/company/${job.company_id}`} className='shrink-0 z-10'>
            <div className='w-14 h-14 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden hover:scale-105 transition-transform flex items-center justify-center p-1.5'>
              <img src={job.company_logo} className='w-full h-full object-contain rounded-lg' alt={`${job.company_name} logo`} />
            </div>
          </Link>

          <div className='flex-1 min-w-0 pt-1'>
            <h3 className='text-lg font-bold line-clamp-1 group-hover:text-blue-600 transition-colors' title={job.title}>
              {job.title}
            </h3>
            <div className='flex items-center gap-1.5 text-sm text-muted-foreground mt-1'>
              <Building2 size={14} className="shrink-0" />
              <span className='truncate font-medium'>{job.company_name}</span>
            </div>
          </div>
        </div>

        <div className='flex items-center gap-2 flex-wrap pt-2'>
          <div className='flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-50/80 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 text-xs font-semibold'>
            <MapPin size={14} /> <span className="truncate max-w-[120px]">{job.location}</span>
          </div>
          <div className='flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-50/80 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 text-xs font-semibold'>
            <DollarSign size={14} /> <span>${job.salary} P.A</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className='flex flex-col gap-3 pt-4 border-t mt-auto'>
        <div className='flex w-full gap-3'>
          <Link href={`/jobs/${job.job_id}`} className='flex-1'>
            <Button variant="outline" className='w-full gap-2 group/btn hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 dark:hover:bg-blue-900/20 font-medium'>
              Details <ArrowRight size={16} className='group-hover/btn:translate-x-1 transition-transform' />
            </Button>
          </Link>
          {user && user.role === "jobseeker" && (
            applied ? (
              <div className='flex-1 flex items-center justify-center gap-2 text-emerald-700 font-semibold text-sm bg-emerald-50 border border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-900/30 dark:text-emerald-400 rounded-md px-3 py-2'>
                <CheckCircle size={16} /> Applied
              </div>
            ) : (
              job.is_active !== false && (
                <Button onClick={() => applyJobHandler(job.job_id)} disabled={btnLoading} className='flex-1 gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium'>
                  <Briefcase size={16} /> Apply
                </Button>
              )
            )
          )}
        </div>
        {job.is_active === false && (
          <div className='w-full text-center text-sm text-red-600 bg-red-50 border border-red-100 dark:bg-red-900/20 dark:border-red-900/30 rounded-md px-3 py-2 font-semibold flex items-center justify-center gap-2'>
             Position Closed
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default JobCard