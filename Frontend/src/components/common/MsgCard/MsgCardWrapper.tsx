import React, { useState } from "react";
import MsgCard from "./MsgCard";

interface MsgCardWrapperProps {
	type: "error" | "success" | "info" | "warning";
	msg: string;
}

const MsgCardWrapper: React.FC<MsgCardWrapperProps> = ({ type, msg }) => {
	const [showMsgCard, setShowMsgCard] = useState(true);

	const handleClose = () => {
		setShowMsgCard(false);
	};

	return (
		<>
			{showMsgCard && (
				<MsgCard type={type} msg={msg} onClose={handleClose} />
			)}
		</>
	);
};

export default MsgCardWrapper;
