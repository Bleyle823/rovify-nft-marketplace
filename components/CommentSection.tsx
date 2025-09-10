import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import {
    FiMessageSquare,
    FiHeart,
    FiSend,
    FiMoreVertical,
    FiEdit2,
    FiTrash2,
    FiFlag,
    FiChevronDown,
    FiChevronUp,
    FiCornerDownRight,
    FiSmile
} from 'react-icons/fi';

import { RiSortDesc } from "react-icons/ri";

// Define Comment type with support for replies
export interface Comment {
    id: string;
    userId: string;
    userName: string;
    userImage: string;
    verified: boolean;
    text: string;
    timestamp: Date;
    likes: number;
    liked: boolean;
    parentId?: string; // For replies
    replies?: Comment[];
    edited?: boolean;
}

interface CommentSectionProps {
    eventId: string;
    comments: Comment[];
    onAddComment: (text: string, parentId?: string) => void;
    currentUser?: {
        id: string;
        name: string;
        image: string;
        verified: boolean;
    };
}

type SortOption = 'newest' | 'oldest' | 'mostLiked';

export default function CommentSection({
    eventId,
    comments,
    onAddComment,
    currentUser = {
        id: '1',
        name: 'You',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=987&auto=format&fit=crop',
        verified: true
    }
}: CommentSectionProps) {
    const [commentText, setCommentText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [likedComments, setLikedComments] = useState<Record<string, boolean>>({});
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');
    const [editingComment, setEditingComment] = useState<string | null>(null);
    const [editText, setEditText] = useState('');
    const [showReplies, setShowReplies] = useState<Record<string, boolean>>({});
    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const [showMenu, setShowMenu] = useState<string | null>(null);
    const [expandedEmojis, setExpandedEmojis] = useState<string | null>(null);

    const replyInputRef = useRef<HTMLTextAreaElement>(null);
    const commentInputRef = useRef<HTMLTextAreaElement>(null);

    // Find a comment by ID in the comments tree
    // Define findComment before it's used in useEffect
    const findComment = useCallback((commentId: string, commentsArray: Comment[]): Comment | null => {
        for (const comment of commentsArray) {
            if (comment.id === commentId) {
                return comment;
            }

            if (comment.replies && comment.replies.length > 0) {
                const found = findComment(commentId, comment.replies);
                if (found) return found;
            }
        }

        return null;
    }, []);

    // Track the active event
    useEffect(() => {
        // This could be used for analytics tracking
        console.log(`Viewing comments for event: ${eventId}`);

        // Reset state when event changes
        setReplyingTo(null);
        setEditingComment(null);
    }, [eventId]);

    // Focus on reply input when replying
    useEffect(() => {
        if (replyingTo && replyInputRef.current) {
            replyInputRef.current.focus();
        }
    }, [replyingTo]);

    // Focus on edit input when editing
    useEffect(() => {
        if (editingComment) {
            const comment = findComment(editingComment, comments);
            if (comment) {
                setEditText(comment.text);
            }
        }
    }, [editingComment, comments, findComment]);

    // Click outside handlers
    useEffect(() => {
        // Fix handleClickOutside type
        const handleClickOutside = (event: MouseEvent): void => {
            if (showMenu && !(event.target as Element).closest('.comment-menu')) {
                setShowMenu(null);
            }

            if (expandedEmojis && !(event.target as Element).closest('.emoji-picker')) {
                setExpandedEmojis(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMenu, expandedEmojis]);

    // Handle main comment submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        setIsSubmitting(true);

        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));

            // Pass the comment to the parent component
            onAddComment(commentText);

            console.log(`Comment added to event: ${eventId}`);
            setCommentText('');
        } catch (error) {
            console.error(`Failed to add comment to event ${eventId}:`, error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle reply submission
    const handleReplySubmit = async (parentId: string) => {
        if (!replyText.trim()) return;

        try {
            console.log(`Submitting reply to comment ${parentId} on event ${eventId}`);

            // Submit the reply
            onAddComment(replyText, parentId);

            // Clear the reply state
            setReplyText('');
            setReplyingTo(null);

            // Auto-expand replies for the parent comment
            setShowReplies(prev => ({
                ...prev,
                [parentId]: true
            }));
        } catch (error) {
            console.error(`Failed to add reply to comment ${parentId}:`, error);
        }
    };

    // Handle comment editing
    const handleEditSubmit = async (commentId: string) => {
        if (!editText.trim()) return;

        try {
            console.log(`Editing comment ${commentId} on event ${eventId}`);

            // In a real app, this would be an API call
            // For now, we'll simulate success
            const updatedComment = findComment(commentId, comments);
            if (updatedComment) {
                // This would be handled by the parent component in a real app
                console.log(`Comment updated: ${editText}`);
            }

            // Clear the edit state
            setEditingComment(null);
        } catch (error) {
            console.error(`Failed to edit comment ${commentId}:`, error);
        }
    };

    // Handle comment deletion
    const handleDeleteComment = async (commentId: string) => {
        try {
            console.log(`Deleting comment ${commentId} from event ${eventId}`);

            // In a real app, this would be an API call
            // For now, we'll just simulate success
            console.log(`Comment ${commentId} deleted successfully`);

            // Hide the menu
            setShowMenu(null);
        } catch (error) {
            console.error(`Failed to delete comment ${commentId}:`, error);
        }
    };

    // Handle liking a comment
    const handleLikeComment = async (commentId: string) => {
        try {
            console.log(`Toggling like for comment ${commentId} on event ${eventId}`);

            // Store the like state with both eventId and commentId as the key
            const likeKey = `${eventId}-${commentId}`;

            setLikedComments(prev => {
                const newState = { ...prev };
                newState[likeKey] = !prev[likeKey];
                return newState;
            });
        } catch (error) {
            console.error(`Failed to toggle like for comment ${commentId}:`, error);
        }
    };

    // Handle reporting a comment
    const handleReportComment = async (commentId: string) => {
        try {
            console.log(`Reporting comment ${commentId} on event ${eventId}`);

            // In a real app, this would be an API call
            alert(`Thank you for reporting this comment. Our team will review it.`);

            // Hide the menu
            setShowMenu(null);
        } catch (error) {
            console.error(`Failed to report comment ${commentId}:`, error);
        }
    };

    // Toggle showing replies for a comment
    const toggleReplies = (commentId: string) => {
        setShowReplies(prev => ({
            ...prev,
            [commentId]: !prev[commentId]
        }));
    };

    // Check if a comment is liked
    const isCommentLiked = (commentId: string) => {
        const likeKey = `${eventId}-${commentId}`;
        return likedComments[likeKey] || false;
    };

    // Check if current user owns a comment
    const isOwnComment = (userId: string) => {
        return userId === currentUser.id;
    };

    // Toggle emoji picker
    const toggleEmojiPicker = (commentId: string | null) => {
        setExpandedEmojis(prev => prev === commentId ? null : commentId);
    };

    // Add emoji to text
    const addEmoji = (emoji: string, isReply: boolean = false, commentId: string | null = null) => {
        if (isReply && replyingTo) {
            setReplyText(prev => prev + emoji);
            if (replyInputRef.current) {
                replyInputRef.current.focus();
            }
        } else if (commentId && editingComment === commentId) {
            setEditText(prev => prev + emoji);
        } else {
            setCommentText(prev => prev + emoji);
            if (commentInputRef.current) {
                commentInputRef.current.focus();
            }
        }

        // Close the emoji picker
        setExpandedEmojis(null);
    };

    // Sort the comments based on the selected option
    const sortComments = (commentsToSort: Comment[]): Comment[] => {
        const sorted = [...commentsToSort];

        switch (sortBy) {
            case 'newest':
                return sorted.sort((a, b) =>
                    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            case 'oldest':
                return sorted.sort((a, b) =>
                    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
            case 'mostLiked':
                return sorted.sort((a, b) => b.likes - a.likes);
            default:
                return sorted;
        }
    };

    // Get top-level comments (not replies)
    const topLevelComments = comments.filter(comment => !comment.parentId);

    // Sort the top-level comments
    const sortedComments = sortComments(topLevelComments);

    // Get the total comment count including replies
    const totalCommentCount = comments.length;

    // Common emoji list
    const commonEmojis = ["😊", "👍", "❤️", "😂", "🙌", "🎉", "🔥", "👏", "🤔", "😍"];

    // Render a comment and its replies recursively
    const renderComment = (comment: Comment, depth: number = 0) => {
        const isLiked = comment.liked || isCommentLiked(comment.id);
        const likeKey = `${eventId}-${comment.id}`;
        const hasReplies = comment.replies && comment.replies.length > 0;
        const isEditing = editingComment === comment.id;
        const isReplying = replyingTo === comment.id;
        const showRepliesForComment = showReplies[comment.id] || false;
        const isMenuOpen = showMenu === comment.id;
        const isEmojiPickerOpen = expandedEmojis === comment.id;
        const currentUserOwnsComment = isOwnComment(comment.userId);
        const isReply = depth > 0;

        return (
            <div
                key={comment.id}
                className={`animate-fade-in-up ${isReply ? 'mt-3' : 'mt-4'}`}
                style={{ animationDelay: '0.1s' }}
            >
                <div className={`flex ${isReply ? 'pl-4' : ''}`}>
                    {/* Left thread line indicator for replies */}
                    {isReply && (
                        <div className="mr-2 w-0.5 bg-gray-200 relative flex-shrink-0">
                            <div className="absolute -left-4 top-5 w-4 h-0.5 bg-gray-200"></div>
                        </div>
                    )}

                    <div className={`flex space-x-3 ${isReply ? 'w-full' : ''}`}>
                        <div className={`${isReply ? 'h-8 w-8' : 'h-10 w-10'} rounded-full overflow-hidden flex-shrink-0`}>
                            <Image
                                src={comment.userImage}
                                alt={comment.userName}
                                width={isReply ? 32 : 40}
                                height={isReply ? 32 : 40}
                                className="object-cover"
                            />
                        </div>

                        <div className="flex-1">
                            {/* Comment content */}
                            <div className={`rounded-lg px-4 py-3 relative ${isReply ? 'bg-gray-100 border border-gray-200/70' : 'bg-gray-50'}`}>
                                {/* User info */}
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center">
                                        <span className={`font-medium text-gray-900 ${isReply ? 'text-sm' : ''}`}>
                                            {comment.userName}
                                        </span>
                                        {comment.verified && (
                                            <svg xmlns="http://www.w3.org/2000/svg" className={`${isReply ? 'h-3.5 w-3.5' : 'h-4 w-4'} text-blue-500 ml-1`} viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812a3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                        {isReply && (
                                            <div className="flex items-center ml-2 text-xs bg-[#FF5722]/10 text-[#FF5722] px-1.5 py-0.5 rounded-full">
                                                <FiCornerDownRight className="mr-1 h-3 w-3" />
                                                <span className="font-medium">reply</span>
                                            </div>
                                        )}
                                        {comment.edited && (
                                            <span className="ml-2 text-xs text-gray-500">(edited)</span>
                                        )}
                                    </div>

                                    {/* Comment menu button */}
                                    <div className="relative comment-menu">
                                        <button
                                            onClick={() => setShowMenu(prev => prev === comment.id ? null : comment.id)}
                                            className="text-gray-400 hover:text-gray-600 p-1 rounded-full"
                                            aria-label="Comment options"
                                        >
                                            <FiMoreVertical size={isReply ? 14 : 16} />
                                        </button>

                                        {/* Comment menu dropdown */}
                                        {isMenuOpen && (
                                            <div className="absolute z-10 right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 text-sm">
                                                {currentUserOwnsComment && (
                                                    <>
                                                        <button
                                                            onClick={() => {
                                                                setEditingComment(comment.id);
                                                                setShowMenu(null);
                                                            }}
                                                            className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                                                        >
                                                            <FiEdit2 className="mr-2" />
                                                            Edit comment
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteComment(comment.id)}
                                                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 flex items-center"
                                                        >
                                                            <FiTrash2 className="mr-2" />
                                                            Delete
                                                        </button>
                                                        <div className="border-t border-gray-100 my-1"></div>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => handleReportComment(comment.id)}
                                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                                                >
                                                    <FiFlag className="mr-2" />
                                                    Report comment
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Comment text - editing mode or display mode */}
                                {isEditing ? (
                                    <div className="mt-2">
                                        <textarea
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-[#FF5722]"
                                            rows={2}
                                        />
                                        <div className="flex justify-between mt-2">
                                            <div className="relative emoji-picker">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleEmojiPicker(comment.id)}
                                                    className="text-gray-500 hover:text-gray-700"
                                                >
                                                    <FiSmile className="w-5 h-5" />
                                                </button>

                                                {isEmojiPickerOpen && (
                                                    <div className="absolute left-0 mt-1 bg-white rounded-lg shadow-lg p-2 z-10 flex overflow-x-auto no-scrollbar">
                                                        {commonEmojis.map(emoji => (
                                                            <button
                                                                key={emoji}
                                                                onClick={() => addEmoji(emoji, false, comment.id)}
                                                                className="p-1 text-xl hover:bg-gray-100 rounded flex-shrink-0"
                                                            >
                                                                {emoji}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <button
                                                    onClick={() => setEditingComment(null)}
                                                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 mr-2"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => handleEditSubmit(comment.id)}
                                                    disabled={!editText.trim()}
                                                    className={`px-3 py-1 text-sm rounded-md ${editText.trim()
                                                        ? 'bg-[#FF5722] text-white'
                                                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                        }`}
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <p className={`text-gray-700 whitespace-pre-line ${isReply ? 'text-sm' : ''}`}>
                                        {comment.text}
                                    </p>
                                )}

                                {/* Pointy corner effect for the speech bubble - only for top level comments */}
                                {!isReply && (
                                    <div className="absolute top-3 -left-2 w-4 h-4 transform rotate-45 bg-gray-50"></div>
                                )}
                            </div>

                            {/* Comment actions */}
                            <div className="flex items-center mt-1 ml-1 text-xs text-gray-500">
                                <span>{formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}</span>

                                <button
                                    onClick={() => handleLikeComment(comment.id)}
                                    className={`ml-4 flex items-center group ${isLiked ? 'text-[#FF5722]' : 'hover:text-[#FF5722]'}`}
                                    aria-label={isLiked ? "Unlike comment" : "Like comment"}
                                >
                                    <FiHeart className={`mr-1 ${isLiked ? 'fill-current' : 'group-hover:fill-current'}`} />
                                    <span>{comment.likes + (likedComments[likeKey] ? 1 : 0)}</span>
                                </button>

                                <button
                                    className="ml-4 text-gray-500 hover:text-gray-700"
                                    onClick={() => {
                                        setReplyingTo(prev => prev === comment.id ? null : comment.id);
                                        setReplyText('');
                                    }}
                                >
                                    Reply
                                </button>

                                {/* Show/hide replies toggle when comment has replies */}
                                {hasReplies && !isReply && (
                                    <button
                                        className="ml-4 flex items-center text-gray-500 hover:text-gray-700"
                                        onClick={() => toggleReplies(comment.id)}
                                    >
                                        {showRepliesForComment ? (
                                            <>
                                                <FiChevronUp className="mr-1" />
                                                <span>Hide replies ({comment.replies?.length})</span>
                                            </>
                                        ) : (
                                            <>
                                                <FiChevronDown className="mr-1" />
                                                <span>Show replies ({comment.replies?.length})</span>
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>

                            {/* Reply form */}
                            {isReplying && (
                                <div className="mt-3 flex items-start space-x-2">
                                    <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0">
                                        <Image
                                            src={currentUser.image}
                                            alt={currentUser.name}
                                            width={32}
                                            height={32}
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 relative">
                                        <textarea
                                            ref={replyInputRef}
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            placeholder={`Reply to ${comment.userName}...`}
                                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-[#FF5722]"
                                            rows={2}
                                        />
                                        <div className="flex justify-between mt-2">
                                            <div className="relative emoji-picker">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleEmojiPicker(`reply-${comment.id}`)}
                                                    className="text-gray-500 hover:text-gray-700"
                                                >
                                                    <FiSmile className="w-5 h-5" />
                                                </button>

                                                {expandedEmojis === `reply-${comment.id}` && (
                                                    <div className="absolute left-0 mt-1 bg-white rounded-lg shadow-lg p-2 z-10 flex overflow-x-auto no-scrollbar">
                                                        {commonEmojis.map(emoji => (
                                                            <button
                                                                key={emoji}
                                                                onClick={() => addEmoji(emoji, true)}
                                                                className="p-1 text-xl hover:bg-gray-100 rounded flex-shrink-0"
                                                            >
                                                                {emoji}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <button
                                                    onClick={() => setReplyingTo(null)}
                                                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 mr-2"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => handleReplySubmit(comment.id)}
                                                    disabled={!replyText.trim()}
                                                    className={`px-3 py-1 text-sm rounded-md ${replyText.trim()
                                                        ? 'bg-[#FF5722] text-white'
                                                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                        }`}
                                                >
                                                    Reply
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Nested replies container with thread line */}
                {hasReplies && showRepliesForComment && !isReply && (
                    <div className="ml-12 pl-1 border-l-2 border-gray-200 space-y-0">
                        {sortComments(comment.replies || []).map(reply => renderComment(reply, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header with comment counter and sorting */}
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <FiMessageSquare className="mr-2 text-[#FF5722]" />
                    Comments <span className="text-[#FF5722] ml-1">({totalCommentCount})</span>
                </h3>

                <div className="flex items-center">
                    <label htmlFor="sort-comments" className="mr-2 text-sm text-gray-600">Sort by:</label>
                    <div className="relative">
                        <select
                            id="sort-comments"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                            className="pl-2 pr-8 py-1 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#FF5722] appearance-none"
                        >
                            <option value="newest">Newest</option>
                            <option value="oldest">Oldest</option>
                            <option value="mostLiked">Most Liked</option>
                        </select>
                        <RiSortDesc className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleSubmit} className="flex items-start space-x-3">
                <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                        src={currentUser.image}
                        alt={currentUser.name}
                        width={40}
                        height={40}
                        className="object-cover"
                    />
                </div>

                <div className="relative flex-1">
                    <textarea
                        ref={commentInputRef}
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder={`Share your thoughts about this event...`}
                        className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#FF5722]/50 focus:border-[#FF5722]"
                        rows={2}
                    ></textarea>

                    <div className="absolute right-3 bottom-3 flex items-center space-x-2">
                        <div className="relative emoji-picker">
                            <button
                                type="button"
                                onClick={() => toggleEmojiPicker('main')}
                                className="p-1.5 text-gray-500 hover:text-gray-700 rounded-full"
                            >
                                <FiSmile className="w-5 h-5" />
                            </button>

                            {expandedEmojis === 'main' && (
                                <div className="absolute right-0 bottom-10 bg-white rounded-lg shadow-lg p-2 z-10 flex overflow-x-auto no-scrollbar">
                                    {commonEmojis.map(emoji => (
                                        <button
                                            key={emoji}
                                            onClick={() => addEmoji(emoji)}
                                            className="p-1 text-xl hover:bg-gray-100 rounded flex-shrink-0"
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={!commentText.trim() || isSubmitting}
                            className={`p-2 rounded-full ${commentText.trim() && !isSubmitting
                                ? 'bg-[#FF5722] text-white'
                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            {isSubmitting ? (
                                <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                            ) : (
                                <FiSend className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>
            </form>

            {/* Comments List */}
            <div className="space-y-0">
                {sortedComments.length > 0 ? (
                    sortedComments.map(comment => renderComment(comment))
                ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                            <FiMessageSquare className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">No comments yet</h3>
                        <p className="text-gray-500 mb-4">Be the first to share your thoughts!</p>
                    </div>
                )}
            </div>

            {/* New comments indicator - would connect to real-time updates in a real app */}
            {totalCommentCount > 5 && (
                <div className="flex justify-center">
                    <button className="px-4 py-2 text-sm text-[#FF5722] bg-[#FF5722]/5 rounded-full hover:bg-[#FF5722]/10 transition-colors">
                        Load more comments
                    </button>
                </div>
            )}

            {/* Global Animation Styles */}
            <style jsx global>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .animate-fade-in-up {
                    animation: fade-in-up 0.3s ease-out forwards;
                }
                
                /* Hide scrollbar for Chrome, Safari and Opera */
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                
                /* Hide scrollbar for IE, Edge and Firefox */
                .no-scrollbar {
                    -ms-overflow-style: none;  /* IE and Edge */
                    scrollbar-width: none;  /* Firefox */
                }
            `}</style>
        </div>
    );
}