interface TagProps {
	value: string;
	removable?: boolean;
}

const Tag = ({ value, removable = true }: TagProps) => {
	return (
		<span
			id="badge-dismiss-dark"
			className="inline-flex items-center px-2 py-1 text-xs bg-white/20 rounded-full backdrop-blur-sm border"
		>
			{value}

			{removable && (
				<button
					type="button"
					className="inline-flex items-center p-1 ms-2 text-sm text-gray-400 bg-transparent rounded-sm hover:bg-gray-200 hover:text-gray-900"
				>
					<svg
						className="w-2 h-2"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 14 14"
					>
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
						/>
					</svg>
					<span className="sr-only">Remove badge</span>
				</button>
			)}
		</span>
	);
};

export default Tag;
