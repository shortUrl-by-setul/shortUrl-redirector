// Initialize Supabase
const { createClient } = supabase;
const anonUrl = 'https://ewzkjhdkkgvfcjzwmsuc.supabase.co';
const anonVal = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3emtqaGRra2d2ZmNqendtc3VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzMzM1OTksImV4cCI6MjA1OTkwOTU5OX0.--5sBUEUvVxnGCZU0bsIwoUStK9xKvIDUed8ZzEuHn8' // process.env.SUPABASE_KEY
const _supabase = createClient(anonUrl, anonVal);