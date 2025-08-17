import { describe, test, expect } from "bun:test"
import { patternMatcher } from "./pattern-matcher"

describe("patternMatcher", () => {
	test("matches literals, params and wildcard", () => {
		const calls: string[] = []
		const matcher = patternMatcher({
			"/": () => {
				calls.push("root")
				return "root"
			},
			"/map": () => {
				calls.push("map")
				return "map"
			},
			"/user/:id": ({ id }: any) => {
				calls.push(`user:${id}`)
				return id
			},
			"/*": () => {
				calls.push("wild")
				return "wild"
			},
		})

		expect(matcher.match("/")?.result).toBe("root")
		expect(matcher.match("/map")?.result).toBe("map")
		expect(matcher.match("/user/123")?.result).toBe("123")
		expect(matcher.match("/nope")?.result).toBe("wild")

		// Ensure handlers were invoked along the way
		expect(calls).toEqual(["root", "map", "user:123", "wild"])
	})
})
