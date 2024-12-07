const Info: React.FC<String> = ({ value }) => {
	return (
		<section className="container max-w-4xl text-center my-20 px-3">
			<div className="flex flex-col items-center gap-7">
				<div>{}</div>
				<div>{value}</div>
			</div>
		</section>
	);
};

export default Info;
