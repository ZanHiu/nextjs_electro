import React from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { formatDate } from "@/utils/format";
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';

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
				{/* Blog Title */}
				<h3 className="font-semibold text-xl mb-3 line-clamp-2 hover:text-orange-600 transition">
					{blog.name}
				</h3>

				{/* Blog Excerpt */}
				<div className="flex items-center justify-between">
					{/* Read More Link */}
					<button className="flex items-center gap-2 text-orange-600 hover:text-orange-700 transition group">
						Đọc thêm
					</button>
					<div className="flex items-center gap-1 text-sm text-gray-500">
						<CalendarMonthOutlinedIcon sx={{ fontSize: 20 }} />
						<span>{formatDate(blog.date)}</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BlogCard;
