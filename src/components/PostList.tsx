import { useState } from 'react';
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi2';

interface PostListAlbum {
    id: string;
    name: string;
    members: { id: string; name: string; avatar?: string }[];
}

const PostList = ({ showBorder = true }: { showBorder?: boolean }) => {
    const [albums, setAlbums] = useState<PostListAlbum[]>([
        {
            id: '1',
            name: 'การเมืองไทย',
            members: [
                { id: 'u1', name: 'Thairath_News', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thairath' },
                { id: 'u2', name: 'MatichonOnline', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Matichon' },
            ]
        },
        {
            id: '2',
            name: 'คริปโตวันนี้',
            members: [
                { id: 'u3', name: 'BitkubOfficial', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bitkub' },
            ]
        }
    ]);

    const [isCreating, setIsCreating] = useState(false);
    const [newAlbumName, setNewAlbumName] = useState('');

    const handleCreateAlbum = () => {
        if (!newAlbumName.trim()) return;
        const newAlbum: PostListAlbum = {
            id: Date.now().toString(),
            name: newAlbumName,
            members: []
        };
        setAlbums([...albums, newAlbum]);
        setNewAlbumName('');
        setIsCreating(false);
    };

    const handleDeleteAlbum = (id: string) => {
        setAlbums(albums.filter(a => a.id !== id));
    };

    const handleDeleteMember = (albumId: string, memberId: string) => {
        setAlbums(albums.map(a => {
            if (a.id === albumId) {
                return { ...a, members: a.members.filter(m => m.id !== memberId) };
            }
            return a;
        }));
    };

    return (
        <div className={`flex flex-col h-full bg-[#0d0d0e] ${showBorder ? 'border-l border-white/5' : ''} w-full shrink-0 animate-in fade-in duration-500`}>

            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-white/5 bg-white/2">
                <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                        <div className="w-0.5 h-4 bg-gray-500 rounded-full" />
                        <div className="w-0.5 h-4 bg-gray-500 rounded-full" />
                        <div className="w-0.5 h-4 bg-gray-500 rounded-full" />
                    </div>
                    <span className="font-bold text-gray-200">Post list</span>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="p-1.5 hover:bg-white/5 rounded-lg text-gray-400 group transition-all"
                >
                    <HiOutlinePlus className="text-xl group-hover:text-white" />
                </button>
            </div>

            {/* Create Section */}
            <div className="p-4 border-b border-white/5">
                {isCreating ? (
                    <div className="space-y-3">
                        <input
                            autoFocus
                            type="text"
                            value={newAlbumName}
                            onChange={(e) => setNewAlbumName(e.target.value)}
                            placeholder="ชื่อโพสต์ลิสต์..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsCreating(false)}
                                className="flex-1 py-2 rounded-xl text-xs font-medium text-gray-400 hover:bg-white/5 transition-all"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={handleCreateAlbum}
                                className="flex-1 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"
                            >
                                ตกลง
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsCreating(true)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-white/10 text-gray-400 hover:border-white/20 hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
                    >
                        <HiOutlinePlus />
                        <span>สร้าง Post List</span>
                    </button>
                )}
            </div>

            {/* Albums List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {albums.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center animate-in fade-in zoom-in-95 duration-700">
                        <div className="flex gap-1.5 mb-6 opacity-30 group-hover:opacity-50 transition-opacity">
                            <div className="w-1.5 h-10 bg-blue-500 rounded-full animate-pulse" />
                            <div className="w-1.5 h-10 bg-purple-500 rounded-full animate-pulse delay-75" />
                            <div className="w-1.5 h-10 bg-cyan-500 rounded-full animate-pulse delay-150" />
                        </div>
                        <h3 className="text-gray-100 font-black text-lg mb-2 tracking-tight">ไม่มีรายการ Post list</h3>
                        <p className="text-xs text-gray-500 mb-8 px-12 leading-relaxed font-medium">
                            สร้างใหม่เพื่อจัดระเบียบแหล่งข้อมูลและติดตามข่าวสารที่คุณสนใจอย่างเป็นระบบ
                        </p>
                        <button
                            onClick={() => setIsCreating(true)}
                            className="px-10 py-3 bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-2xl text-xs font-black shadow-xl shadow-blue-600/20 transition-all active:scale-95 hover:shadow-cyan-500/30"
                        >
                            + สร้างลิสต์ใหม่
                        </button>
                    </div>
                ) : (
                    albums.map((album) => (
                        <div key={album.id} className="group bg-white/2 hover:bg-white/4 border border-white/5 rounded-2xl p-4.5 hover:border-white/10 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-black/20">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="font-bold text-gray-200 text-sm">{album.name}</h4>
                                <button
                                    onClick={() => handleDeleteAlbum(album.id)}
                                    className="p-1.5 opacity-0 group-hover:opacity-100 text-gray-500 hover:text-rose-400 transition-all"
                                >
                                    <HiOutlineTrash />
                                </button>
                            </div>

                            <div className="space-y-2">
                                {album.members.map((member) => (
                                    <div key={member.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 group/item transition-all">
                                        <img
                                            src={member.avatar}
                                            alt={member.name}
                                            className="w-7 h-7 rounded-full bg-gray-800"
                                        />
                                        <span className="flex-1 text-xs text-gray-400 font-medium truncate">@{member.name}</span>
                                        <button
                                            onClick={() => handleDeleteMember(album.id, member.id)}
                                            className="p-1 text-gray-600 hover:text-rose-400 opacity-0 group-hover/item:opacity-100 transition-all"
                                        >
                                            <HiOutlineTrash className="text-xs" />
                                        </button>
                                    </div>
                                ))}
                                {album.members.length === 0 && (
                                    <p className="text-[10px] text-gray-600 italic text-center py-2">ยังไม่มีคนในลิสต์นี้</p>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default PostList;
