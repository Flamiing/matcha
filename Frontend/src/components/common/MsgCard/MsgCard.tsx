import React, { useEffect } from "react";

interface MsgCardProps {
	type: "error" | "success" | "info" | "warning";
	msg: string;
	onClose: () => void;
}

const MsgCard: React.FC<MsgCardProps> = ({ type, msg, onClose }) => {
	let className =
		"rounded py-4 px-8 ml-4 border fixed bottom-4 right-4 shadow-lg xl:w-1/4 lg:w-1/3 md:w-1/2 sm:w-3/4 w-fit flex items-center transition-all ";
	let title = "";

	if (type === "error") {
		className += "bg-red-50 text-red-700 border-red-200";
		title = "Error";
	} else if (type === "warning") {
		className += "bg-yellow-50 text-yellow-700 border-yellow-200";
		title = "Warning";
	} else if (type === "info") {
		className += "bg-blue-50 text-blue-700 border-blue-200";
		title = "Info";
	} else {
		className += "bg-green-50 text-green-700 border-green-200";
		title = "Success";
	}

	useEffect(() => {
		const timer = setTimeout(onClose, 5000);
		return () => clearTimeout(timer);
	}, [onClose]);

	return (
		<div className={className}>
			<div className="w-full text-start">
				<h3 className="text-xl">{title}</h3>
				<p className="text-wrap">{msg}</p>
			</div>
			<button onClick={onClose} className="ml-4 text-lg font-bold">
				&times;
			</button>
		</div>
	);
};

export default MsgCard;
