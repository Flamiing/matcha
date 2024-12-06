import React from "react";

const Oauth42: React.FC = ({ action }) => {
	return (
		<button
			type="button"
			className="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
		>
			<img
				src="https://upload.wikimedia.org/wikipedia/commons/8/8d/42_Logo.svg"
				alt="42Intra"
				className="w-5 h-5 invert"
			/>
			<span className="ms-2 h-fit">{action} with 42</span>
		</button>
	);
};

export default Oauth42;
