
export const RegisterPage = () => {
	return (
		<div style={{ textAlign: "center" }}>
			<h1>Register</h1>
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
					<button type="button">Register</button>
				</div>
			</form>
		</div>
	)
}