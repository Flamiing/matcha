import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";

const Layout = () => {
	const location = useLocation();

	return (
		<div className="min-h-screen flex flex-col">
			<Header />
			<Outlet />
			<Footer />
		</div>
	);
};

export default Layout;
