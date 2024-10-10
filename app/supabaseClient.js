import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = ' https://nazutabsfswgvnguiizo.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5henV0YWJzZnN3Z3ZuZ3VpaXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgwNjgzNjksImV4cCI6MjA0MzY0NDM2OX0.otv_aCXlA3U6XAKbBuxkWQMHhPopAKf3k8fnxxHzrLE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
// supabaseClient.js

// export const fetchTrains = async (start, end) => {
//     const { data, error } = await supabase
//         .rpc('fetch_trains', { start_loc: start, end_loc: end }); // Call your SQL function here

//     if (error) {
//         console.error('Error fetching trains:', error);
//         return [];
//     }
//     return data;
// };