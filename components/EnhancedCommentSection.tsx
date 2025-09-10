import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { FiHeart, FiMessageSquare, FiChevronDown, FiChevronUp } from 'react-icons/fi';

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
    replies?: Comment[];
}

interface CommentSectionProps {
    eventId: string;
    comments: Comment[];
    onAddComment: (text: string, parentId?: string) => void;
}

export default function CommentSection({
    eventId,
    comments,
    onAddComment
}: CommentSectionProps) {
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');
    const [expandedThreads, setExpandedThreads] = useState<Record<string, boolean>>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim()) {
            onAddComment(newComment);
            setNewComment('');
        }
    };

    const handleReply = (parentId: string) => {
        if (replyText.trim()) {
            onAddComment(replyText, parentId);
            setReplyText('');
            setReplyingTo(null);
        }
    };

    const toggleThread = (commentId: string) => {
        setExpandedThreads(prev => ({
            ...prev,
            [commentId]: !prev[commentId]
        }));
    };

    const renderComment = (comment: Comment, isReply = false) => {
        const hasReplies = comment.replies && comment.replies.length > 0;
        const isExpanded = expandedThreads[comment.id];

        return (
            <div
                key={comment.id}
                className={`bg-white rounded-lg p-4 transition-all ${isReply ? 'ml-10 mt-3 border-l-2 border-gray-100' : 'border border-gray-100 shadow-sm hover:shadow-md mb-4'
                    }`}
            >
                <div className="flex items-start space-x-3">
                    <div className="h-10 w-10 rounded-full overflow-hidden">
                        <Image
                            src={comment.userImage}
                            alt={comment.userName}
                            width={40}
                            height={40}
                            className="object-cover"
                        />
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                            <p className="font-medium text-gray-900">{comment.userName}</p>
                            {comment.verified && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            )}
                            <span className="text-xs text-gray-500 ml-2">
                                {formatDistanceToNow(comment.timestamp, { addSuffix: true })}
                            </span>
                        </div>

                        <p className="text-gray-700 mt-1">{comment.text}</p>

                        <div className="flex items-center mt-2 space-x-4">
                            <button className={`flex items-center text-sm ${comment.liked ? 'text-[#FF5722]' : 'text-gray-500 hover:text-gray-700'}`}>
                                <FiHeart className={`w-4 h-4 mr-1 ${comment.liked ? 'fill-current' : ''}`} />
                                {comment.likes > 0 && <span>{comment.likes}</span>}
                            </button>

                            <button
                                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                                className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                            >
                                <FiMessageSquare className="w-4 h-4 mr-1" />
                                <span>Reply</span>
                            </button>

                            {hasReplies && (
                                <button
                                    onClick={() => toggleThread(comment.id)}
                                    className="flex items-center text-sm text-[#FF5722]"
                                >
                                    {isExpanded ? (
                                        <>
                                            <FiChevronUp className="w-4 h-4 mr-1" />
                                            <span>Hide {comment.replies!.length} replies</span>
                                        </>
                                    ) : (
                                        <>
                                            <FiChevronDown className="w-4 h-4 mr-1" />
                                            <span>Show {comment.replies!.length} replies</span>
                                        </>
                                    )}
                                </button>
                            )}
                        </div>

                        {/* Reply Form */}
                        <AnimatePresence>
                            {replyingTo === comment.id && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-3"
                                >
                                    <div className="flex">
                                        <div className="flex-1 rounded-lg border border-gray-200 overflow-hidden shadow-sm bg-gray-50">
                                            <textarea
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                                placeholder="Write a reply..."
                                                className="w-full p-3 bg-transparent border-none resize-none focus:ring-0 text-gray-700"
                                                rows={2}
                                            />
                                            <div className="flex justify-end px-3 py-2 bg-gray-100">
                                                <button
                                                    onClick={() => setReplyingTo(null)}
                                                    className="px-3 py-1 text-gray-500 hover:text-gray-700 mr-2"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => handleReply(comment.id)}
                                                    disabled={!replyText.trim()}
                                                    className="px-4 py-1 bg-[#FF5722] text-white rounded-full font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                                                >
                                                    Reply
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Replies */}
                        <AnimatePresence>
                            {hasReplies && isExpanded && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="mt-3 space-y-3"
                                >
                                    {comment.replies!.map(reply => renderComment(reply, true))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Comments</h3>

            {/* Add Comment Form */}
            <form onSubmit={handleSubmit} className="mb-6">
                <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm mb-2">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Join the discussion..."
                        className="w-full p-4 border-none resize-none focus:ring-0 focus:border-none text-gray-700"
                        rows={3}
                    />
                    <div className="flex justify-end px-4 py-2 bg-gray-50">
                        <button
                            type="submit"
                            disabled={!newComment.trim()}
                            className="px-5 py-2 bg-[#FF5722] text-white rounded-full font-medium hover:bg-[#E64A19] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            Post Comment
                        </button>
                    </div>
                </div>
            </form>

            {/* Comment List */}
            {comments.length > 0 ? (
                <div className="space-y-4">
                    {comments.map(comment => renderComment(comment))}
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                        <FiMessageSquare className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">No comments yet</h3>
                    <p className="text-gray-500 mb-4">Be the first to leave a comment!</p>
                </div>
            )}
        </div>
    );
}