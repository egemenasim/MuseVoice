export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            artifacts: {
                Row: {
                    base_image_url: string | null
                    created_at: string
                    id: string
                    artifact_number: string
                }
                Insert: {
                    base_image_url?: string | null
                    created_at?: string
                    id?: string
                    artifact_number: string
                }
                Update: {
                    base_image_url?: string | null
                    created_at?: string
                    id?: string
                    artifact_number?: string
                }
                Relationships: []
            }
            artifact_translations: {
                Row: {
                    artifact_id: string | null
                    audio_url: string | null
                    description: string
                    id: string
                    language_code: string | null
                    title: string
                }
                Insert: {
                    artifact_id?: string | null
                    audio_url?: string | null
                    description: string
                    id?: string
                    language_code?: string | null
                    title: string
                }
                Update: {
                    artifact_id?: string | null
                    audio_url?: string | null
                    description?: string
                    id?: string
                    language_code?: string | null
                    title?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "artifact_translations_artifact_id_fkey"
                        columns: ["artifact_id"]
                        referencedRelation: "artifacts"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "artifact_translations_language_code_fkey"
                        columns: ["language_code"]
                        referencedRelation: "languages"
                        referencedColumns: ["code"]
                    }
                ]
            }
            languages: {
                Row: {
                    code: string
                    dir: string
                    flag_emoji: string
                    name: string
                    native_name: string
                }
                Insert: {
                    code: string
                    dir: string
                    flag_emoji: string
                    name: string
                    native_name: string
                }
                Update: {
                    code?: string
                    dir?: string
                    flag_emoji?: string
                    name?: string
                    native_name?: string
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
