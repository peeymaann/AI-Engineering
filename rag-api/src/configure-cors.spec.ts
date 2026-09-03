/* eslint-disable prettier/prettier */
import { isAllowedCorsOrigin } from './configure-cors'

describe('isAllowedCorsOrigin', () => {
	it('allows the Nuxt dev origin', () => {
		expect(isAllowedCorsOrigin('http://localhost:3000')).toBe(true)
		expect(isAllowedCorsOrigin('http://127.0.0.1:3000')).toBe(true)
	})

	it('allows other localhost ports used when 3000 is taken', () => {
		expect(isAllowedCorsOrigin('http://localhost:3001')).toBe(true)
	})

	it('rejects unrelated origins', () => {
		expect(isAllowedCorsOrigin('https://evil.example')).toBe(false)
		expect(isAllowedCorsOrigin('not a url')).toBe(false)
	})
})
