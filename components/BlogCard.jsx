import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";

const BlogCard = ({ blog }) => {
	const { router } = useAppContext();

	return (
		<div
			onClick={() => {
				router.push("/blog/" + blog._id);
				scrollTo(0, 0);
			}}
			className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
		>
			<div className="relative overflow-hidden aspect-w-16 aspect-h-9">
				<Image
					src={blog.image[0]}
					alt={blog.slug}
					width={400}
					height={300}
					className="w-full h-full object-cover hover:scale-105 transition duration-300"
				/>
			</div>

			<div className="p-6">
				{/* Blog Meta Info */}
				<div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
					<div className="flex items-center gap-1">
						<Image
							src={assets.calendar_icon}
							alt="Date"
							width={16}
							height={16}
						/>
						<span>{new Date(blog.createdAt).toLocaleDateString()}</span>
					</div>
					<div className="flex items-center gap-1">
						<Image
							src={assets.user_icon}
							alt="Author"
							width={16}
							height={16}
						/>
						<span>{blog.author || "Admin"}</span>
					</div>
				</div>

				{/* Blog Title */}
				<h3 className="font-semibold text-xl mb-3 line-clamp-2 hover:text-orange-600 transition">
					{blog.name}
				</h3>

				{/* Blog Excerpt */}
				<p className="text-gray-600 text-sm mb-4 line-clamp-3">
					{blog.content.substring(0, 100)}...
				</p>

				{/* Read More Link */}
				<button className="flex items-center gap-2 text-orange-600 hover:text-orange-700 transition group">
					Read more
					<Image
						className="h-3 w-3 group-hover:translate-x-1 transition-transform"
						src={assets.redirect_icon}
						alt="Redirect Icon"
					/>
				</button>
			</div>
		</div>
	);
};

export default BlogCard;
