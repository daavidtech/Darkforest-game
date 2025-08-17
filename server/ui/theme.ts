export type Theme = "dark" | "light"

const THEME_KEY = "df_theme"

export const getTheme = (): Theme => {
	const saved = localStorage.getItem(THEME_KEY) as Theme | null
	if (saved === "dark" || saved === "light") return saved
	const prefersDark =
		window.matchMedia &&
		window.matchMedia("(prefers-color-scheme: dark)").matches
	return prefersDark ? "dark" : "light"
}

export const applyTheme = (theme: Theme) => {
	document.documentElement.setAttribute("data-theme", theme)
	localStorage.setItem(THEME_KEY, theme)
}

export const applyThemeFromStorage = () => {
	applyTheme(getTheme())
}

export const toggleTheme = () => {
	const next: Theme = getTheme() === "dark" ? "light" : "dark"
	applyTheme(next)
}

export const ThemeSwitch = () => {
	const btn = document.createElement("button")
	btn.title = "Toggle theme"
	btn.style.padding = "6px 10px"
	btn.style.border = "1px solid var(--border)"
	btn.style.background = "var(--button-bg)"
	btn.style.color = "var(--fg)"
	btn.style.borderRadius = "6px"
	btn.style.cursor = "pointer"
	btn.style.fontSize = "12px"
	const setLabel = () => {
		const t = getTheme()
		btn.textContent = t === "dark" ? "Light Mode" : "Dark Mode"
	}
	setLabel()
	btn.onclick = () => {
		toggleTheme()
		setLabel()
	}
	return btn
}
