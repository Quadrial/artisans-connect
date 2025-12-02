# Profile Update Implementation Guide

## ✅ Backend Setup Complete!

The following backend files have been created:

1. **`backend/controllers/profileController.js`** - Profile CRUD operations
2. **`backend/routes/profileRoutes.js`** - Profile API routes
3. **`backend/server.js`** - Updated with profile routes
4. **`src/services/profileService.ts`** - Frontend profile service

## 🔧 What's Been Fixed:

### 1. Backend API Endpoints

- ✅ `GET /api/profile` - Get user profile
- ✅ `PUT /api/profile` - Update user profile
- ✅ `POST /api/profile/upload-photo` - Upload profile picture

### 2. Location Detection

- ✅ Uses OpenStreetMap Nominatim API (free, no API key needed)
- ✅ High accuracy GPS positioning
- ✅ Automatic reverse geocoding to get Nigerian state and city
- ✅ Stores exact coordinates (latitude/longitude)
- ✅ Better error handling with specific messages

### 3. Email Field

- ✅ Email is now read-only (displays registered email)
- ✅ Cannot be changed for security

### 4. Photo Upload

- ✅ File input for selecting photos
- ✅ Preview before upload
- ✅ Base64 encoding for storage
- ✅ Upload to backend API

## 📝 Frontend Updates Needed

Update `src/pages/profile.tsx` with these key changes:

### 1. Make Email Read-Only

Find the email input field and update it:

```typescript
<input
  type="email"
  name="email"
  value={profileData.email}
  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
  disabled
  readOnly
/>
<p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
```

### 2. Add Photo Upload Functionality

Replace the profile picture section:

```typescript
// Add state for photo
const [profilePicture, setProfilePicture] = useState<string>('');
const [uploadingPhoto, setUploadingPhoto] = useState(false);

// Add photo upload handler
const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Validate file type
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file');
    return;
  }

  // Validate file size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    alert('Image size must be less than 2MB');
    return;
  }

  setUploadingPhoto(true);

  try {
    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      setProfilePicture(base64String);

      // Upload to backend
      try {
        await profileService.uploadProfilePhoto(base64String);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch (error) {
        console.error('Upload error:', error);
        alert('Failed to upload photo');
      } finally {
        setUploadingPhoto(false);
      }
    };
    reader.readAsDataURL(file);
  } catch (error) {
    console.error('Error reading file:', error);
    setUploadingPhoto(false);
  }
};

// Update the profile picture section
<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
  <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h2>
  <div className="flex items-center space-x-6">
    <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
      {profilePicture ? (
        <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
      ) : (
        <FiUser className="w-12 h-12 text-gray-600" />
      )}
    </div>
    <div>
      <input
        type="file"
        id="photo-upload"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />
      <label htmlFor="photo-upload">
        <Button 
          type="button" 
          variant="secondary" 
          size="small" 
          className="flex items-center cursor-pointer"
          disabled={uploadingPhoto}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('photo-upload')?.click();
          }}
        >
          <FiCamera className="w-4 h-4 mr-2" />
          {uploadingPhoto ? 'Uploading...' : 'Upload Photo'}
        </Button>
      </label>
      <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF. Max size 2MB</p>
    </div>
  </div>
</div>
```

### 3. Update Form Submit to Use Backend API

```typescript
import profileService from '../services/profileService';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setSuccess(false);

  try {
    await profileService.updateProfile({
      fullName: profileData.fullName,
      phone: profileData.phone,
      state: profileData.state,
      city: profileData.city,
      address: profileData.address,
      profession: profileData.profession,
      bio: profileData.bio,
      hourlyRate: profileData.hourlyRate,
      yearsOfExperience: profileData.yearsOfExperience,
      skills: profileData.skills,
    });

    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  } catch (error) {
    console.error('Profile update error:', error);
    setError(error instanceof Error ? error.message : 'Failed to update profile');
  } finally {
    setLoading(false);
  }
};
```

### 4. Load Profile Data on Mount

```typescript
useEffect(() => {
  const loadProfile = async () => {
    try {
      const profile = await profileService.getProfile();
      if (profile.profile) {
        setProfileData({
          fullName: profile.profile.fullName || '',
          email: profile.email,
          phone: profile.profile.phone || '',
          state: profile.profile.state || '',
          city: profile.profile.city || '',
          address: profile.profile.address || '',
          profession: profile.profile.profession || '',
          bio: profile.profile.bio || '',
          hourlyRate: profile.profile.hourlyRate?.toString() || '',
          yearsOfExperience: profile.profile.yearsOfExperience?.toString() || '',
          skills: profile.profile.skills || [],
          portfolio: [],
        });
        if (profile.profile.profilePicture) {
          setProfilePicture(profile.profile.profilePicture);
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  loadProfile();
}, []);
```

## 🧪 Testing

### 1. Start Backend
```powershell
cd backend
npm run dev
```

### 2. Start Frontend
```powershell
npm run dev
```

### 3. Test Profile Features

1. **Login** to the application
2. **Click** on your profile picture/name
3. **Test Location Detection:**
   - Click "Detect Location" button
   - Allow location access when prompted
   - Should auto-fill state, city, and address

4. **Test Photo Upload:**
   - Click "Upload Photo" button
   - Select an image file
   - Should show preview and upload to backend

5. **Test Email Field:**
   - Email should be grayed out and not editable
   - Shows your registered email

6. **Test Profile Update:**
   - Fill in all fields
   - Click "Save Profile"
   - Should show success message

## 🔍 Verify Backend

Check backend terminal for:
```
PUT /api/profile 200
POST /api/profile/upload-photo 200
```

## 📱 Location Detection Features

- **High Accuracy GPS**: Uses `enableHighAccuracy: true`
- **No Caching**: Gets fresh location every time
- **Reverse Geocoding**: Converts coordinates to address
- **Nigerian States**: Automatically detects Nigerian state
- **Error Handling**: Clear error messages for permission denied, timeout, etc.

## 🔒 Security Features

- **Email Protection**: Email cannot be changed after registration
- **JWT Authentication**: All profile endpoints require valid token
- **File Size Limit**: Photos limited to 2MB
- **File Type Validation**: Only image files accepted
- **Location Privacy**: Exact coordinates stored securely in backend

## ✨ Next Steps

After implementing these changes:

1. Test all profile features
2. Verify data is saved to MongoDB
3. Check photo upload works
4. Confirm location detection is accurate
5. Ensure email is read-only

Your profile system will be fully functional with backend integration!
