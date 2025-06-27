import { createClient } from "@/lib/supabase/client";

export async function linkUserProfile(email: string, userId: string, tier: string = "Free") {
    const supabase = createClient();

    // Check if the user already has a profile
    const { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single();

    if (profileError && profileError.code === "PGRST116") {
        // If no profile exists, create one
        const { error: insertError } = await supabase
            .from("user_profiles")
            .insert({
                id: userId,
                email: email,
                tier: tier, // Default tier
                uploads_count: 0, // Default upload count
            });

        if (insertError) {
            console.error("Error creating user profile:", insertError);
            throw new Error("Failed to create user profile.");
        }
    } else if (profileError) {
        console.error("Error fetching user profile:", profileError);
        throw new Error("Failed to fetch user profile.");
    }
}