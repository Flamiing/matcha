interface UserData {
	first_name: string;
	second_name: string;
	username: string;
	email: string;
	age: number;
	biography: string;
	fame: number;
	last_online: number;
	gender: string;
	sexual_preference: string;
}

interface FaceProps {
	user: UserData;
}

const Face: React.FC<FaceProps> = ({ user }) => {
	return (
		<section className="container max-w-4xl text-center mt-20 px-3">
			<div className="flex flex-col items-center gap-7">
				<div>
					<img
						src="/person.png"
						alt="UserProfile"
						className="w-36 rounded-full border shadow-lg h-36 object-cover"
					/>
				</div>
				<div className="flex flex-col gap-2">
					<p className="text-3xl font-semibold">
						{user.username},{" "}
						<span className="text-gray-500 text-2xl">
							{user.age}
						</span>
					</p>
					<div className="flex gap-1 flex-wrap justify-center">
						<p className="text-sm font-light text-gray-500">
							{user.first_name}
						</p>
						<p className="text-sm font-light text-gray-500">
							{user.second_name}
						</p>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Face;
