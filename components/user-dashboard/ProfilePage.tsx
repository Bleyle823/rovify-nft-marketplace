'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
    FiEdit2, FiCheck, FiX, FiCamera, FiMapPin, FiCalendar,
    FiTwitter, FiLinkedin, FiInstagram, FiGithub
} from 'react-icons/fi';

// Mock user data
const mockUser = {
    id: 'user1',
    name: 'Joe Love',
    username: 'joe_rover',
    email: 'alex@rovify.io',
    phone: '+250 782 650-383',
    bio: 'Event enthusiast and community builder. Always seeking memorable experiences to share with friends.',
    location: 'San Francisco, CA',
    website: 'https://joe_roverohnson.dev',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=300&fit=crop',
    verified: true,
    level: 'Gold',
    points: 2840,
    followers: 1234,
    following: 456,
    eventsAttended: 28,
    totalSpent: 4250,
    interests: ['Music', 'Tech', 'Art', 'Food', 'Travel', 'Crypto', 'Sports'],
    joinedDate: '2023-01-15',
    socialLinks: {
        twitter: '@joe_roverohnson',
        linkedin: 'alex-johnson-dev',
        instagram: 'joe_rover_events',
        github: 'joe_roverohnson'
    }
};

export default function ProfilePage() {
    const [currentUser, setCurrentUser] = useState(mockUser);
    const [isEditing, setIsEditing] = useState(false);
    const [editingUser, setEditingUser] = useState(mockUser);

    // File refs
    const profileImageRef = useRef<HTMLInputElement>(null);
    const coverImageRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (type: 'profile' | 'cover', file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageUrl = e.target?.result as string;
            if (type === 'profile') {
                setEditingUser(prev => ({ ...prev, image: imageUrl }));
            } else {
                setEditingUser(prev => ({ ...prev, coverImage: imageUrl }));
            }
        };
        reader.readAsDataURL(file);
    };

    const handleSaveProfile = () => {
        setCurrentUser(editingUser);
        setIsEditing(false);
    };

    return (
        <div className="space-y-8">
            {/* Cover & Profile Image */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                <div className="relative h-48 bg-gradient-to-r from-orange-400 to-orange-600">
                    <Image
                        src={isEditing ? editingUser.coverImage : currentUser.coverImage}
                        alt="Cover"
                        className="w-full h-full object-cover"
                        fill
                        sizes="(max-width: 1024px) 100vw, 100vw"
                        style={{ objectFit: 'cover' }}
                        priority
                    />
                    {isEditing && (
                        <button
                            onClick={() => coverImageRef.current?.click()}
                            className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-lg hover:bg-black/70 transition-colors"
                        >
                            <FiCamera className="w-4 h-4" />
                        </button>
                    )}
                    <input
                        ref={coverImageRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleImageUpload('cover', e.target.files[0])}
                    />
                </div>

                <div className="px-8 pb-8">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-16 mb-6">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-2xl border-4 border-white overflow-hidden shadow-xl">
                                <Image
                                    src={isEditing ? editingUser.image : currentUser.image}
                                    alt={currentUser.name}
                                    className="w-full h-full object-cover"
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 128px"
                                    style={{ objectFit: 'cover' }}
                                    priority
                                />
                            </div>
                            {isEditing && (
                                <button
                                    onClick={() => profileImageRef.current?.click()}
                                    className="absolute bottom-2 right-2 bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 transition-colors"
                                >
                                    <FiCamera className="w-3 h-3" />
                                </button>
                            )}
                            <input
                                ref={profileImageRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => e.target.files?.[0] && handleImageUpload('profile', e.target.files[0])}
                            />
                        </div>

                        <div className="mt-4 sm:mt-0">
                            {!isEditing ? (
                                <motion.button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FiEdit2 className="w-4 h-4" />
                                    Edit Profile
                                </motion.button>
                            ) : (
                                <div className="flex gap-3">
                                    <motion.button
                                        onClick={handleSaveProfile}
                                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <FiCheck className="w-4 h-4" />
                                        Save
                                    </motion.button>
                                    <motion.button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setEditingUser(currentUser);
                                        }}
                                        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <FiX className="w-4 h-4" />
                                        Cancel
                                    </motion.button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Profile Info */}
                        <div className="lg:col-span-2 space-y-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editingUser.name}
                                            onChange={(e) => setEditingUser(prev => ({ ...prev, name: e.target.value }))}
                                            className="text-3xl font-bold text-gray-900 bg-transparent border-b-2 border-orange-500 focus:outline-none"
                                        />
                                    ) : (
                                        <h1 className="text-3xl font-bold text-gray-900">{currentUser.name}</h1>
                                    )}
                                    {currentUser.verified && (
                                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                            <FiCheck className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                </div>
                                <p className="text-gray-600 mb-1">@{currentUser.username}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                                    <div className="flex items-center gap-1">
                                        <FiMapPin className="w-4 h-4" />
                                        <span>{currentUser.location}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <FiCalendar className="w-4 h-4" />
                                        <span>Joined {new Date(currentUser.joinedDate).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                {isEditing ? (
                                    <textarea
                                        value={editingUser.bio}
                                        onChange={(e) => setEditingUser(prev => ({ ...prev, bio: e.target.value }))}
                                        rows={3}
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                        placeholder="Tell us about yourself..."
                                    />
                                ) : (
                                    <p className="text-gray-700">{currentUser.bio}</p>
                                )}
                            </div>

                            {/* Contact Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            value={editingUser.email}
                                            onChange={(e) => setEditingUser(prev => ({ ...prev, email: e.target.value }))}
                                            className="w-full p-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                        />
                                    ) : (
                                        <p className="text-gray-900">{currentUser.email}</p>
                                    )}
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            value={editingUser.phone}
                                            onChange={(e) => setEditingUser(prev => ({ ...prev, phone: e.target.value }))}
                                            className="w-full p-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                        />
                                    ) : (
                                        <p className="text-gray-900">{currentUser.phone}</p>
                                    )}
                                </div>
                            </div>

                            {/* Interests */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Interests</h3>
                                <div className="flex flex-wrap gap-2">
                                    {currentUser.interests.map((interest, index) => (
                                        <span
                                            key={index}
                                            className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium"
                                        >
                                            {interest}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Stats & Social */}
                        <div className="space-y-6">
                            {/* Stats */}
                            <div className="bg-gray-50 rounded-2xl p-6">
                                <h3 className="font-semibold text-gray-900 mb-4">Stats</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Events Attended</span>
                                        <span className="font-semibold">{currentUser.eventsAttended}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Followers</span>
                                        <span className="font-semibold">{currentUser.followers}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Following</span>
                                        <span className="font-semibold">{currentUser.following}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Points</span>
                                        <span className="font-semibold text-orange-600">{currentUser.points}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="bg-gray-50 rounded-2xl p-6">
                                <h3 className="font-semibold text-gray-900 mb-4">Social Links</h3>
                                <div className="space-y-3">
                                    {Object.entries(currentUser.socialLinks).map(([platform, handle]) => (
                                        <div key={platform} className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                                {platform === 'twitter' && <FiTwitter className="w-4 h-4 text-blue-500" />}
                                                {platform === 'linkedin' && <FiLinkedin className="w-4 h-4 text-blue-600" />}
                                                {platform === 'instagram' && <FiInstagram className="w-4 h-4 text-pink-500" />}
                                                {platform === 'github' && <FiGithub className="w-4 h-4 text-gray-700" />}
                                            </div>
                                            <span className="text-gray-700 capitalize">{handle}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}