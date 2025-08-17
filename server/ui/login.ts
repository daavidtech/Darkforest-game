import { withLayout } from "./nav"
import { setToken, setUser, fetchWithAuth } from "./auth"
import { navigate } from "./router"
import { loadResourceRates } from "./state"

export const loginPage = (body: HTMLElement) => {
	withLayout(body, "login", (root) => {
		const center = document.createElement("div")
		center.style.display = "flex"
		center.style.justifyContent = "center"
		center.style.marginTop = "48px"

		const card = document.createElement("div")
		card.style.width = "320px"
		card.style.padding = "24px"
		card.style.border = "1px solid var(--border)"
		card.style.borderRadius = "8px"
		card.style.background = "var(--card)"
		card.style.boxShadow = "0 8px 24px rgba(0,0,0,0.2)"

		const h = document.createElement("h1")
		h.textContent = "Sign in"
		h.style.margin = "0 0 16px"
		h.style.fontSize = "20px"
		h.style.textAlign = "center"
		card.appendChild(h)

		const form = document.createElement("form")
		form.style.display = "flex"
		form.style.flexDirection = "column"
		form.style.gap = "12px"

		const makeInput = (labelText: string, type: string, id: string) => {
			const wrap = document.createElement("label")
			wrap.style.display = "flex"
			wrap.style.flexDirection = "column"
			wrap.style.gap = "6px"
			const lab = document.createElement("span")
			lab.textContent = labelText
			lab.style.fontSize = "12px"
			lab.style.color = "var(--muted)"
			const input = document.createElement("input")
			input.type = type
			input.id = id
			input.required = true
			input.style.padding = "10px 12px"
			input.style.border = "1px solid var(--border)"
			input.style.borderRadius = "6px"
			input.style.background = "var(--bg)"
			input.style.color = "var(--fg)"
			input.style.outline = "none"
			wrap.appendChild(lab)
			wrap.appendChild(input)
			return { wrap, input }
		}

		const u = makeInput("Username", "text", "username")
		const p = makeInput("Password", "password", "password")
		p.input.autocomplete = "current-password"
		u.input.autocomplete = "username"

		const submit = document.createElement("button")
		submit.type = "submit"
		submit.textContent = "Login"
		submit.style.marginTop = "4px"
		submit.style.padding = "10px 12px"
		submit.style.border = "0"
		submit.style.borderRadius = "6px"
		submit.style.background = "var(--accent)"
		submit.style.color = "#111"
		submit.style.fontWeight = "600"
		submit.style.cursor = "pointer"

		const msg = document.createElement("p")
		msg.style.height = "18px"
		msg.style.margin = "10px 0 0"
		msg.style.fontSize = "12px"
		msg.style.color = "#e57373"
		msg.style.textAlign = "center"

		form.appendChild(u.wrap)
		form.appendChild(p.wrap)
		form.appendChild(submit)

		form.addEventListener("submit", async (e) => {
			e.preventDefault()
			const username = u.input.value.trim()
			const password = p.input.value
			if (!username || !password) {
				msg.textContent = "Please enter username and password."
				return
			}
			submit.disabled = true
			submit.textContent = "Logging in…"
			try {
				const res = await fetch("/api/login", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ username, password }),
				})
				if (!res.ok) {
					const err = await res.json().catch(() => ({}))
					msg.style.color = "#e57373"
					msg.textContent = err.error || "Login failed"
					return
				}
				const data = await res.json()
				setToken(data.token)
				// Fetch profile (optional)
				const meRes = await fetchWithAuth("/api/me")
				if (meRes.ok) {
					const { user } = await meRes.json()
					setUser(user)
				}
				await loadResourceRates()
				msg.style.color = "#81c784"
				msg.textContent = "Logged in"
				navigate("/")
			} catch (err) {
				msg.style.color = "#e57373"
				msg.textContent = "Network error"
			} finally {
				submit.disabled = false
				submit.textContent = "Login"
			}
		})

		card.appendChild(form)
		card.appendChild(msg)
		center.appendChild(card)
		root.appendChild(center)
	})
}
