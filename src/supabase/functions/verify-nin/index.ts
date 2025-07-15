
// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.land/manual/examples/deploy_node_server

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
};

interface NinVerificationRequest {
  userId: string;
  virtualNin: string;
  selfieImage?: string; // base64 encoded image for biometric verification
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
    const { userId, virtualNin, selfieImage } = await req.json() as NinVerificationRequest;

    // Verify that the authenticated user is making a request for themselves
    if (user.id !== userId) {
      return new Response(
        JSON.stringify({ error: "Unauthorized to verify NIN for another user" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // In a real implementation, you would integrate with Smile Identity or another provider
    // Here we're simulating the verification process
    const SMILE_IDENTITY_API_KEY = Deno.env.get("SMILE_IDENTITY_API_KEY");
    const SMILE_IDENTITY_PARTNER_ID = Deno.env.get("SMILE_IDENTITY_PARTNER_ID");
    
    if (!SMILE_IDENTITY_API_KEY || !SMILE_IDENTITY_PARTNER_ID) {
      return new Response(
        JSON.stringify({ error: "Missing Smile Identity configuration" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Simulate NIN verification
    // In production, you would make an API call to Smile Identity
    const isValid = virtualNin.length === 16 && /^\d+$/.test(virtualNin);
    
    // Mock response data
    const mockResponseData = isValid 
      ? {
          success: true,
          verification_type: "nin",
          nin_data: {
            first_name: "John",
            last_name: "Doe",
            middle_name: "Smith",
            date_of_birth: "1990-01-01",
            phone_number: "+2348012345678",
            photo: "base64_encoded_photo_data",
            nin: virtualNin,
            gender: "Male",
            address: "123 Main Street, Lagos, Nigeria"
          }
        }
      : {
          success: false,
          error: "Invalid NIN format or NIN not found"
        };

    // Log the verification attempt
    const { data: logData, error: logError } = await supabaseClient
      .from("verification_logs")
      .insert({
        user_id: userId,
        verification_type: "nin",
        verification_id: virtualNin,
        status: isValid ? "success" : "failed",
        response_data: mockResponseData
      })
      .select();

    if (logError) {
      console.error("Error logging verification:", logError);
    }

    // If verification is successful, update the user record
    if (isValid) {
      const { error: updateError } = await supabaseClient
        .from("users")
        .update({
          nin_verified: true,
          nin_token: virtualNin,
          nin_data: mockResponseData.nin_data,
          updated_at: new Date().toISOString()
        })
        .eq("id", userId);

      if (updateError) {
        return new Response(
          JSON.stringify({ error: "Failed to update user record", details: updateError }),
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