"use client"
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAppData } from '@/context/AppContext';
import { AccountProps } from '@/lib/type'
import { Award, Divide, Plus, Sparkle, X } from 'lucide-react';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

const Skills = ({ user, isYourAccount }: AccountProps) => {
    const { addSkill, btnLoading , removeSkill} = useAppData();
    const [skill, setSkill] = useState("");
    const addskillHandler = () => {
        if (!skill.trim()) {
            toast.error("Please enter a skill");
            return;
        }
        addSkill(skill);
        setSkill("");
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            addskillHandler();
        }
    }

    const removeSkillHandler = (skillToRemove: string) => {
        if (confirm("Are you sure you want to remove this skill?")) {
            removeSkill(skillToRemove);

        }
    }
    return (
        <div className='max-w-5xl mx-auto px-4 py-6'>
            <Card className='shadow-lg border-2 overflow-hidden'>
                <div className='bg-blue-500 p-6 border-b'>
                    <div className='flex items-baseline  gap-3 mb-4'>
                        <div className='h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center'>
                            <Award size={20} className='text-blue-600' />
                        </div>
                    <CardTitle className='text-2xl font-bold text-white'>{isYourAccount ? "Your Skills" : "User Skills"}</CardTitle>
                    {isYourAccount && <CardDescription className='text-blue-100'>Add or remove skills to tailor your profile</CardDescription>}
                    </div>
                </div>

                {/* Skill Input */}
                {isYourAccount && 
                    <div className='flex gap-3 flex-col sm:flex-row mx-3 '>
                        <div className='relative flex-1'>
                            <Sparkle size={18} className='absolute left-3 top-1/2 -translate-y-1/2 opacity-50'/>
                            <Input
                                type='text'
                                placeholder='e.g. React, Node.js, Python...'
                                className='h-11 pl-10 bg-background'
                                value={skill}
                                onChange={(e)=>setSkill(e.target.value)}
                                onKeyDown={handleKeyPress}
                            />
                        </div>
                            <Button
                                onClick={addskillHandler}
                                disabled={!skill.trim()}
                                className='h-11  px-6 bg-blue-600 hover:bg-blue-700 text-white'
                            >
                                <Plus size={18}/>
                                {btnLoading ? "Adding..." : "Add"}
                            </Button>
                    </div>}

                    <CardContent className='p-6'>
                        {user.skills && user.skills.length>0? <div className='flex flex-wrap gap-3'>
                            {user.skills.map((skill, index)=>(
                                <div key={index} className='flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full border border-blue-200 dark:border-blue-800'>
                                   
                                    <span className='text-sm font-medium text-blue-800 dark:text-blue-200'>{skill}</span>
                                    {isYourAccount && (
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-6 w-6 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20"
                                            onClick={() => removeSkillHandler(skill)}
                                        >
                                            <X size={14} />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                        : <div className='text-center py-12'>
                            <div className='h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-4'>
                                <Award size={40} className='text-blue-600'/>
                            </div>
                            <h3 className='text-xl font-semibold text-foreground mb-2'>No skills added yet</h3>
                            {isYourAccount && <p className='text-muted-foreground mb-6'>Get started by adding your skills</p>}
                           
                        </div>}
                    </CardContent>

            </Card>

        </div>
    )
}

export default Skills