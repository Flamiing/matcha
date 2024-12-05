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

interface InfoProps {
	user: UserData;
}

const Info: React.FC<InfoProps> = ({ user }) => {
	return (
		<section className="container max-w-4xl text-center my-20 px-3">
			<div className="flex flex-col items-center gap-7">
				<div className="flex gap-2 justify-center items-center">
					<p className="font-semibold text-lg tracking-wide underline">{user.gender}</p>
					<p className="font-light">looking for</p>
					<p className="font-semibold text-lg tracking-wide underline">
						{/* Added check to replace 'Bisexual' with more readable text */}
						{user.sexual_preference === "Bisexual" ?
							"Male & Female"
							:
							user.sexual_preference
						}</p>
				</div>
				<div className="container max-w-2xl text-pretty tracking-wide">
					{user.biography}
				</div>
			</div>
		</section>
	);
};

export default Info;
