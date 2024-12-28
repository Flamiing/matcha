import React from "react";

const LikesAndViews: React.FC = () => {
	return (
		<div>
			{/* Trigger Button */}
			<button
				onClick={() => setIsModalOpen(true)}
				className="inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-purple-200"
			>
				<span className="flex items-center gap-2 rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0">
					<span className="fa fa-heart" />
					Your likes & views
				</span>
			</button>
		</div>
	);
};

export default LikesAndViews;
