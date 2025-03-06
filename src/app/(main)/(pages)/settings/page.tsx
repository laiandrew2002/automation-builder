'use client';

import ProfileForm from '@/components/forms/profile-form'
import React from 'react'
import ProfilePicture from './_components/profile-picture'
// import { db } from '@/lib/db'
import { useUser } from '@clerk/nextjs'
import { useGetUser } from '@/features/user/api/use-get-user'
import { Loader2 } from 'lucide-react';
import { useRemoveProfileImage } from '@/features/user/api/use-remove-profile-image';
import { useUserUploadProfileImage } from '@/features/user/api/use-upload-profile-image';
import { useUpdateUserProfile } from '@/features/user/api/use-update-user-profile';

const Settings = () => {
  const { user: userClerk } = useUser();

  const userQuery = useGetUser(userClerk?.id || '');
  const userImageRemoveMutation = useRemoveProfileImage(userClerk?.id || '');
  const userImageUploadMutation = useUserUploadProfileImage(userClerk?.id || '');
  const userUpdateMutation = useUpdateUserProfile(userClerk?.id || '');
  const user = userQuery.data;

  const isLoading = userQuery.isPending || userQuery.isLoading;
  
  const removeProfileImage = async () => {
    userImageRemoveMutation.mutate();
  }

  const uploadProfileImage = async (image: string) => {
    userImageUploadMutation.mutate(image);
  }

  const updateUserInfo = async (name: string) => {
    userUpdateMutation.mutate(name);
  }

  if (isLoading) return <div><Loader2 className="mr-2 h-4 w-4 animate-spin" /></div>


  return (
    <div className="flex flex-col gap-4">
      <h1 className="sticky top-0 z-[10] flex items-center justify-between border-b bg-background/50 p-6 text-4xl backdrop-blur-lg">
        <span>Settings</span>
      </h1>
      <div className="flex flex-col gap-10 p-6">
        <div>
          <h2 className="text-2xl font-bold">User Profile</h2>
          <p className="text-base text-white/50">
            Add or update your information
          </p>
        </div>
        <ProfilePicture
          onDelete={removeProfileImage}
          userImage={user?.profileImage || ''}
          onUpload={uploadProfileImage}
        />
        <ProfileForm
          user={user}
          onUpdate={updateUserInfo}
        />
      </div>
    </div>
  )
}

export default Settings