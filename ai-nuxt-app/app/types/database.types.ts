export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[]

export type Database = {
	public: {
		Tables: {
			documents: {
				Row: {
					id: number
					content: string
					metadata: Json | null
					embedding: number[] | null
					user_id: string | null
				}
				Insert: {
					id?: number
					content: string
					metadata?: Json | null
					embedding?: number[] | null
					user_id?: string | null
				}
				Update: {
					id?: number
					content?: string
					metadata?: Json | null
					embedding?: number[] | null
					user_id?: string | null
				}
				Relationships: []
			}
		}
		Views: {
			[_ in never]: never
		}
		Functions: {
			match_documents: {
				Args: {
					query_embedding: number[]
					match_threshold: number
					match_count: number
				}
				Returns: {
					id: number
					content: string
					metadata: Json | null
					similarity: number
				}[]
			}
		}
		Enums: {
			[_ in never]: never
		}
		CompositeTypes: {
			[_ in never]: never
		}
	}
}
