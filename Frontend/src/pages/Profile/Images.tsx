import { useState } from "react";

interface User {
	first_name: string;
	images: string[]; // array of image URLs
}

interface ImageGalleryProps {
	user: User;
}

const ImageGallery = ({ user }: ImageGalleryProps) => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<section className="container max-w-4xl mx-auto mb-10 px-3 flex justify-center">
			{/* Modal */}
			{isModalOpen && (
				<div
					onClick={() => setIsModalOpen(false)}
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-y-auto p-4"
				>
					<div
						className="relative w-full max-w-3xl"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="relative bg-white rounded-xl shadow-lg">
							{/* Modal Header */}
							<div className="flex items-center justify-between p-4 border-b">
								<h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
									<span className="fa fa-image" />
									{user.first_name}'s Images
								</h3>
								<button
									onClick={() => setIsModalOpen(false)}
									className="p-2 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
								>
									<span className="fa fa-close" />
								</button>
							</div>

							{/* Modal Content */}
							<div className="p-4 md:p-6">
								{user.images && user.images.length > 0 ? (
									<div className="flex flex-wrap gap-2 md:gap-4 justify-center">
										{user.images.map((imageUrl, index) => (
											<div
												key={index}
												className="w-[calc(50%-0.5rem)] md:w-[calc(33.333%-1rem)] flex-grow-0 flex-shrink-0"
											>
												<div className="relative pt-[100%]">
													<img
														src={imageUrl}
														alt={`${
															user.first_name
														}'s image ${index + 1}`}
														className="absolute inset-0 w-full h-full object-cover rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
													/>
												</div>
											</div>
										))}
									</div>
								) : (
									<div className="text-center py-8 text-gray-500">
										<span className="fa fa-image" />
										<p>No images uploaded yet</p>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Trigger Button */}
			<button
				onClick={() => setIsModalOpen(true)}
				className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 p-0.5 font-medium text-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-cyan-200"
			>
				<span className="flex items-center gap-2 rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0">
					<span className="fa fa-image" />
					{user.first_name}'s Images
				</span>
			</button>
		</section>
	);
};

export default ImageGallery;
