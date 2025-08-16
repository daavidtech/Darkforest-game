import { withLayout } from "./nav"

export const loginPage = (body: HTMLElement) => {
    withLayout(body, "login", (root) => {
        const center = document.createElement("div")
        center.style.display = "flex"
        center.style.justifyContent = "center"
        center.style.marginTop = "48px"

        center.innerHTML = `
            <div style="width:320px;padding:24px;border:1px solid var(--border);border-radius:8px;background:var(--card);box-shadow:0 8px 24px rgba(0,0,0,0.2)">
                <h1 style="margin:0 0 16px;font-size:20px;text-align:center;">Sign in</h1>
                <form id="login-form" style="display:flex;flex-direction:column;gap:12px;">
                    <label style="display:flex;flex-direction:column;gap:6px;">
                        <span style="font-size:12px;color:var(--muted);">Username</span>
                        <input id="username" type="text" autocomplete="username" required
                            style="padding:10px 12px;border:1px solid var(--border);border-radius:6px;background:var(--bg);color:var(--fg);outline:none;" />
                    </label>
                    <label style="display:flex;flex-direction:column;gap:6px;">
                        <span style="font-size:12px;color:var(--muted);">Password</span>
                        <input id="password" type="password" autocomplete="current-password" required
                            style="padding:10px 12px;border:1px solid var(--border);border-radius:6px;background:var(--bg);color:var(--fg);outline:none;" />
                    </label>
                    <button type="submit" style="margin-top:4px;padding:10px 12px;border:0;border-radius:6px;background:var(--accent);color:#111;font-weight:600;cursor:pointer;">Login</button>
                </form>
                <p id="login-message" style="height:18px;margin:10px 0 0;font-size:12px;color:#e57373;text-align:center;"></p>
            </div>
        `
        root.appendChild(center)
    })

    const form = document.getElementById("login-form") as HTMLFormElement | null
    const username = document.getElementById("username") as HTMLInputElement | null
    const password = document.getElementById("password") as HTMLInputElement | null
    const message = document.getElementById("login-message") as HTMLParagraphElement | null

    if (!form || !username || !password) return

    form.addEventListener("submit", (e) => {
        e.preventDefault()
        const u = username.value.trim()
        const p = password.value
        if (!u || !p) {
            if (message) message.textContent = "Please enter username and password."
            return
        }
        // Placeholder auth logic; replace with real API call later.
        if (u && p) {
            if (message) message.style.color = "#81c784"
            if (message) message.textContent = "Logged in (demo)."
        }
    })
}
