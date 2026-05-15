import { createClient } from '@supabase/supabase-js'

// Dán thông tin của Thịnh vào đây
const supabaseUrl = 'https://eprktjlmzirmcswmbkxl.supabase.co'
const supabaseAnonKey = 'sb_publishable_A3zrSoc_7P0qtowMbmdLIw_jTXvOqq6'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)