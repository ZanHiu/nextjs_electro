"use client";
import { useEffect, useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CommentSection from "@/components/CommentSection";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import { countTimeFromNow } from "@/utils/helpers";
import axios from "axios";
import toast from "react-hot-toast";
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import Tabs from "@/components/Tabs";

const Blog = () => {
	const { id } = useParams();
	const { router, getToken, user } = useAppContext();
	const [blogData, setBlogData] = useState(null);
	const [activeTab, setActiveTab] = useState('content');
	const [showDropdown, setShowDropdown] = useState(false);
	const dropdownRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setShowDropdown(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const fetchBlogData = async () => {
		try {
			const { data } = await axios.get(
				`${process.env.NEXT_PUBLIC_API_URL}/blogs/${id}`
			);
			if (data.success) {
				setBlogData(data.blog);
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error(error.message);
		}
	};

	useEffect(() => {
		fetchBlogData();
	}, [id]);

	const handleDelete = async () => {
		if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) {
			try {
				const token = await getToken();
				const { data } = await axios.delete(
					`${process.env.NEXT_PUBLIC_API_URL}/blogs/delete/${id}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);

				if (data.success) {
					toast.success(data.message);
					router.push('/all-blogs');
				} else {
					toast.error(data.message);
				}
			} catch (error) {
				toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
			}
		}
	};

	return blogData ? (
		<>
			<Navbar />
			<div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10">
				<div className="max-w-4xl mx-auto">
					<h1 className="text-3xl font-medium text-gray-800/90 mb-4">
						{blogData.name}
					</h1>
					<div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
						<div className="flex items-center gap-2">
							<PersonOutlineOutlinedIcon sx={{ fontSize: 24 }} />
							<span>{blogData.userId?.name}</span>
						</div>
						<div className="flex items-center gap-2">
							<CalendarMonthOutlinedIcon sx={{ fontSize: 24 }} />
							<span>{countTimeFromNow(blogData.date)}</span>
						</div>
						{blogData.userId?._id === user?.id && (
							<div className="relative" ref={dropdownRef}>
								<button
									onClick={() => setShowDropdown(!showDropdown)}
									className="flex items-center"
								>
									<SettingsIcon sx={{ fontSize: 24 }} />
								</button>
								{showDropdown && (
									<div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
										<button
											onClick={() => {
												setShowDropdown(false);
												router.push(`/edit-blog/${blogData._id}`);
											}}
											className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
										>
											Sửa
										</button>
										<button
											onClick={() => {
												setShowDropdown(false);
												handleDelete();
											}}
											className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
										>
											Xóa
										</button>
									</div>
								)}
							</div>
						)}
					</div>

					<div className="w-full h-[400px] relative rounded-xl overflow-hidden mb-8">
						<Image
							src={blogData.image[0]}
							alt="alt"
							className="w-full h-full object-cover"
							fill
						/>
					</div>

					<Tabs
						tabs={[
							{ key: "content", label: "Nội dung" },
							{ key: "comments", label: "Bình luận" }
						]}
						activeTab={activeTab}
						setActiveTab={setActiveTab}
					/>

					<div className="mt-6">
						{activeTab === 'content' ? (
							<div className="prose max-w-none">
								<div dangerouslySetInnerHTML={{ __html: blogData.content }} />
							</div>
						) : (
							<CommentSection targetId={blogData._id} type="blog" />
						)}
					</div>
				</div>
			</div>
			<Footer />
		</>
	) : (
		<Loading />
	);
};

export default Blog;
