"use client";

import React from 'react'
import { useAuth } from '@/providers/auth-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { User, Mail, Shield, UserCircle } from 'lucide-react'
import { EditProfileDialog } from '@/components/userDashboard/edit-profile-dialog'
import { ChangePasswordDialog } from '@/components/userDashboard/change-password-dialog'

export default function ProfilePage() {
    const { user, loading, refreshUser } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <p className="text-muted-foreground">User not found. Please log in again.</p>
                <Button onClick={() => window.location.href = '/signin'}>Go to Login</Button>
            </div>
        )
    }

    const initials = user.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
        : 'U';

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold border-4 border-background shadow-lg ring-1 ring-primary/20">
                    {initials}
                </div>
                <div className="text-center md:text-left space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
                    <p className="text-muted-foreground">{user.email}</p>
                    <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
                            {user.role}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-500/10 text-green-600 border border-green-500/20">
                            Active
                        </span>
                    </div>
                </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Information */}
                <Card className="md:col-span-2 shadow-sm border-muted/60">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <User className="h-5 w-5 text-primary" />
                            Personal Information
                        </CardTitle>
                        <CardDescription>
                            Your basic account information and details.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                                <div className="relative">
                                    <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input id="name" value={user.name} readOnly className="pl-9 bg-muted/30 focus-visible:ring-0 border-muted-foreground/20" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input id="email" value={user.email} readOnly className="pl-9 bg-muted/30 focus-visible:ring-0 border-muted-foreground/20" />
                                </div>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-muted/60 flex justify-end">
                            <EditProfileDialog user={user} onUpdate={refreshUser} />
                        </div>
                    </CardContent>
                </Card>

                {/* Account Settings */}
                <Card className="shadow-sm border-muted/60 h-fit">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Shield className="h-5 w-5 text-primary" />
                            Security
                        </CardTitle>
                        <CardDescription>
                            Privacy and security controls.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <Label className="text-sm font-medium">Account Role</Label>
                            <div className="flex items-center gap-3 p-3 rounded-lg border border-primary/10 bg-primary/5">
                                <Shield className="h-5 w-5 text-primary" />
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold uppercase tracking-wide">{user.role}</span>
                                    <span className="text-[10px] text-muted-foreground leading-none">Full access to your personal dashboard</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3 pt-2">
                            <ChangePasswordDialog />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
