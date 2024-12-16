import { timeAgo } from "../../hooks/timeAgo";
import { Link } from "react-router-dom";

interface CompactUserCardProps {
	user: {
		username: string;
		first_name: string;
		age: number;
		last_online: number;
		images: string[];
	};
}

const CompactUserCard = ({ user }: CompactUserCardProps) => {
	return (
		<Link
			to={`/profile/${user.username}`}
			className="block aspect-square hover:transform hover:-translate-y-1 transition-all duration-200 h-80 w-80"
		>
			<div className="relative h-full bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
				{/* Main Image */}
				<div className="absolute inset-0">
					<img
						src={"/person.png"}
						alt={`${user.first_name}'s profile`}
						className="w-full h-full object-cover"
					/>
					{/* Gradient Overlay */}
					<div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
				</div>

				{/* Content Overlay */}
				<div className="absolute bottom-0 left-0 right-0 p-3 text-white">
					<h2 className="text-lg font-semibold">
						{user.first_name}, {user.age}
					</h2>
					<div className="flex items-center gap-2 text-xs text-gray-200 mt-1">
						{Date.now() - user.last_online ? (
							<span className="fa fa-clock-o w-3 h-3" />
						) : (
							<div className="w-2 h-2 bg-green-500 rounded-full ring-2 ring-white" />
						)}
						{timeAgo(user.last_online)}
					</div>
				</div>

				{/* Online Status Indicator */}
			</div>
		</Link>
	);
};

export default CompactUserCard;
