import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client with service role key for admin access
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const defaultUserId = Deno.env.get('DEFAULT_USER_ID') ?? ''

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Parse request body
    const body = await req.json()
    
    // Handle array payload (from n8n)
    const projectData = Array.isArray(body) ? body[0] : body

    // Extract data from payload
    const {
      firstName,
      lastName,
      location,
      info = {},
      userId: providedUserId
    } = projectData

    // Validate required fields
    if (!firstName || !lastName || !location) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields: firstName, lastName, location' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Use provided userId, default, or create system user
    let userId = providedUserId || defaultUserId

    // If no userId provided, create or get system user automatically
    if (!userId) {
      const systemUserEmail = 'system@yes-conciergerie.local'
      
      try {
        // First, try to find existing system user by listing users
        const { data: usersData } = await supabase.auth.admin.listUsers()
        const existingSystemUser = usersData?.users?.find(u => 
          u.email === systemUserEmail || 
          (u.user_metadata?.role === 'system' && u.email?.includes('system@'))
        )
        
        if (existingSystemUser) {
          userId = existingSystemUser.id
          console.log('Using existing system user:', userId)
        } else {
          // Create new system user
          const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
            email: systemUserEmail,
            email_confirm: true,
            user_metadata: {
              name: 'System User',
              role: 'system',
              created_via: 'edge_function'
            }
          })
          
          if (createError) {
            // If creation fails (e.g., user exists but wasn't found in list), 
            // try to create with unique email as fallback
            console.log('Failed to create system user, trying fallback...')
            const fallbackEmail = `system-${Date.now()}@yes-conciergerie.local`
            const { data: fallbackUser } = await supabase.auth.admin.createUser({
              email: fallbackEmail,
              email_confirm: true,
              user_metadata: { role: 'system', fallback: true }
            })
            
            if (fallbackUser?.user) {
              userId = fallbackUser.user.id
              console.log('Created fallback system user:', userId)
            } else {
              throw new Error('Failed to create system user')
            }
          } else if (newUser?.user) {
            userId = newUser.user.id
            console.log('Created new system user:', userId)
          }
        }
      } catch (err) {
        console.error('Error managing system user:', err)
        return new Response(
          JSON.stringify({ 
            error: 'Failed to create or find system user. Please provide userId in payload or set DEFAULT_USER_ID in Supabase secrets.' 
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
    }

    // Transform arrays to strings for database storage
    const processedInfo = {
      email: info.email || '',
      phone: info.phone || '',
      profession: info.profession || '',
      conciergeCommission: info.conciergeCommission || '',
      exchangeDate: info.exchangeDate || new Date().toISOString().split('T')[0],
      strengths: Array.isArray(info.strengths) 
        ? info.strengths.join(', ') 
        : (info.strengths || ''),
      biography: info.biography || '',
      goals: Array.isArray(info.goals) 
        ? info.goals.join(', ') 
        : (info.goals || ''),
      targetRevenueY1: info.targetRevenueY1 || '',
      targetRevenueY2: info.targetRevenueY2 || '',
      targetRevenueY3: info.targetRevenueY3 || '',
      targetGrossMargin: info.targetGrossMargin || '',
      callTranscript: info.callTranscript || '',
      description: info.description || '',
      budget: info.budget || '',
      deadline: info.deadline || '',
      notes: info.notes || ''
    }

    // Insert project into database
    const { data, error } = await supabase
      .from('projects')
      .insert({
        user_id: userId,
        first_name: firstName,
        last_name: lastName,
        location: location,
        info: processedInfo
      })
      .select('id, first_name, last_name, location, created_at, info')
      .single()

    if (error) {
      console.error('Error creating project:', error)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to create project', 
          details: error.message 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        project: {
          id: data.id,
          firstName: data.first_name,
          lastName: data.last_name,
          location: data.location,
          createdAt: data.created_at,
          info: data.info
        }
      }),
      { 
        status: 201, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
