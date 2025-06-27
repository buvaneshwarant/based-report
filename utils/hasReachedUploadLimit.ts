import { createClient } from "@/lib/supabase/client";

export async function hasReachedUploadLimit(email: string): Promise<boolean> {
    const supabase = createClient();

    // Fetch user details
    const { data: user, error: userError } = await supabase
        .from("users") // Replace "users" with your table name
        .select("tier, uploads_count")
        .eq("email", email)
        .single();

    if (userError || !user) {
        console.error("Error fetching user details:", userError);
        throw new Error("User not found");
    }

    // Define tier limits
    const tierLimits = {
        Free: 1,
        Pro: 10,
        Ultimate: Infinity, // Unlimited uploads
    };

    // Check if the user has reached their upload limit
    return user.uploads_count >= tierLimits[user.tier];
}