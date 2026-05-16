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
  Trash2,
  Camera,
  Link as LinkIcon,
  Code2,
} from 'lucide-react';

const Profile = () => {
  const { user, updateUserData } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [stats, setStats] = useState(null);

  const fileInputRef = useRef(null);

  const getInitialFormData = () => ({
    name: user?.name || '',
    username: user?.username || '',
    bio: user?.bio || '',
    location: user?.location || '',
    company: user?.company || '',
    website: user?.website || '',
    profilePic: user?.profilePic || '',
    birthday: user?.birthday
      ? new Date(user.birthday).toISOString().split('T')[0]
      : '',
    linkedin: user?.linkedin || '',
    github: user?.github || '',
  });

  const [formData, setFormData] = useState(getInitialFormData);

  useEffect(() => {
    if (user && !isEditing) {
      setFormData(getInitialFormData());
    }
  }, [user, isEditing]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/auth/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch user stats', err);
      }
    };

    if (user) fetchStats();
  }, [user]);

  useEffect(() => {
    if (!success) return;

    const timer = setTimeout(() => {
      setSuccess(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [success]);

  const generateHeatmapDays = (data = []) => {
    const days = [];
    const today = new Date();

    const activityMap = new Map(
      data.map((item) => [item.date, item.count])
    );

    for (let i = 180; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);

      const dateStr = d.toISOString().split('T')[0];

      days.push({
        date: dateStr,
        count: activityMap.get(dateStr) || 0,
      });
    }

    return days;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const formatUrl = (url) => {
    if (!url) return '';

    if (
      url.startsWith('http://') ||
      url.startsWith('https://')
    ) {
      return url;
    }

    return `https://${url}`;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Image size should be less than 2MB');
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        profilePic: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setFormData({
      ...formData,
      profilePic: '',
    });
  };

  const handleCancel = () => {
    setFormData(getInitialFormData());
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await api.put('/auth/profile', formData);

      updateUserData(response.data);

      setIsEditing(false);
      setSuccess(true);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-surface rounded-2xl border border-border-color shadow-sm p-6 md:p-10 w-full"
      >
        {/* Top Action Bar */}
        <div className="flex justify-end w-full mb-4">
          <div className="flex items-center gap-3">
            {success && (
              <span className="text-sm font-semibold text-accent flex items-center gap-1 bg-accent/10 px-3 py-1.5 rounded-lg">
                <Check size={16} />
                Saved
              </span>
            )}

            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="btn-secondary flex items-center gap-2 px-4 py-2 rounded-lg"
              >
                <Edit2 size={16} />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-secondary flex items-center gap-2 px-4 py-2 rounded-lg"
                >
                  <X size={16} />
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg"
                >
                  {loading ? (
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                  ) : (
                    <Save size={16} />
                  )}
                  Save
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col items-center text-center w-full">
          <div
            className="w-32 h-32 shrink-0 flex-none rounded-2xl border border-border-color shadow-sm bg-surface-hover flex items-center justify-center overflow-hidden mb-4"
            style={{
              minWidth: '128px',
              minHeight: '128px',
              maxWidth: '128px',
              maxHeight: '128px',
            }}
          >
            {formData.profilePic ? (
              <img
                src={formData.profilePic}
                alt="Profile"
                className="w-full h-full object-cover block rounded-2xl"
              />
            ) : (
              <UserIcon
                size={56}
                className="text-muted opacity-50"
              />
            )}
          </div>

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
                <Camera size={14} />
                Change
              </button>

              {formData.profilePic && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="btn-secondary text-danger hover:border-danger hover:bg-danger/10 text-sm flex items-center gap-2 rounded-lg py-1.5 px-3"
                >
                  <Trash2 size={14} />
                  Remove
                </button>
              )}
            </div>
          )}

          {isEditing ? (
            <div className="w-full max-w-xl space-y-4 text-left mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted font-bold uppercase tracking-wider mb-1 block">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-surface-hover border border-border-color rounded-xl px-4 py-2 text-main text-sm focus:border-primary outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted font-bold uppercase tracking-wider mb-1 block">
                    Username
                  </label>

                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full bg-surface-hover border border-border-color rounded-xl px-4 py-2 text-main text-sm focus:border-primary outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-muted font-bold uppercase tracking-wider mb-1 block">
                  About Me
                </label>

                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  maxLength={200}
                  className="w-full bg-surface-hover rounded-xl p-4 border border-border-color outline-none focus:border-primary transition-colors text-main resize-none h-24 text-sm leading-relaxed"
                  placeholder="Write a short bio about yourself..."
                />

                <div className="text-right text-xs text-muted mt-1">
                  {formData.bio.length}/200
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-8 w-full max-w-2xl">
              <h1 className="text-3xl font-extrabold text-main">
                {user?.name || user?.username}
              </h1>

              <p className="text-muted text-lg font-medium">
                @{user?.username}
              </p>

              <div className="mt-4 mx-auto">
                {user?.bio ? (
                  <p className="text-main text-[15px] leading-relaxed">
                    {user.bio}
                  </p>
                ) : (
                  <p className="text-muted italic text-[14px]">
                    No bio provided yet.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="w-full h-px bg-border-color my-4"></div>

        {/* Profile Details */}
        <div className="w-full text-left pt-6">
          <h3 className="text-sm font-bold text-muted uppercase tracking-widest mb-6">
            Profile Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

            {/* Company */}
            <DetailCard
              icon={<Briefcase size={18} />}
              label="Company"
              isEditing={isEditing}
              value={formData.company}
              name="company"
              onChange={handleChange}
              displayValue={user?.company}
            />

            {/* Location */}
            <DetailCard
              icon={<MapPin size={18} />}
              label="Location"
              isEditing={isEditing}
              value={formData.location}
              name="location"
              onChange={handleChange}
              displayValue={user?.location}
            />

            {/* Birthday */}
            <DetailCard
              icon={<Calendar size={18} />}
              label="Birthday"
              isEditing={isEditing}
              value={formData.birthday}
              name="birthday"
              type="date"
              onChange={handleChange}
              displayValue={
                user?.birthday
                  ? new Date(user.birthday).toLocaleDateString()
                  : ''
              }
            />

            {/* Website */}
            <LinkCard
              icon={<Globe size={18} />}
              label="Website"
              isEditing={isEditing}
              value={formData.website}
              name="website"
              onChange={handleChange}
              displayValue={user?.website}
              href={formatUrl(user?.website)}
            />

            {/* GitHub */}
            <LinkCard
              icon={<Code2 size={18} />}
              label="GitHub"
              isEditing={isEditing}
              value={formData.github}
              name="github"
              onChange={handleChange}
              displayValue={user?.github}
              href={formatUrl(user?.github)}
            />

            {/* LinkedIn */}
            <LinkCard
              icon={<LinkIcon size={18} />}
              label="LinkedIn"
              isEditing={isEditing}
              value={formData.linkedin}
              name="linkedin"
              onChange={handleChange}
              displayValue={user?.linkedin}
              href={formatUrl(user?.linkedin)}
            />
          </div>
        </div>
      </form>

      {/* Stats */}
      {stats && !isEditing && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 w-full">

          {/* Problem Solving — full width */}
          <div className="bg-surface rounded-2xl border border-border-color shadow-sm p-6 md:col-span-3 flex flex-col md:flex-row items-center gap-8">
            <div>
              <h3 className="text-sm font-bold text-muted uppercase tracking-widest mb-6 w-full text-left">
                Problem Solving
              </h3>
              <div
                className="relative w-32 h-32 rounded-full flex items-center justify-center shadow-inner"
                style={{
                  background:
                    stats.totalSolved > 0
                      ? `conic-gradient(
                        #10b981 0% ${(stats.easySolved / stats.totalSolved) * 100}%,
                        #f59e0b ${(stats.easySolved / stats.totalSolved) * 100}% ${((stats.easySolved + stats.mediumSolved) / stats.totalSolved) * 100}%,
                        #ef4444 ${((stats.easySolved + stats.mediumSolved) / stats.totalSolved) * 100}% 100%
                      )`
                      : 'var(--surface-hover)',
                }}
              >
                <div className="absolute w-24 h-24 bg-surface rounded-full flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-main">{stats.totalSolved}</span>
                  <span className="text-[10px] text-muted uppercase font-bold tracking-wider">Solved</span>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full space-y-4">
              <StatRow label="Easy" solved={stats.easySolved} total={stats.easyCount} color="text-accent" />
              <StatRow label="Medium" solved={stats.mediumSolved} total={stats.mediumCount} color="text-warning" />
              <StatRow label="Hard" solved={stats.hardSolved} total={stats.hardCount} color="text-danger" />
            </div>
          </div>

          {/* Heatmap */}
          <div className="bg-surface rounded-2xl border border-border-color shadow-sm p-6 md:col-span-2 flex flex-col min-h-[260px]">
            <h3 className="text-sm font-bold text-muted uppercase tracking-widest mb-4">
              Activity (Last 6 Months)
            </h3>

            <div
              className="flex-1 overflow-x-auto"
              style={{ width: '100%' }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateRows: 'repeat(7, 13px)',
                  gridAutoFlow: 'column',
                  gap: '4px',
                  paddingBottom: '12px',
                  minWidth: 'max-content',
                }}
              >
                {generateHeatmapDays(stats?.heatmap || []).map(
                  (day) => {
                    const hasActivity = day.count > 0;

                    const opacity = hasActivity
                      ? Math.min(0.4 + day.count * 0.15, 1)
                      : 1;

                    return (
                      <div
                        key={day.date}
                        title={`${day.count} submissions on ${day.date}`}
                        style={{
                          width: '13px',
                          height: '13px',
                          borderRadius: '2px',
                          backgroundColor: hasActivity
                            ? 'var(--primary-color)'
                            : 'var(--surface-hover)',
                          opacity,
                          border: hasActivity
                            ? 'none'
                            : '1px solid var(--border-color)',
                        }}
                      />
                    );
                  }
                )}
              </div>
            </div>
          </div>

          {/* Bookmarks */}
          <div className="bg-surface rounded-2xl border border-border-color shadow-sm p-6 md:col-span-3">
            <h3 className="text-sm font-bold text-muted uppercase tracking-widest mb-4">
              Bookmarked Problems (
              {stats.bookmarks?.length || 0})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.bookmarks?.length > 0 ? (
                stats.bookmarks.map((prob) => (
                  <a
                    href={`/problems/${prob._id}`}
                    key={prob._id}
                    className="bg-surface-hover p-4 rounded-xl border border-border-color hover:border-primary/50 transition-all group flex flex-col gap-2"
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-main group-hover:text-primary transition-colors">
                        {prob.title}
                      </span>

                      <span
                        className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${prob.difficulty === 'Easy'
                            ? 'bg-accent/10 text-accent'
                            : prob.difficulty === 'Medium'
                              ? 'bg-warning/10 text-warning'
                              : 'bg-danger/10 text-danger'
                          }`}
                      >
                        {prob.difficulty}
                      </span>
                    </div>
                  </a>
                ))
              ) : (
                <p className="text-muted text-sm italic col-span-full">
                  No bookmarked problems yet.
                </p>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-surface rounded-2xl border border-border-color shadow-sm p-6 md:col-span-3">
            <h3 className="text-sm font-bold text-muted uppercase tracking-widest mb-4">
              Recent Activity
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border-color/50 text-left">
                    <th className="pb-3 text-xs font-bold text-muted uppercase tracking-wider">
                      Problem
                    </th>

                    <th className="pb-3 text-xs font-bold text-muted uppercase tracking-wider">
                      Status
                    </th>

                    <th className="pb-3 text-xs font-bold text-muted uppercase tracking-wider">
                      Points
                    </th>

                    <th className="pb-3 text-xs font-bold text-muted uppercase tracking-wider text-right">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border-color/30">
                  {stats.recentActivity?.length > 0 ? (
                    stats.recentActivity.map((activity, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-surface-hover transition-colors"
                      >
                        <td className="py-4 font-semibold text-main text-sm">
                          {activity.problemTitle}
                        </td>

                        <td className="py-4">
                          <span
                            className={`text-xs font-bold px-2 py-1 rounded-md ${activity.status === 'Accepted'
                                ? 'bg-accent/10 text-accent'
                                : 'bg-danger/10 text-danger'
                              }`}
                          >
                            {activity.status}
                          </span>
                        </td>

                        <td className="py-4 text-sm font-bold text-main">
                          +{activity.points}
                        </td>

                        <td className="py-4 text-xs text-muted text-right">
                          {new Date(
                            activity.createdAt
                          ).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="py-8 text-center text-muted text-sm italic"
                      >
                        No recent activity yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

const DetailCard = ({
  icon,
  label,
  isEditing,
  value,
  name,
  onChange,
  displayValue,
  type = 'text',
}) => (
  <div className="flex items-center gap-4">
    <div className="w-10 h-10 rounded-xl bg-surface-hover flex items-center justify-center text-muted shrink-0 border border-border-color/50">
      {icon}
    </div>

    <div className="flex-1 min-w-0">
      <p className="text-[11px] text-muted font-bold uppercase tracking-wider mb-0.5">
        {label}
      </p>

      {isEditing ? (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-surface-hover border border-border-color rounded-lg px-3 py-1.5 text-sm text-main focus:border-primary outline-none"
        />
      ) : (
        <p className="text-[14px] text-main font-semibold truncate">
          {displayValue || '---'}
        </p>
      )}
    </div>
  </div>
);

const LinkCard = ({
  icon,
  label,
  isEditing,
  value,
  name,
  onChange,
  displayValue,
  href,
}) => (
  <div className="flex items-center gap-4">
    <div className="w-10 h-10 rounded-xl bg-surface-hover flex items-center justify-center text-muted shrink-0 border border-border-color/50">
      {icon}
    </div>

    <div className="flex-1 min-w-0">
      <p className="text-[11px] text-muted font-bold uppercase tracking-wider mb-0.5">
        {label}
      </p>

      {isEditing ? (
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-surface-hover border border-border-color rounded-lg px-3 py-1.5 text-sm text-main focus:border-primary outline-none"
        />
      ) : displayValue ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[14px] text-primary hover:underline font-semibold truncate block"
        >
          {displayValue}
        </a>
      ) : (
        <p className="text-[14px] text-main font-semibold">
          ---
        </p>
      )}
    </div>
  </div>
);

const StatRow = ({ label, solved, total, color }) => (
  <div className="flex justify-between items-center text-sm">
    <span className={`${color} font-semibold`}>
      {label}
    </span>

    <span className="text-main font-bold">
      {solved}{' '}
      <span className="text-muted font-normal">
        / {total || 0}
      </span>
    </span>
  </div>
);

export default Profile;