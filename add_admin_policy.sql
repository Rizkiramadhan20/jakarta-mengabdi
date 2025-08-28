-- Add RLS policy for service role to update profiles (for admin operations)
-- This policy allows the service role to update any profile, bypassing the user-specific policy

-- Drop existing policy if it exists
drop policy if exists "Service role can update profiles." on profiles;

-- Create new policy for service role to update profiles
create policy "Service role can update profiles."
    on profiles for update
    to service_role
    using ( true )
    with check ( true );

-- Also add a policy for service role to delete profiles if needed
drop policy if exists "Service role can delete profiles." on profiles;

create policy "Service role can delete profiles."
    on profiles for delete
    to service_role
    using ( true );
