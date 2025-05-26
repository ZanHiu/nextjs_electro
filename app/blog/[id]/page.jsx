"use client";
import { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogReview from "@/components/BlogReview";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";

const BlogDetail = () => {
	const { id } = useParams();
	const { blogs, router, reviews, fetchReviews, getReviewAmount, getReviewCount } = useAppContext();
	const [blogData, setBlogData] = useState(null);

	const fetchBlogData = async () => {
		const blog = blogs.find((blog) => blog._id === id);
		setBlogData(blog);
	};

	useEffect(() => {
		fetchBlogData();
		fetchReviews(id, "blog");
	}, [id, blogs.length]);

	return blogData ? (
		<>
			<Navbar />
			<div className="px-6 md:px-16 lg:px-32 py-14">
				{/* Blog Header */}
				<div className="max-w-4xl mx-auto">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						{blogData.name}
					</h1>

					<div className="flex items-center gap-4 text-gray-600 mb-8">
						<div className="flex items-center gap-2">
							<Image
								src={assets.calendar_icon || "/calendar-icon.png"}
								alt="Date"
								width={20}
								height={20}
							/>
							<span>{new Date(blogData.createdAt).toLocaleDateString()}</span>
						</div>
						<div className="flex items-center gap-2">
							<Image
								src={assets.user_icon || "/user-icon.png"}
								alt="Author"
								width={20}
								height={20}
							/>
							<span>{blogData.author || "Admin"}</span>
						</div>
					</div>

					{/* Featured Image */}
					<div className="w-full h-[400px] relative rounded-xl overflow-hidden mb-8">
						<Image
							src={blogData.image[0]}
							alt={blogData.name}
							fill
							className="object-cover"
						/>
					</div>

					{/* Blog Content */}
					<div className="prose prose-lg max-w-none">
						<div
							dangerouslySetInnerHTML={{ __html: blogData.content }}
							className="text-gray-700 leading-relaxed"
						/>
					</div>

					{/* Tags Section */}
					{/* <div className="mt-8 flex flex-wrap gap-2">
						{blogData.tags?.map((tag, index) => (
							<span
								key={index}
								className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
							>
								#{tag}
							</span>
						))}
					</div> */}

					<BlogReview blogId={id} />

					{/* Share Section */}
					<div className="mt-12 border-t border-gray-200 pt-8">
						<h3 className="text-xl font-semibold mb-4">Share this post</h3>
						<div className="flex gap-4">
							<button className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600">
								<Image
									src={assets.facebook_icon}
									alt="Facebook"
									width={24}
									height={24}
								/>
							</button>
							<button className="p-2 rounded-full bg-sky-500 text-white hover:bg-sky-600">
								<Image
									src={assets.twitter_icon}
									alt="Twitter"
									width={24}
									height={24}
								/>
							</button>
							<button className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600">
								<Image
									src={assets.instagram_icon}
									alt="Instagram"
									width={24}
									height={24}
								/>
							</button>
						</div>
					</div>

					{/* Related Posts */}
					<div className="mt-16">
						<h2 className="text-2xl font-bold mb-6">Related Posts</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{blogs.slice(0, 3).map((blog, index) => (
								<div
									key={index}
									className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
									onClick={() => router.push(`/blog/${blog._id}`)}
								>
									<div className="relative h-48">
										<Image
											src={blog.image[0]}
											alt={blog.name}
											fill
											className="object-cover"
										/>
									</div>
									<div className="p-4">
										<h3 className="font-semibold text-lg mb-2 line-clamp-2">
											{blog.name}
										</h3>
										<p className="text-gray-600 text-sm line-clamp-3">
											{blog.content.substring(0, 100)}...
										</p>
									</div>
								</div>
							))}
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

export default BlogDetail;
