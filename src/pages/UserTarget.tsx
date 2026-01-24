import { useState } from 'react';
import { FaMagnifyingGlass, FaTwitter } from 'react-icons/fa6';
import { HiCheckBadge } from 'react-icons/hi2';
import Sidebar from '../components/Layouts/Sidebar';

const MOCK_DATA = {
    "status": "success",
    "data": {
        "query": "Donald J. Trump",
        "cursor": null,
        "users": {
            "users": [
                {
                    "id": "25073877",
                    "name": "Donald J. Trump",
                    "screen_name": "realDonaldTrump",
                    "username": null,
                    "location": "",
                    "url": "https://t.co/mjKdTvQzae",
                    "description": "45th & 47th President of the United States of America🇺🇸",
                    "email": null,
                    "protected": false,
                    "verified": false,
                    "followers_count": 109429217,
                    "following_count": 53,
                    "friends_count": 53,
                    "favourites_count": 0,
                    "statuses_count": 59821,
                    "media_tweets_count": 5380,
                    "created_at": "Wed Mar 18 13:46:38 +0000 2009",
                    "profile_banner_url": "https://pbs.twimg.com/profile_banners/25073877/1604214583",
                    "profile_image_url_https": "https://pbs.twimg.com/profile_images/874276197357596672/kUuht00m_normal.jpg",
                    "can_dm": false,
                    "isBlueVerified": true
                },
                {
                    "id": "1323730225067339784",
                    "name": "Joe Biden",
                    "screen_name": "JoeBiden",
                    "username": null,
                    "location": "Washington, DC",
                    "url": "https://t.co/497Bq93F0u",
                    "description": "46th President of the United States, husband to @FLOTUS, proud dad & pop.",
                    "email": null,
                    "protected": false,
                    "verified": false,
                    "followers_count": 38100000,
                    "following_count": 47,
                    "friends_count": 47,
                    "favourites_count": 0,
                    "statuses_count": 10000,
                    "media_tweets_count": 1200,
                    "created_at": "Tue Nov 03 00:00:00 +0000 2020",
                    "profile_banner_url": "https://pbs.twimg.com/profile_banners/1323730225067339784/1611177658",
                    "profile_image_url_https": "https://pbs.twimg.com/profile_images/1308769664240160770/AfgzWVE7_normal.jpg",
                    "can_dm": false,
                    "isBlueVerified": true
                },
                {
                    "id": "44196397",
                    "name": "Elon Musk",
                    "screen_name": "elonmusk",
                    "username": null,
                    "location": "",
                    "url": null,
                    "description": "",
                    "email": null,
                    "protected": false,
                    "verified": false,
                    "followers_count": 170000000,
                    "following_count": 500,
                    "friends_count": 500,
                    "favourites_count": 20000,
                    "statuses_count": 40000,
                    "media_tweets_count": 1000,
                    "created_at": "Tue Jun 02 20:12:29 +0000 2009",
                    "profile_banner_url": "https://pbs.twimg.com/profile_banners/44196397/1690621312",
                    "profile_image_url_https": "https://pbs.twimg.com/profile_images/1683325380441128960/yRsRRjGO_normal.jpg",
                    "can_dm": false,
                    "isBlueVerified": true
                }
            ]
        }
    }
}

const UserTarget = () => {
    const [searchQuery, setSearchQuery] = useState(MOCK_DATA.data.query);

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(num);
    }

    return (
        <div className="flex min-h-screen w-full bg-[#030e17] font-sans text-gray-100">
            <Sidebar />
            <div className="flex-1 ml-20 lg:ml-80 p-4 lg:p-8 overflow-y-auto">
                {/* Header */}
                <header className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-gray-400">
                        กลุ่มเป้าหมาย
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">ค้นหาและติดตามบัญชีที่คุณสนใจ</p>
                </header>

                {/* Search Bar */}
                <div className="w-full max-w-2xl mb-8 relative group">
                    <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-lg group-hover:bg-blue-500/20 transition-all duration-300" />

                    <div className="relative flex items-center w-full">
                        {/* Wrapper Input */}
                        <div className="flex-1 relative bg-[#0f172a] border border-[#1e293b] rounded-full shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all overflow-hidden flex items-center pr-32">
                            <FaMagnifyingGlass className="absolute left-4 text-gray-400 text-lg z-10" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="ค้นหาชื่อผู้ใช้..."
                                className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 pl-12 pr-4 py-3 font-light outline-none"
                            />
                        </div>

                        {/* Button Floating absolute or just nicely positioned */}
                        <button className="absolute right-1.5 top-1.5 bottom-1.5 bg-linear-to-r cursor-pointer from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-6 rounded-full text-sm font-medium transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40">
                            ค้นหา
                        </button>
                    </div>
                </div>

                {/* Results List */}
                <div className="grid gap-4">
                    {MOCK_DATA.data.users.users.map((user) => (
                        <div key={user.id} className="group flex flex-col md:flex-row items-center gap-6 bg-[#0f172a] border border-[#1e293b] p-6 rounded-2xl hover:border-gray-600 hover:shadow-lg hover:shadow-black/20 transition-all duration-200">
                            {/* Avatar & Info */}
                            <div className="shrink-0 relative">
                                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                <img
                                    src={user.profile_image_url_https}
                                    alt={user.name}
                                    className="relative w-auto h-auto rounded-full border-4 border-[#1e293b] shadow-xl object-cover"
                                />
                                {user.isBlueVerified && (
                                    <div className="absolute bottom-1 right-1 bg-white text-blue-500 rounded-full p-0.5" title="Verified">
                                        <HiCheckBadge size={15} />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 text-center md:text-left min-w-0 w-full">
                                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2 justify-center md:justify-start">
                                    <h2 className="text-xl font-bold text-white truncate">{user.name}</h2>
                                    <span className="text-gray-500 text-sm">@{user.screen_name}</span>
                                </div>
                                <p className="text-gray-300 text-sm mb-4 line-clamp-2 font-light max-w-2xl">
                                    {user.description}
                                </p>

                                <div className="flex items-center justify-center md:justify-start gap-6 text-sm text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-white text-lg">{formatNumber(user.followers_count)}</span>
                                        <span className="text-xs">Followers</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-white text-lg">{formatNumber(user.following_count)}</span>
                                        <span className="text-xs">Following</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-white text-lg">{formatNumber(user.statuses_count)}</span>
                                        <span className="text-xs">Posts</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <div className="shrink-0 w-full md:w-auto mt-4 md:mt-0">
                                <a
                                    href={`https://twitter.com/${user.screen_name}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 bg-[#1e293b] hover:bg-blue-600/10 hover:text-blue-400 hover:border-blue-500/50 border border-gray-700 rounded-xl text-gray-300 font-medium transition-all duration-200"
                                >
                                    <FaTwitter />
                                    <span>View Profile</span>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default UserTarget;