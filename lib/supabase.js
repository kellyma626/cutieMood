import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rglazzskrcnkonckafvp.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnbGF6enNrcmNua29uY2thZnZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MTM4MjUsImV4cCI6MjA3MDA4OTgyNX0.NkfZmjBon6jg2g3N0iZXLlHyer_gClAjFJG1EqMp5-U'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)