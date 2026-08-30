-- ============================================================================
-- GLOBESKILL PHASE 4: DONOR MANAGEMENT & FINANCIAL INTEGRATION SQL SCHEMA
-- (supabase-donations-setup.sql)
-- ============================================================================

-- 1. Create Donation Status ENUM Type
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'donation_status_type') THEN
        CREATE TYPE donation_status_type AS ENUM ('pending', 'succeeded', 'failed');
    END IF;
END$$;

-- 2. Create Donor Profiles Table
-- This table stores additional metadata for registered donors (e.g., corporate sponsors or individuals)
-- seeking 80G tax benefits (standard for non-profit operations in India) or custom sponsorships.
CREATE TABLE IF NOT EXISTS public.donor_profiles (
    id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
    pan_number TEXT, -- Needed for 80G Tax Exemption Certificate generation in India
    phone_number TEXT,
    billing_address TEXT,
    corporate_affiliation TEXT,
    total_donated NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for Donor Profiles
ALTER TABLE public.donor_profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create Donations Table
-- Supports both authenticated user donations and anonymous guest contributions.
CREATE TABLE IF NOT EXISTS public.donations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Nullable for guest checkout
    donor_name TEXT NOT NULL,
    donor_email TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    currency TEXT DEFAULT 'INR' NOT NULL,
    status donation_status_type DEFAULT 'pending'::donation_status_type NOT NULL,
    transaction_id TEXT UNIQUE, -- Payment processor reference (e.g., Stripe, Razorpay, UPI)
    payment_gateway TEXT DEFAULT 'razorpay' NOT NULL, -- 'stripe', 'razorpay', 'upi'
    sponsored_course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL, -- Support specific track sponsorships
    sponsored_cause TEXT DEFAULT 'General Fund' NOT NULL, -- e.g., 'AI Careers for Women', 'Hardware Grants'
    receipt_url TEXT, -- Link to generated PDF receipt stored in Supabase Bucket
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for Donations
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- 4. Set Up RLS Policies for Donor Profiles
-- Policy 1: Donors can view their own profile
CREATE POLICY "Donors can view their own donor profile"
    ON public.donor_profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Policy 2: Donors can update their own profile
CREATE POLICY "Donors can update their own donor profile"
    ON public.donor_profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Policy 3: Admins can manage all donor profiles
CREATE POLICY "Admins can manage all donor profiles"
    ON public.donor_profiles
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND (user_role = 'admin' OR user_role = 'admin'::user_role_enum)
        )
    );

-- 5. Set Up RLS Policies for Donations
-- Policy 1: Authenticated users can view their own donations
CREATE POLICY "Users can view their own donations"
    ON public.donations
    FOR SELECT
    USING (auth.uid() = profile_id);

-- Policy 2: Admins can view all donations
CREATE POLICY "Admins can view and manage all donations"
    ON public.donations
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND (user_role = 'admin' OR user_role = 'admin'::user_role_enum)
        )
    );

-- Policy 3: Allow insertion for public checkouts (Stripe/Razorpay Webhook or Client)
CREATE POLICY "Allow public/guest donation insertion"
    ON public.donations
    FOR INSERT
    WITH CHECK (true);

-- 6. Trigger to Update Donor Profiles 'total_donated' Aggregate Upon Successful Donation
CREATE OR REPLACE FUNCTION public.update_donor_aggregate_totals()
RETURNS TRIGGER AS $$
BEGIN
    -- Only update aggregates if the donation successfully processed ('succeeded')
    IF NEW.status = 'succeeded'::donation_status_type AND NEW.profile_id IS NOT NULL THEN
        -- Check if donor profile exists, if not create one
        INSERT INTO public.donor_profiles (id, total_donated)
        VALUES (NEW.profile_id, NEW.amount)
        ON CONFLICT (id) DO UPDATE
        SET total_donated = public.donor_profiles.total_donated + NEW.amount,
            updated_at = TIMEZONE('utc'::text, NOW());
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution link
DROP TRIGGER IF EXISTS on_donation_status_updated ON public.donations;
CREATE TRIGGER on_donation_status_updated
    AFTER INSERT OR UPDATE OF status ON public.donations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_donor_aggregate_totals();

-- 7. Add Database Indexing for Analytics Performance
CREATE INDEX IF NOT EXISTS idx_donations_profile_id ON public.donations(profile_id);
CREATE INDEX IF NOT EXISTS idx_donations_status ON public.donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_transaction_id ON public.donations(transaction_id);
