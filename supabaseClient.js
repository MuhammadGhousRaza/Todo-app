

const supabaseUrl = "#############";
const supabaseAnonKey = "#########################";

let supabaseClient;

if (typeof window === "undefined") {
	// Running in Node — dynamically import the package
	const { createClient } = await import("@supabase/supabase-js");
	supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
} else {
	// Running in the browser — rely on global `supabase` provided by CDN
	supabaseClient = supabase.createClient(supabaseUrl, supabaseAnonKey);
	window.supabaseClient = supabaseClient;
}

export { supabaseClient };