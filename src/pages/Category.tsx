import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaLayerGroup, FaTimes } from 'react-icons/fa';
import Sidebar from '../components/Layouts/Sidebar';
import type { Category as CategoryType } from '../interface/category';
import * as itemService from '../api/category';

// Schema Validation
const categorySchema = z.object({
    name: z.string().min(1, 'กรุณาระบุชื่อหมวดหมู่'),
});

type CategoryFormInput = z.infer<typeof categorySchema>;

const Category = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [filteredCategories, setFilteredCategories] = useState<CategoryType[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal State
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryType | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<CategoryFormInput>({
        resolver: zodResolver(categorySchema),
    });

    // Fetch Data
    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await itemService.getCategories();
            setCategories(data);
            setFilteredCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('ไม่สามารถโหลดข้อมูลหมวดหมู่ได้');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Filter Logic
    useEffect(() => {
        const filtered = categories.filter((cat) =>
            cat.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredCategories(filtered);
    }, [searchQuery, categories]);

    // Handlers
    const handleOpenAddModal = () => {
        setEditingCategory(null);
        reset({ name: '' });
        setIsFormModalOpen(true);
    };

    const handleOpenEditModal = (category: CategoryType) => {
        setEditingCategory(category);
        setValue('name', category.name);
        setIsFormModalOpen(true);
    };

    const handleCloseFormModal = () => {
        setIsFormModalOpen(false);
        reset();
    };

    const onSubmit = async (data: CategoryFormInput) => {
        try {
            if (editingCategory) {
                await itemService.updateCategory(editingCategory.id, data);
                toast.success('แก้ไขหมวดหมู่สำเร็จ');
            } else {
                await itemService.createCategory(data);
                toast.success('เพิ่มหมวดหมู่สำเร็จ');
            }
            fetchCategories();
            handleCloseFormModal();
        } catch (error) {
            console.error(error);
            toast.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        }
    };

    const handleOpenDeleteModal = (id: number) => {
        setCategoryToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (categoryToDelete === null) return;
        try {
            await itemService.deleteCategory(categoryToDelete);
            toast.success('ลบหมวดหมู่สำเร็จ');
            fetchCategories();
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error(error);
            toast.error('ไม่สามารถลบหมวดหมู่ได้');
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-[#030e17] font-sans text-gray-100">
            <Sidebar />
            <div className="flex-1 ml-20 lg:ml-80 p-4 lg:p-8 overflow-y-auto relative">
                <div className="space-y-6">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#1e293b]/50 p-6 rounded-2xl backdrop-blur-sm border border-slate-700/50 shadow-xl">
                        <div>
                            <h1 className="text-3xl font-bold bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent flex items-center gap-3">
                                <FaLayerGroup className="text-blue-500" />
                                จัดการหมวดหมู่
                            </h1>
                            <p className="text-slate-400 mt-1">จัดการข้อมูลหมวดหมู่ทั้งหมดในระบบ</p>
                        </div>
                        <button
                            onClick={handleOpenAddModal}
                            className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 font-medium cursor-pointer"
                        >
                            <FaPlus className="text-sm group-hover:rotate-90 transition-transform duration-300" />
                            เพิ่มหมวดหมู่
                        </button>
                    </div>

                    {/* Search & Filter */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FaSearch className="text-slate-500" />
                        </div>
                        <input
                            type="text"
                            placeholder="ค้นหาหมวดหมู่..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-[#1e293b]/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-500 text-slate-200"
                        />
                    </div>


                    {/* Content Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-40 bg-[#1e293b] rounded-2xl"></div>
                            ))}
                        </div>
                    ) : filteredCategories.length === 0 ? (
                        <div className="text-center py-20 bg-[#1e293b]/30 rounded-3xl border border-dashed border-slate-700">
                            <FaLayerGroup className="mx-auto text-6xl text-slate-600 mb-4" />
                            <h3 className="text-xl font-medium text-slate-400">ไม่พบหมวดหมู่</h3>
                            <p className="text-slate-500">ลองเพิ่มหมวดหมู่ใหม่ หรือค้นหาคำอื่น</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredCategories.map((category) => (
                                <div
                                    key={category.id}
                                    onClick={() => navigate(`/category-news/${category.id}`)}
                                    className="group bg-[#1e293b] hover:bg-[#253248] border border-slate-700/50 hover:border-blue-500/30 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 relative overflow-hidden cursor-pointer"
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenEditModal(category);
                                            }}
                                            className="p-2 bg-slate-700/50 hover:bg-blue-500/20 text-slate-400 hover:text-blue-400 rounded-lg transition-colors"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenDeleteModal(category.id);
                                            }}
                                            className="p-2 bg-slate-700/50 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-4 mb-4">
                                        <h3 className="text-lg font-semibold text-white truncate flex-1">
                                            {category.name}
                                        </h3>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-slate-700/50 flex justify-between text-xs text-slate-500">
                                        <span>{new Date(category.created_at || Date.now()).toLocaleDateString('th-TH')}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </div>

            {/* Form Modal */}
            {isFormModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-[#1e293b] w-full max-w-md rounded-2xl shadow-2xl border border-slate-700 overflow-hidden transform transition-all scale-100 animate-scale-in">
                        <div className="px-6 py-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
                            <h3 className="text-xl font-semibold text-white">
                                {editingCategory ? 'แก้ไขหมวดหมู่' : 'เพิ่มหมวดหมู่ใหม่'}
                            </h3>
                            <button onClick={handleCloseFormModal} className="text-slate-400 hover:text-white transition-colors">
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">ชื่อหมวดหมู่ <span className="text-red-400">*</span></label>
                                <input
                                    {...register('name')}
                                    className={`w-full px-4 py-3 bg-slate-900/50 border ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-slate-600 focus:ring-blue-500'} rounded-xl focus:border-transparent focus:ring-2 outline-none transition-all text-white placeholder-slate-500`}
                                    placeholder="เช่น เทคโนโลยี, กีฬา, ทั่วไป"
                                />
                                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={handleCloseFormModal}
                                    className="px-5 py-2.5 rounded-xl text-slate-300 hover:bg-slate-700 hover:text-white transition-all font-medium"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            กำลังบันทึก...
                                        </>
                                    ) : (
                                        <>
                                            <FaCheckCircle className="text-sm" />
                                            บันทึกข้อมูล
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#1e293b] w-full max-w-sm rounded-2xl shadow-2xl border border-slate-700 p-6 text-center transform transition-all scale-100">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaTrash className="text-2xl text-red-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">ยืนยันการลบ?</h3>
                        <p className="text-slate-400 mb-6">คุณจต้องการลบหมวดหมู่นี้ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้</p>

                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-5 py-2.5 rounded-xl text-slate-300 hover:bg-slate-700 hover:text-white transition-all font-medium"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all font-medium"
                            >
                                ลบข้อมูล
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper component for icon
const FaCheckCircle = ({ className }: { className?: string }) => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className={className} height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628 0z"></path></svg>
);

export default Category;