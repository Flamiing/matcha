import { useState } from "react";

const Images: React.FC = ({ user }) => {
	const [modal, setModal] = useState(false);

	const showModal = () => {
		setModal(true);
	};

	const hideModal = () => {
		setModal(false);
	};

	return (
		<section className="container max-w-4xl text-center mb-10 px-3 flex justify-center">
			{modal && (
				<div
					onClick={hideModal}
					className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-full bg-black bg-opacity-50"
				>
					<div className="relative p-4 w-full max-w-2xl max-h-full">
						<div className="relative bg-white rounded-lg shadow">
							<div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
								<h3 className="text-xl font-semibold text-gray-900">
									{user.first_name}'s Images
								</h3>
								<button
									onClick={hideModal}
									className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
									data-modal-hide="default-modal"
								>
									X
								</button>
							</div>
							<div className="p-4 md:p-5 space-y-4">
								<p>Images</p>
							</div>
						</div>
					</div>
				</div>
			)}

			<button
				onClick={showModal}
				className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200"
			>
				<span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
					{user.first_name}'s Images
				</span>
			</button>
		</section>
	);
};

export default Images;
