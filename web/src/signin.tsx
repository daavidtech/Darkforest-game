
export const SiginPage = () => {
	return (
		<div style={{ textAlign: "center" }}>
			<h1>Sign in</h1>
			<form onSubmit={e => {
				e.preventDefault()
			}}>
				<div style={{ marginBottom: "10px" }}>
					<div>
						<input type="text" placeholder="Username" />
					</div>
					<div>
						<input type="password" placeholder="Password" />
					</div>
					
				</div>
				<div>
					<button type="submit">Sign in</button>
				</div>	
				<div>
					Or
				</div>
				<div>
					<button type="button">Register</button>
				</div>
			</form>
		</div>
	)
}