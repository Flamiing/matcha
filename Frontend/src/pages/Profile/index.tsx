import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Face from "./Face";
import Body from "./Body";
import Info from "./Info";
import Images from "./Images";

interface UserData {
	username: string;
	email: string;
	first_name: string;
	second_name: string;
	age: number;
	biography: string;
	fame: number;
	last_online: number;
	gender: string;
	sexual_preference: string;
}

const index = () => {
	const { user } = useAuth();

	const [userData, setUserData] = useState<UserData>({
		username: user.username,
		email: "testing@telefonica.com",
		first_name: "Dennis",
		second_name: "Bateman",
		age: 27,
		biography:
			"Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime iusto accusamus quae. Tenetur sed temporibus odio consectetur natus perferendis atque facilis tempore velit quidem magnam delectus, quam ex qui architecto?",
		fame: 125,
		last_online: Date.now(),
		/* last_online: Date.now() - 5 * 60 * 1000, */
		gender: "Male",
		sexual_preference: "Female",
	});

	return (
		<main className="flex flex-1 justify-center items-center flex-col">
			<div className="w-full bg-secondary flex flex-col items-center gap-12">
				<Face user={userData} />
				<Body user={userData} />
				<Images user={userData} />
			</div>
			<Info user={userData} />
		</main>
	);
};

export default index;
