import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layout/Layout";
import ProtectedRoute from "./ProtectedRoute";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";
import Oauth from "../pages/Callbacks/Oauth";
import ConfirmEmail from "../pages/Callbacks/ConfirmEmail";

const protectedRoutes = {
	profile: {
		path: "profile",
		element: (
			<ProtectedRoute>
				<Profile />
			</ProtectedRoute>
		),
	},
};

const publicRoutes = {
	home: {
		index: true,
		element: <Home />,
	},
	login: {
		path: "login",
		element: <Login />,
	},
	register: {
		path: "register",
		element: <Register />,
	},
	// confirm oauth callback
	oauth: {
		path: "auth/oauth/callback",
		element: <Oauth />,
	},
	confirmEmail: {
		path: "auth/email/callback",
		element: <ConfirmEmail />,
	},
	// 404 default route if not found
	notFound: {
		path: "*",
		element: <NotFound />,
	},
};

export const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		children: [
			...Object.values(publicRoutes),
			...Object.values(protectedRoutes),
		],
	},
]);

export const routes = {
	...publicRoutes,
	...protectedRoutes,
};
