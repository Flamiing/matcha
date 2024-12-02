import React from "react";
import FormInput from "../../components/common/FormInput";

const Form: React.FC = () => {
	return (
		<form className="bg-white shadow-md flex flex-col gap-8 p-10 rounded max-w-3xl items-center">
			<p>Enter you credentials to access your account</p>
			<FormInput type="email" placeholder="E-mail address*"></FormInput>
			<FormInput type="password" placeholder="Password*"></FormInput>
			<button className="w-fit duration-200 font-bold rounded-full bg-primary text-white border-primary border-solid border hover:bg-white hover:text-primary px-5 py-3">
				Access Account
			</button>
		</form>
	);
};

export default Form;
