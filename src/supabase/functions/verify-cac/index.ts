
// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.land/manual/examples/deploy_node_server

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
};

interface CacVerificationRequest {
  userId: string;
  businessId: string;
  cacNumber: string;
  businessName: string;
  documentUrls?: string[]; // URLs to uploaded CAC documents
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Get the current authenticated user
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Parse the request body
    const { userId, businessId, cacNumber, businessName, documentUrls } = await req.json() as CacVerificationRequest;

    // Verify that the authenticated user is making a request for themselves
    if (user.id !== userId) {
      return new Response(
        JSON.stringify({ error: "Unauthorized to verify CAC for another user" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Verify the business belongs to the user
    const { data: businessData, error: businessError } = await supabaseClient
      .from("businesses")
      .select("*")
      .eq("id", businessId)
      .eq("user_id", userId)
      .single();

    if (businessError || !businessData) {
      return new Response(
        JSON.stringify({ error: "Business not found or does not belong to user" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // In a real implementation, you would integrate with EazyCAC or another provider
    // Here we're simulating the verification process
    const EAZYCAC_API_KEY = Deno.env.get("EAZYCAC_API_KEY");
    
    if (!EAZYCAC_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Missing EazyCAC configuration" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Simulate CAC verification
    // In production, you would make an API call to EazyCAC
    const isValid = cacNumber.length === 8 && /^[A-Z0-9]+$/.test(cacNumber);
    
    // Mock response data
    const mockResponseData = isValid 
      ? {
          success: true,
          verification_type: "cac",
          cac_data: {
            registration_number: cacNumber,
            company_name: businessName,
            registration_date: "2020-01-01",
            company_type: "Limited Liability Company",
            registered_address: "123 Business Avenue, Lagos, Nigeria",
            status: "Active",
            directors: [
              {
                name: "John Doe",
                position: "Managing Director"
              }
            ]
          }
        }
      : {
          success: false,
          error: "Invalid CAC number format or CAC record not found"
        };

    // Log the verification attempt
    const { data: logData, error: logError } = await supabaseClient
      .from("verification_logs")
      .insert({
        user_id: userId,
        verification_type: "cac",
        verification_id: cacNumber,
        status: isValid ? "success" : "failed",
        response_data: mockResponseData
      })
      .select();

    if (logError) {
      console.error("Error logging verification:", logError);
    }

    // If verification is successful, update the business record
    if (isValid) {
      const { error: updateError } = await supabaseClient
        .from("businesses")
        .update({
          cac_verified: true,
          cac_number: cacNumber,
          verification_documents: documentUrls ? { urls: documentUrls } : null,
          updated_at: new Date().toISOString()
        })
        .eq("id", businessId);

      if (updateError) {
        return new Response(
          JSON.stringify({ error: "Failed to update business record", details: updateError }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    return new Response(
      JSON.stringify(mockResponseData),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});