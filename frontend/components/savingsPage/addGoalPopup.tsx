import React from 'react'
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
export default function AddGoalPopup() {
    const [open, setOpen] = React.useState(false)
    const [date, setDate] = React.useState<Date | undefined>(undefined)
    return (
        <div>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>New Savings Goal</DialogTitle>
                    <DialogDescription>
                        Define your financial targets and track your progress effortlessly.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="goal-name">Goal Name</Label>
                        <Input
                            id="goal-name"
                            placeholder="e.g., Emergency Fund, Vacation"
                            type="text"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="target-amount">Target Amount</Label>
                        <Input
                            id="target-amount"
                            placeholder="e.g., 5000"
                            type="number"
                            step="0.01"
                            min="0"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="completion-date">Completion Date</Label>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    id="date"
                                    className="justify-start font-normal"
                                >
                                    {date ? date.toLocaleDateString() : "Select date"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    disabled={(date) => date < new Date()}
                                    defaultMonth={date}
                                    captionLayout="dropdown"
                                    onSelect={(date) => {
                                        setDate(date)
                                        setOpen(false)
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" className="bg-green-600 hover:bg-green-700">Create Goal</Button>
                </DialogFooter>
            </DialogContent>
        </div>
    )
}
