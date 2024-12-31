import React from "react";

const StyledButton: React.FC = ({ value }) => {
	return (
		<>
			<button
				type="button"
				title={value}
				className="text-white bg-gradient-to-br from-primary to-tertiary hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 font-bold rounded-lg text-sm px-14 py-5 text-center"
			>
				{value}
			</button>
		</>
	);
};

export default StyledButton;
