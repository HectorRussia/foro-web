import { useState } from 'react';
import { FaCopy, FaCheck, FaExternalLinkAlt } from 'react-icons/fa';
import { IoIosMore, } from 'react-icons/io';
import type { NewsItem } from '../interface/news';

const iconsDash = [
    { icon: <IoIosMore />, label: "More" },
    { icon: <FaExternalLinkAlt />, label: "External Link" },
    { icon: <FaCopy />, label: "Copy" },
]

const DashboardCard = ({ post, variant = 'list' }: { post: NewsItem, variant?: 'list' | 'grid' | 'compact' }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(post.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const isCompact = variant === 'compact';
    const isGrid = variant === 'grid';

    return (
        <div className={`group bg-[#0f172a] border border-[#1e293b] rounded-2xl transition-all duration-200 hover:border-gray-600 hover:shadow-xl hover:shadow-black/20 flex flex-col
            ${isCompact ? 'p-4' : 'p-6'}
            ${isGrid ? 'h-full justify-between' : ''}
        `}>
            <div className={`flex items-start justify-between ${isCompact ? 'mb-2' : 'mb-4'}`}>
                <div className="flex items-center gap-3">
                    <div className={`
                        rounded-full flex items-center justify-center text-white font-bold text-sm overflow-hidden shrink-0
                        ${isCompact ? 'w-8 h-8' : 'w-10 h-10'}
                        ${post.user_id}
                    `}>
                        {post.tweet_profile_pic
                            ? <img src={post.tweet_profile_pic} alt="owner" className="w-full h-full object-cover" />
                            : <div className='w-full h-full bg-[#1e293b] flex items-center justify-center'>{post.title.charAt(0)}</div>
                        }
                    </div>
                    <div className="min-w-0">
                        <h3 className={`font-semibold text-white leading-tight truncate pr-2 ${isCompact ? 'text-base' : 'text-lg'}`}>
                            {post.title}
                        </h3>
                        {!isCompact && (
                            <p className="text-gray-500 text-xs mt-1 truncate">
                                {new Date(post.created_at).toLocaleDateString('th-TH')}
                            </p>
                        )}
                    </div>
                </div>

                {/* Options Icon */}
                <button className={`text-gray-500 hover:text-white rounded-full hover:bg-white/5 transition-colors ${isCompact ? 'p-1' : 'p-2'}`}>
                    {iconsDash[0].icon}
                </button>
            </div>

            <div className={`text-gray-300 font-light overflow-hidden
                ${isCompact ? 'text-sm mb-3 line-clamp-2' : 'text-base mb-4'}
                ${isGrid ? 'grow line-clamp-4' : ''}
            `}>
                {post.content}
            </div>

            <div className="flex flex-wrap gap-2 mb-auto">
                {/* Tags placeholder if needed */}
            </div>

            <div className={`flex items-center gap-2 border-t border-[#1e293b] ${isCompact ? 'pt-2 mt-auto' : 'pt-4 mt-auto'}`}>
                <a href={post.url} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <button className={`w-full flex items-center justify-center gap-2 cursor-pointer rounded-lg bg-black/40 hover:bg-black/60 text-gray-400 hover:text-blue-400 transition-all font-medium border border-transparent hover:border-blue-900/30
                        ${isCompact ? 'py-1.5 text-xs' : 'py-2.5 text-sm'}
                    `}>
                        {iconsDash[1].icon}
                        <span className={isGrid ? 'hidden xl:inline' : ''}>ดูโพสต์</span>
                    </button>
                </a>
                <button
                    onClick={handleCopy}
                    className={`flex-1 flex items-center justify-center gap-2 cursor-pointer rounded-lg bg-black/40 hover:bg-black/60 text-gray-400 hover:text-green-400 transition-all font-medium border border-transparent hover:border-green-900/30
                        ${isCompact ? 'py-1.5 text-xs' : 'py-2.5 text-sm'}
                    `}
                >
                    {copied ? <FaCheck className="text-green-500" /> : iconsDash[2].icon}
                    {copied ?
                        <span className="text-green-500">คัดลอก</span>
                        : <span className={isGrid ? 'hidden xl:inline' : ''}>คัดลอก</span>
                    }
                </button>
            </div>
        </div>
    )
}


export default DashboardCard