// test.js
import { supabaseClient } from './supabaseClient.js'

// const { data, error } = await supabaseClient.auth.getSession()

// if (error) {
//   console.error('Error connecting to Supabase:', error.message)
// } else {
//   console.log('Connected to Supabase! Session:', data.session)
// }



const { data, error } = await supabaseClient
  .from("todos")
  .insert({
    title: "First Todo"
  });

console.log(data);
console.log(error);