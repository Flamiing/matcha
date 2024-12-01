import React from "react";
import { useState } from "react";
import FormInput from "../../components/common/FormInput";
import authApi from "../../services/api/auth";

const Form: React.FC = () => {
	const [formData, setFormData] = useState({
		username: "",
		firstName: "",
		lastName: "",
		email: "",
		password: "",
	});

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
		} catch (error) {
			console.error(error);
		}
	};

	return (
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
				name="firstName"
				onChange={handleChange}
				value={formData.firstName}
				placeholder="First Name*"
			/>
			<FormInput
				name="lastName"
				onChange={handleChange}
				value={formData.lastName}
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
	);
};

export default Form;
