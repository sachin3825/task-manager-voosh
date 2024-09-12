import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetProfileQuery, useUpdateAvatarMutation } from '../store/api';
import { updateUser } from '../store/slices/authSlice';
import InitialsAvatar from 'react-initials-avatar';
import 'react-initials-avatar/lib/ReactInitialsAvatar.css';
import toast from 'react-hot-toast';

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
  const [avatarFile, setAvatarFile] = useState(null);

  const { data: profileData, error, isLoading } = useGetProfileQuery();
  const [updateAvatar, { isLoading: isAvatarUpdating }] = useUpdateAvatarMutation();

  useEffect(() => {
    if (profileData?.data) {
      dispatch(updateUser({ user: profileData.data }));
    }
  }, [profileData, dispatch]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
      setAvatarFile(file);
    }
  };

  // Handle avatar update
  const handleUpdateAvatar = async () => {
    if (!avatarFile) {
      toast.error('Please select an image file');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', avatarFile);

    try {
      const updatedUser = await updateAvatar(formData).unwrap();
      console.log('Updated user:', updatedUser);

      const firstName = updatedUser.firstName || user.firstName;
      const lastName = updatedUser.lastName || user.lastName;

      dispatch(updateUser({ user: { ...updatedUser, firstName, lastName } }));
      setAvatarPreview(updatedUser.avatar || avatarPreview);
      toast.success('Avatar updated successfully!');
    } catch (error) {
      toast.error('Failed to update avatar');
    }
  };

  if (isLoading) return <div>Loading profile...</div>;
  if (error) return <div>Error loading profile</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <div className="flex items-center space-x-6">
        <div className="relative">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt={`${user?.firstName} ${user?.lastName}`}
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
            />
          ) : (
            <InitialsAvatar
              name={`${user?.firstName || 'U'} ${user?.lastName || 'U'}`} // Fall back to initials 'U U'
              className="w-32 h-32 rounded-full bg-blue-500 text-white text-4xl flex items-center justify-center"
            />
          )}
        </div>

        <div className="flex flex-col">
          <h2 className="text-3xl font-bold text-gray-800">
            {`${user?.firstName || 'User'} ${user?.lastName || ''}`}
          </h2>
          <p className="text-lg text-gray-600">{user?.email}</p>

          <div className="mt-4">
            <input
              type="file"
              accept="image/*"
              id="avatarInput"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <label
              htmlFor="avatarInput"
              className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer"
            >
              {avatarPreview ? 'Change Avatar' : 'Upload Avatar'}
            </label>

            {avatarPreview && (
              <button
                onClick={handleUpdateAvatar}
                className="bg-green-500 text-white px-4 py-2 rounded-md ml-4"
                disabled={isAvatarUpdating}
              >
                {isAvatarUpdating ? 'Saving...' : 'Save Avatar'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
