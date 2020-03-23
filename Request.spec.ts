console.log = jest.fn()
const log = console.log
import "./Request"

describe("servly.Request", () => {
	it("log", () => {
		console.log("test", { property: "value" })
		expect(log).toHaveBeenCalledWith("test", ["{\"property\":\"value\"}"])
	})
})
