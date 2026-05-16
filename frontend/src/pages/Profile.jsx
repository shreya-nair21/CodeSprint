import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { 
  User as UserIcon, 
  MapPin, 
  Globe, 
  Briefcase,
  Edit2,
  Save,
  X,
  Loader2,
  Check,
  Calendar,
  Link,
  Code,
  Trash2,
  Camera
} from 'lucide-react';

const Profile = () => {
  const { user, updateUserData } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    bio: user?.bio || '',
    location: user?.location || '',
    company: user?.company || '',
    website: user?.website || '',
    profilePic: user?.profilePic || '',
    birthday: user?.birthday ? new Date(user.birthday).toISOString().split('T')[0] : '',
    linkedin: user?.linkedin || '',
    github: user?.github || ''
  });

  useEffect(() => {
    if (user && !isEditing) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
        bio: user.bio || '',
        location: user.location || '',
        company: user.company || '',
        website: user.website || '',
        profilePic: user.profilePic || '',
        birthday: user.birthday ? new Date(user.birthday).toISOString().split('T')[0] : '',
        linkedin: user.linkedin || '',
        github: user.github || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setFormData({ ...formData, profilePic: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.put('/auth/profile', formData);
      updateUserData(response.data);
      setIsEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Make sure image is not too large.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-surface rounded-2xl border border-border-color shadow-sm p-6 md:p-10 w-full">
        
        {/* Top Action Bar (In-Flow, No Overlap) */}
        <div className="flex justify-end w-full mb-4">
          <div className="flex items-center gap-3">
            {success && (
              <span className="text-sm font-semibold text-accent flex items-center gap-1 bg-accent/10 px-3 py-1.5 rounded-lg">
                <Check size={16} /> Saved
              </span>
            )}

            {!isEditing ? (
              <button 
                type="button" 
                onClick={() => setIsEditing(true)} 
                className="btn-secondary flex items-center gap-2 px-4 py-2 rounded-lg"
              >
                <Edit2 size={16} /> Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)} 
                  className="btn-secondary flex items-center gap-2 px-4 py-2 rounded-lg"
                >
                  <X size={16} /> Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Centered Profile Header */}
        <div className="flex flex-col items-center text-center w-full">
          
          {/* Avatar - Strictly Sized */}
          <div 
            className="w-32 h-32 shrink-0 flex-none rounded-2xl border border-border-color shadow-sm bg-surface-hover flex items-center justify-center overflow-hidden mb-4"
            style={{ minWidth: '128px', minHeight: '128px', maxWidth: '128px', maxHeight: '128px', borderRadius: '16px' }}
          >
            {formData.profilePic ? (
              <img 
                src={formData.profilePic} 
                alt="Profile" 
                className="w-full h-full object-cover block" 
                style={{ borderRadius: '16px' }}
              />
            ) : (
              <UserIcon size={56} className="text-muted opacity-50" />
            )}
          </div>

          {/* Photo Actions */}
          {isEditing && (
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
              />
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()} 
                className="btn-secondary text-sm flex items-center gap-2 rounded-lg py-1.5 px-3"
              >
                <Camera size={14} /> Change
              </button>
              {formData.profilePic && (
                <button 
                  type="button" 
                  onClick={handleRemovePhoto} 
                  className="btn-secondary text-danger hover:border-danger hover:bg-danger/10 text-sm flex items-center gap-2 rounded-lg py-1.5 px-3"
                >
                  <Trash2 size={14} /> Remove
                </button>
              )}
            </div>
          )}

          {/* User Text Info */}
          {isEditing ? (
            <div className="w-full max-w-xl space-y-4 text-left mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted font-bold uppercase tracking-wider mb-1 block">Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-surface-hover border border-border-color rounded-xl px-4 py-2 text-main text-sm focus:border-primary outline-none transition-colors" placeholder="Name" />
                </div>
                <div>
                  <label className="text-xs text-muted font-bold uppercase tracking-wider mb-1 block">Username</label>
                  <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full bg-surface-hover border border-border-color rounded-xl px-4 py-2 text-main text-sm focus:border-primary outline-none transition-colors" placeholder="Username" required />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted font-bold uppercase tracking-wider mb-1 block">About Me</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full bg-surface-hover rounded-xl p-4 border border-border-color outline-none focus:border-primary transition-colors text-main resize-none h-24 text-sm leading-relaxed"
                  placeholder="Write a short bio about yourself..."
                />
              </div>
            </div>
          ) : (
            <div className="mb-8 w-full max-w-2xl">
              <h1 className="text-3xl font-extrabold text-main">{user?.name || user?.username}</h1>
              <p className="text-muted text-lg font-medium">@{user?.username}</p>
              
              <div className="mt-4 mx-auto">
                {user?.bio ? (
                  <p className="text-main text-[15px] leading-relaxed">{user.bio}</p>
                ) : (
                  <p className="text-muted italic text-[14px]">No bio provided yet.</p>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Divider */}
        <div className="w-full h-px bg-border-color my-4"></div>

        {/* Details Grid */}
        <div className="w-full text-left pt-6">
          <h3 className="text-sm font-bold text-muted uppercase tracking-widest mb-6">Profile Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            {/* Detail Items */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-surface-hover flex items-center justify-center text-muted shrink-0 border border-border-color/50">
                <Briefcase size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-muted font-bold uppercase tracking-wider mb-0.5">Company</p>
                {isEditing ? (
                  <input type="text" name="company" value={formData.company} onChange={handleChange} className="w-full bg-surface-hover border border-border-color rounded-lg px-3 py-1.5 text-sm text-main focus:border-primary outline-none" placeholder="Company" />
                ) : (
                  <p className="text-[14px] text-main font-semibold truncate">{user?.company || '---'}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-surface-hover flex items-center justify-center text-muted shrink-0 border border-border-color/50">
                <MapPin size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-muted font-bold uppercase tracking-wider mb-0.5">Location</p>
                {isEditing ? (
                  <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full bg-surface-hover border border-border-color rounded-lg px-3 py-1.5 text-sm text-main focus:border-primary outline-none" placeholder="Location" />
                ) : (
                  <p className="text-[14px] text-main font-semibold truncate">{user?.location || '---'}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-surface-hover flex items-center justify-center text-muted shrink-0 border border-border-color/50">
                <Calendar size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-muted font-bold uppercase tracking-wider mb-0.5">Birthday</p>
                {isEditing ? (
                  <input type="date" name="birthday" value={formData.birthday} onChange={handleChange} className="w-full bg-surface-hover border border-border-color rounded-lg px-3 py-1.5 text-sm text-main focus:border-primary outline-none" />
                ) : (
                  <p className="text-[14px] text-main font-semibold truncate">{user?.birthday ? new Date(user.birthday).toLocaleDateString() : '---'}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-surface-hover flex items-center justify-center text-muted shrink-0 border border-border-color/50">
                <Globe size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-muted font-bold uppercase tracking-wider mb-0.5">Website</p>
                {isEditing ? (
                  <input type="text" name="website" value={formData.website} onChange={handleChange} className="w-full bg-surface-hover border border-border-color rounded-lg px-3 py-1.5 text-sm text-main focus:border-primary outline-none" placeholder="https://" />
                ) : (
                  user?.website ? <a href={user.website.startsWith('http') ? user.website : `https://${user.website}`} target="_blank" rel="noopener noreferrer" className="text-[14px] text-primary hover:underline font-semibold truncate block">{user.website}</a> : <p className="text-[14px] text-main font-semibold">---</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-surface-hover flex items-center justify-center text-muted shrink-0 border border-border-color/50">
                <Code size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-muted font-bold uppercase tracking-wider mb-0.5">GitHub</p>
                {isEditing ? (
                  <input type="text" name="github" value={formData.github} onChange={handleChange} className="w-full bg-surface-hover border border-border-color rounded-lg px-3 py-1.5 text-sm text-main focus:border-primary outline-none" placeholder="Username or URL" />
                ) : (
                  user?.github ? <a href={user.github.includes('http') ? user.github : `https://github.com/${user.github}`} target="_blank" rel="noopener noreferrer" className="text-[14px] text-primary hover:underline font-semibold truncate block">{user.github}</a> : <p className="text-[14px] text-main font-semibold">---</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-surface-hover flex items-center justify-center text-muted shrink-0 border border-border-color/50">
                <Link size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-muted font-bold uppercase tracking-wider mb-0.5">LinkedIn</p>
                {isEditing ? (
                  <input type="text" name="linkedin" value={formData.linkedin} onChange={handleChange} className="w-full bg-surface-hover border border-border-color rounded-lg px-3 py-1.5 text-sm text-main focus:border-primary outline-none" placeholder="LinkedIn URL" />
                ) : (
                  user?.linkedin ? <a href={user.linkedin.includes('http') ? user.linkedin : `https://linkedin.com/in/${user.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-[14px] text-primary hover:underline font-semibold truncate block">{user.linkedin}</a> : <p className="text-[14px] text-main font-semibold">---</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;
