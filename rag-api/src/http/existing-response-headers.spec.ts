/* eslint-disable prettier/prettier */
import type { Response } from 'express'
import { existingResponseHeaders } from './existing-response-headers'

describe('existingResponseHeaders', () => {
	it('copies CORS headers set on the response', () => {
		const headers: Record<string, string | string[]> = {
			'access-control-allow-origin': 'http://localhost:3000',
			'access-control-allow-credentials': 'true',
			vary: ['Origin'],
		}

		const res = {
			getHeaderNames: () => Object.keys(headers),
			getHeader: (name: string) => headers[name],
		} as unknown as Response

		expect(existingResponseHeaders(res)).toEqual({
			'access-control-allow-origin': 'http://localhost:3000',
			'access-control-allow-credentials': 'true',
			vary: 'Origin',
		})
	})
})
