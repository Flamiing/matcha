import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import authApi from "../../../services/api/auth";
import RegularButton from "../../../components/common/RegularButton";

const Index: React.FC = () => {
	const { isAuthenticated, loading } = useAuth();
	const [pageMsg, setPageMsg] = useState<string>(
		"Authenticating you... hold on..."
	);
	const [error, setError] = useState<string>("");

	useEffect(() => {
		const authenticate = async () => {
			const urlParams = new URLSearchParams(window.location.search);
			const code = urlParams.get("code");
			if (code) {
				const { success, message } = await authApi.oauth(code);
				if (success) {
					setPageMsg("You are now authenticated. Redirecting...");
					setTimeout(() => {
						window.location.href = "/profile";
					}, 1000);
				} else {
					setPageMsg(message);
					setError("text-red-400");
				}
			} else {
				setPageMsg("No code provided. Try to login again.");
				setError("text-red-400");
			}
		};

		authenticate();
	}, []);

	return (
		<main className="m-auto">
			<h1 className={`text-xl font-bold ${error}`}>{pageMsg}</h1>
			{error !== "" && (
				<div className="mx-auto w-fit mt-7">
					<RegularButton
						callback={() => {
							window.location.href = "/login";
						}}
						value="Back to login from"
					/>
				</div>
			)}
		</main>
	);
};

export default Index;
