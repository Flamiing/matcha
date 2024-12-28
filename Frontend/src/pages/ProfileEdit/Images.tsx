import { useState } from "react";

interface User {
	first_name: string;
	images: string[]; // array of image URLs
}

interface ImageGalleryProps {
	user: User;
}

const ImageGallery = ({ user, images, onImagesUpdate }: ImageGalleryProps) => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const imagesList = [
		"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn1.matadornetwork.com%2Fblogs%2F1%2F2024%2F02%2Fcherry-blossoms-bike-ride-1.jpg&f=1&nofb=1&ipt=154498e6af1a251026eb3331fbe588f58febbbf00d3e4d1e82356aa4df179b2a&ipo=images",
		"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.wallpaperflare.com%2Fstatic%2F173%2F680%2F888%2Fvancouver-canada-panoramic-view-city-river-wallpaper.jpg&f=1&nofb=1&ipt=40cea784189c2794d599d5e1fd0445710add1807e0d89d8445dca03c6bcf04af&ipo=images",
		"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.travelandleisure.com%2Fthmb%2F2rL0_3WlarpxlX2jJfqDi1DH2Kw%3D%2F1500x0%2Ffilters%3Ano_upscale()%3Amax_bytes(150000)%3Astrip_icc()%2FTAL-vancouver-science-center-TODOVANCOUVER0723-373ccb7bf8b94f0b92092d39713139ea.jpg&f=1&nofb=1&ipt=83dba252e90d0c5bf0ab3a36febfef1a0d6d55c8b992f9dcc1e102b346a23a69&ipo=images",
	]

	/* const handleImageUpload = {
		// Implement image upload logic here
		onImagesUpdate([...images, data.url]);
	} */

	return (
		<section className="container max-w-4xl mx-auto flex justify-center">
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
									{/* Upload new picture button */}
									{user.images.length > 5 && (
										<div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
											<label className="cursor-pointer text-center">
												<input
													type="file"
													accept="image/*"
													onChange={handleImageUpload}
													className="hidden"
												/>
												<i className="fa fa-plus text-3xl text-gray-400 mb-2" />
												<p className="text-sm text-gray-500">
													Add Image
												</p>
											</label>
										</div>
									)}

									<div className="flex items-center justify-center w-[calc(50%-0.5rem)] h-auto md:w-[calc(33.333%-1rem)] flex-grow-0 flex-shrink-0 border-2 border-dashed border-gray-300 rounded-lg shadow-sm">
										<div className="w-full h-full">
											<span className="fa fa-plus text-6xl text-gray-300 inset-1/3  hover:opacity-90" />
										</div>
									</div>
								</div>
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
					Update pictures
				</span>
			</button>
		</section>
	);
};

export default ImageGallery;
