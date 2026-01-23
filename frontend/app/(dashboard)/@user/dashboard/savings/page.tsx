"use client"
import React from 'react'

import { format } from "date-fns"
import { ChevronDownIcon } from "lucide-react"
import {
    Dialog,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog"
import { CirclePlus } from 'lucide-react'
import AddGoalPopup from '@/components/savingsPage/addGoalPopup'
import SavingsSummery from '@/components/savingsPage/savingsSummery'
export default function Savings() {



    return (

        <div>
            <div className='flex justify-between mb-10'>
                <div>
                    <h1 className='text-4xl font-medium'>Saving Overview</h1>
                    <p>Track your progress and reach your financial milestones.</p>
                </div>
                <div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-5 rounded-lg flex items-center gap-2 transition-all shadow-sm">
                                <CirclePlus className=" h-8 w-8" />
                                Create New Goal
                            </button>
                        </DialogTrigger>
                        <AddGoalPopup />
                    </Dialog>
                </div>
            </div>
            <SavingsSummery />
        </div>
    )
}
