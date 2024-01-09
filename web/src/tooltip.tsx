import "./tooltip.css";

export const Tooltip = ({ children, text, ...props }) => {
	return (
		<div className="tooltip" {...props}>
			{children}
			<pre className="tooltiptext">{text}</pre>
		</div>
	);
};