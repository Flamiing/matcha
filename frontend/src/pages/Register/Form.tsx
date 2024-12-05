import React from "react";
import { useState } from "react";
import FormInput from "../../components/common/FormInput";
import authApi from "../../services/api/auth";
import MsgCard from "../../components/common/MsgCard";

const Form: React.FC = () => {
	const [formData, setFormData] = useState({
		username: "",
		first_name: "",
		last_name: "",
		email: "",
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
			await authApi.register(formData);
			setFormData({
				username: "",
				first_name: "",
				last_name: "",
				email: "",
				password: "",
			});
			setMsg({
				type: "success",
				message:
					"User registered successfully. Please confirm your email.",
				key: Date.now(), // Use timestamp as key
			});
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
				<p>Create your account to start meeting people</p>
				<FormInput
					name="username"
					onChange={handleChange}
					value={formData.username}
					placeholder="Username*"
				/>
				<FormInput
					name="first_name"
					onChange={handleChange}
					value={formData.first_name}
					placeholder="First Name*"
				/>
				<FormInput
					name="last_name"
					onChange={handleChange}
					value={formData.last_name}
					placeholder="Last Name*"
				/>
				<FormInput
					name="email"
					onChange={handleChange}
					value={formData.email}
					type="email"
					placeholder="E-mail address*"
				/>
				<FormInput
					name="password"
					onChange={handleChange}
					value={formData.password}
					type="password"
					placeholder="Password*"
				/>
				<button className="w-fit duration-200 font-bold rounded-full bg-primary text-white border-primary border-solid border hover:bg-white hover:text-primary px-5 py-3">
					Create Account
				</button>
			</form>
		</>
	);
};

export default Form;
