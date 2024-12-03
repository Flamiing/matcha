import React from "react";
import { useState } from "react";
import FormInput from "../../components/common/FormInput";
import MsgCard from "../../components/common/MsgCard/MsgCard";
import authApi from "../../services/api/auth";

const Form: React.FC = () => {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});

	const [msg, setMsg] = useState<{
		type: "error" | "success";
		message: string;
		key: number; // Add a key to force re-render
	} | null>(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			await authApi.login(formData.username, formData.password);
			setFormData({
				username: "",
				password: "",
			});
			window.location.href = "/profile";
		} catch (error: any) {
			const errorMessage = error.message;
			setMsg({
				type: "error",
				message: errorMessage,
				key: Date.now(),
			});
		}
	};

	return (
		<>
			{msg && (
				<MsgCard
					key={msg.key}
					type={msg.type}
					message={msg.message}
					onClose={() => setMsg(null)}
				/>
			)}
			<form
				onSubmit={submitForm}
				className="bg-white shadow-md flex flex-col gap-8 p-10 rounded max-w-3xl items-center"
			>
				<p>Enter you credentials to access your account</p>
				<FormInput
					name="username"
					onChange={handleChange}
					value={formData.username}
					placeholder="Username*"
				/>
				<FormInput
					name="password"
					onChange={handleChange}
					value={formData.password}
					type="password"
					placeholder="Password*"
				/>
				<button className="w-fit duration-200 font-bold rounded-full bg-primary text-white border-primary border-solid border hover:bg-white hover:text-primary px-5 py-3">
					Access Account
				</button>
			</form>
		</>
	);
};

export default Form;
