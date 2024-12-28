import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Face from "./Face";
import Body from "./Body";
/* import Body from "./Body";
import Info from "./Info";
import Images from "./Images";
import TagSection from "./TagSection"; */

interface ProfileFormData {
	username: string;
	firstName: string;
	lastName: string;
	email: string;
	age: number;
	biography: string;
	gender: string;
	sexualPreference: string;
	location: string;
	images: string[];
	profilePicture: string;
}

const index = () => {
	/* const { user } = useAuth(); */

	const [formData, setFormData] = useState<UserData>({
		username: "alaparic",
		email: "test@test.com",
		first_name: "Dennis",
		second_name: "Bateman",
		age: 27,
		biography:
			"Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime iusto accusamus quae. Tenetur sed temporibus odio consectetur natus perferendis atque facilis tempore velit quidem magnam delectus, quam ex qui architecto?",
		gender: "",
		sexual_preference: "",
		location: "",
		images: [],
		profilePicture: "/person.png",
	});

	const genderOptions = [
		{ value: "Male", label: "Male" },
		{ value: "Female", label: "Female" },
	];

	const preferenceOptions = [
		{ value: "Male", label: "Male" },
		{ value: "Female", label: "Female" },
		{ value: "Both", label: "Both" },
	];

	const [errors, setErrors] = useState<Partial<UserData>>({});

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleImageUpload = async (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const files = e.target.files;
		if (!files) return;

		const file = files[0];
		if (!file) return;

		// Validate file type and size
		const validTypes = ["image/jpeg", "image/png", "image/jpg"];
		if (!validTypes.includes(file.type)) {
			setErrors((prev) => ({
				...prev,
				images: "Invalid file type. Please upload JPG or PNG images.",
			}));
			return;
		}

		const maxSize = 5 * 1024 * 1024; // 5MB
		if (file.size > maxSize) {
			setErrors((prev) => ({
				...prev,
				images: "File too large. Maximum size is 5MB.",
			}));
			return;
		}

		setIsUploading(true);
		//Todo: setup image upload to api
		
		setFormData((prev) => ({
			...prev,
			images: [...prev.images, "person.png"],
		}));
	};

	return (
		<main className="flex flex-1 justify-center items-center flex-col">
			<div className="w-full bg-gradient-to-br from-orange-200 to-purple-200 flex flex-col items-center gap-12 pb-5">
				<Face user={formData} onImagesUpdate={handleImageUpload} />
			</div>

			<Body user={formData} />
			{/* <Images user={userData} />
			<Info user={userData} />
			<TagSection tags={userData.tags} /> */}
		</main>
	);
};

export default index;
