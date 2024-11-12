import React from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
	const location = useLocation();

	return (
		<header className="bg-primary p-4">
			<div className="container mx-auto lx:p-7 py-5">
				<div className="flex md:justify-between items-center flex-wrap justify-center shadow-sm">
					<h1 className="text-2xl font-bold">
						<Link to="/">Matcha</Link>
					</h1>
					<nav className="flex text-gray-7 justify-evenly flex-1">
						<Link to="/" className>
							<button className="btn whitespace-nowrap text-base px-8 py-3 rounded-full hover:ease-in-out hover:bg-gray-200">
								Home
							</button>
						</Link>
						<Link to="/browse" className>
							<button className="btn whitespace-nowrap text-base px-8 py-3 rounded-full hover:ease-in-out hover:bg-gray-200">
								Browse
							</button>
						</Link>
						<Link to="/profile" className>
							<button className="btn whitespace-nowrap text-base px-8 py-3 rounded-full hover:ease-in-out hover:bg-gray-200">
								Profile
							</button>
						</Link>
					</nav>
					<div className="flex items-center gap-12 text-sm">
						<Link to="/login" className="btn btn-primary">
							Login
						</Link>
						<Link to="/register" className="btn btn-secondary">
							Register
						</Link>
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
