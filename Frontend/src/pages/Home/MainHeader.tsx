import React from "react";
import { Link } from "react-router-dom";

const MainHeader: React.FC = () => {
	return (
		<section className="container max-w-4xl text-center my-20 px-3">
			<div className="flex justify-center items-center flex-col gap-10">
				<video autoPlay loop muted playsInline className="max-w-24">
					<source src="" type="video/mp4" />
				</video>
				<h1 className="lg:text-5xl text-2xl text-gray-8">
					Welcome to Matcha!
				</h1>
				<p className="text-gray-5 text-lg">
					Because, love too can be industrialized. ❤️
				</p>
				<Link to="/login">
					<button
						className="duration-200 font-bold rounded-full bg-primary text-white border-primary border-solid border hover:bg-white hover:text-primary px-14 py-5"
						title="Start here"
					>
						Start here
					</button>
				</Link>
			</div>
		</section>
	);
};

export default MainHeader;
