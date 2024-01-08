import { Fragment } from "react"
import { Link } from "react-router-dom"

export const Navbar = () => {
	const showNavigationItems = location.pathname !== "/signin" && location.pathname !== "/register"

	return (
		<nav className="nav">
			{showNavigationItems && (
				<Fragment>
					<Link to="/">Darkforest</Link>
					<Link to="/resources">Resources</Link>
					<Link to="/map">Map</Link>
				</Fragment>
			)}
		</nav>
	)
}