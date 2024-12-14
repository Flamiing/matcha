import React from "react";

const RegularButton: React.FC = ({ value, callback }) => {
	return (
		<>
			<button
				type="button"
				title={value}
				className="w-fit duration-200 font-bold rounded-full bg-primary text-white border-primary border-solid border hover:bg-white hover:text-primary px-5 py-3"
				onClick={callback}
			>
				{value}
			</button>
		</>
	);
};

export default RegularButton;
