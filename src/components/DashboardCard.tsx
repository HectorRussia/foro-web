import { useState } from 'react';
import { FaCopy, FaCheck, FaExternalLinkAlt } from 'react-icons/fa';
import { IoIosMore, } from 'react-icons/io';
import { type NewsItem } from './Layouts/Main';

const iconsDash = [
    { icon: <IoIosMore />, label: "More" },
    { icon: <FaExternalLinkAlt />, label: "External Link" },
    { icon: <FaCopy />, label: "Copy" },
]

const DashboardCard = ({ post }: { post: NewsItem }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(post.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="group bg-[#0f172a] border border-[#1e293b] rounded-2xl p-6 transition-all duration-200 hover:border-gray-600 hover:shadow-xl hover:shadow-black/20">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${post.user_id}`}>
                        {post.tweet_profile_pic
                            ?
                            <img src={post.tweet_profile_pic} alt="picture owner post" className="w-full h-full rounded-full" />
                            :
                            <div className='w-full h-full rounded-full flex items-center justify-center text-white font-bold text-sm bg-[#1e293b]'>{post.title.charAt(0)}</div>
                        }
                    </div>
                    <div>
                        <h3 className="font-semibold text-white text-[20px] leading-tight">{post.title}</h3>
                        <p className="text-gray-500 text-sm mt-1">{post.title} post on {new Date(post.created_at).toLocaleDateString('th-TH')}</p>
                    </div>
                </div>
                {/* Options Icon */}
                <button className="text-gray-500 hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors">
                    {iconsDash[0].icon}
                </button>
            </div>

            <p className="flex items-center gap-2 text-gray-300 text-base leading-relaxed mb-4 font-light">
                {post.content}
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
                {/*  {post.tags.map((tag: string) => (
                <span key={tag} className="px-3 py-1 rounded-full bg-[#1e293b] border border-[#334155] text-xs text-blue-300 group-hover:border-blue-500/30 transition-colors">
                    #{tag}
                </span>
            ))} */}
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-[#1e293b]">
                <a href={post.url} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <button className="w-full flex items-center justify-center gap-2 cursor-pointer py-2.5 rounded-lg bg-black/40 hover:bg-black/60 text-gray-400 hover:text-blue-400 transition-all text-sm font-medium border border-transparent hover:border-blue-900/30">
                        {iconsDash[1].icon}
                        ดูโพสต์ต้นทาง
                    </button>
                </a>
                <button
                    onClick={handleCopy}
                    className="flex-1 flex items-center justify-center gap-2 cursor-pointer py-2.5 rounded-lg bg-black/40 hover:bg-black/60 text-gray-400 hover:text-green-400 transition-all text-sm font-medium border border-transparent hover:border-green-900/30"
                >
                    {copied ? <FaCheck className="text-green-500" /> : iconsDash[2].icon}
                    {copied ? <span className="text-green-500">คัดลอกแล้ว</span> : "คัดลอกลิงก์"}
                </button>
            </div>
        </div>
    )
}


export default DashboardCard