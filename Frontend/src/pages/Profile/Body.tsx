import { timeAgo } from "../../hooks/timeAgo";

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
		<section className="container max-w-4xl text-center my-20 px-3 flex justify-center">
			<div className="flex flex-row justify-center gap-3 border-y border-black w-fit py-5">
				<div className="relative w-0 h-0">
					<p className="absolute left-10 -top-4 -z-10 opacity-50 text-7xl">🔥</p>
				</div>
				<div className="w-32">
					<p className="z-10 text-xl font-bold font-mono">{user.fame}</p>
					<p className="font-bold">Fame</p>
				</div>
				<div className="w-[2px] bg-black"></div>
				<div className="w-32 flex items-center justify-center">
					{(timeAgo(user.last_online) === 'Currently online') ?
						<div className="ml-3 flex items-center justify-center">
							<div className="relative w-0 h-0">
								<div className="absolute right-1 -top-1 w-2 h-2 bg-green-500 rounded-full"></div>
							</div>
							<p className="font-light">
								{timeAgo(user.last_online)}
							</p>
						</div>
						:
						<p className="font-light">
							{timeAgo(user.last_online)}
						</p>
					}

				</div>
			</div>
		</section>
	);
};

export default Face;
