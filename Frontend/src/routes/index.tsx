import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layout/Layout";
import ProtectedRoute from "./ProtectedRoute";
import Home from "../pages/Home";
import Login from "../pages/LogIn";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import ProfileEdit from "../pages/ProfileEdit";
import NotFound from "../pages/NotFound";
import Oauth from "../pages/Callbacks/Oauth";
import ConfirmEmail from "../pages/Callbacks/ConfirmEmail";
import Browse from "../pages/Browse";

const protectedRoutes = {
	profile: {
		path: "profile",
		element: <Profile />,
	},
	profileEdit: {
		path: "profile/edit",
		element: (
				<ProfileEdit />
		),
	},
	browse: {
		path: "browse",
		element: <Browse />,
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
};

const callbackRoutes = {
	oauth: {
		path: "auth/oauth/callback",
		element: <Oauth />,
	},
	confirmEmail: {
		path: "auth/email/callback",
		element: <ConfirmEmail />,
	},
};

// 404 default route if not found
const defaultRoute = {
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
			...Object.values(callbackRoutes),
			...Object.values(defaultRoute),
		],
	},
]);

export const routes = {
	...publicRoutes,
	...protectedRoutes,
	...callbackRoutes,
	...defaultRoute,
};
