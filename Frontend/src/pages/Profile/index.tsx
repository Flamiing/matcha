import { useState } from "react";
import Face from "./Face";
import Body from "./Body";
import Info from "./Info";

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
	const [userData, setUserData] = useState<UserData>({
		username: "SupperDupper",
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
			<div>
				<Face user={userData} />
				<Body user={userData} />
				<Info user={userData} />
			</div>
		</main>
	);
};

export default index;
