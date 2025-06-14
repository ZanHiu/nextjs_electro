"use client";
import { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CommentSection from "@/components/CommentSection";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import { formatDateTime } from "@/utils/format";

const Blog = () => {
	const { id } = useParams();
	const { blogs } = useAppContext();
	const [blogData, setBlogData] = useState(null);
	const [activeTab, setActiveTab] = useState('content');

	const fetchBlogData = async () => {
		const blog = blogs.find((blog) => blog._id === id);
		setBlogData(blog);
	};

	useEffect(() => {
		fetchBlogData();
	}, [id, blogs.length]);

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
							<Image
								src={assets.user_icon || "/user-icon.png"}
								alt="Author"
								width={20}
								height={20}
							/>
							<span>{blogData.author || "Admin"}</span>
						</div>
						<div className="flex items-center gap-2">
							<Image
								src={assets.calendar_icon || "/calendar-icon.png"}
								alt="Date"
								width={20}
								height={20}
							/>
							<span>{formatDateTime(blogData.date)}</span>
						</div>
					</div>

					{/* Featured Image */}
					<div className="w-full h-[400px] relative rounded-xl overflow-hidden mb-8">
						<Image
							src={blogData.image[0]}
							alt={blogData.name}
							className="w-full h-full object-cover"
							fill
						/>
					</div>

					<div className="mt-10">
						<div className="border-b border-gray-200">
							<nav className="-mb-px flex space-x-8" aria-label="Tabs">
								<button
									onClick={() => setActiveTab('content')}
									className={`${
										activeTab === 'content'
											? 'border-orange-500 text-orange-600'
											: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
									} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
								>
									Nội dung
								</button>
								<button
									onClick={() => setActiveTab('comments')}
									className={`${
										activeTab === 'comments'
											? 'border-orange-500 text-orange-600'
											: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
									} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
								>
									Bình luận
								</button>
							</nav>
						</div>
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
			</div>
			<Footer />
		</>
	) : (
		<Loading />
	);
};

export default Blog;
