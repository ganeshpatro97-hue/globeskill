-- ============================================================================
-- MIGRATION 002: DONOR MANAGEMENT & FINANCIAL INTEGRATION
-- ============================================================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'donation_status_type') THEN
        CREATE TYPE donation_status_type AS ENUM ('pending', 'succeeded', 'failed');
    END IF;
END$$;

CREATE TABLE IF NOT EXISTS public.donor_profiles (
    id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
    pan_number TEXT,
    phone_number TEXT,
    billing_address TEXT,
    corporate_affiliation TEXT,
    total_donated NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.donor_profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.donations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    donor_name TEXT NOT NULL,
    donor_email TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    currency TEXT DEFAULT 'INR' NOT NULL,
    status donation_status_type DEFAULT 'pending'::donation_status_type NOT NULL,
    transaction_id TEXT UNIQUE,
    payment_gateway TEXT DEFAULT 'razorpay' NOT NULL,
    sponsored_course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
    sponsored_cause TEXT DEFAULT 'General Fund' NOT NULL,
    receipt_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Donors can view their own donor profile"
    ON public.donor_profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Donors can update their own donor profile"
    ON public.donor_profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can manage all donor profiles"
    ON public.donor_profiles FOR ALL USING (public.is_admin());

CREATE POLICY "Users can view their own donations"
    ON public.donations FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "Admins can view and manage all donations"
    ON public.donations FOR ALL USING (public.is_admin());

CREATE POLICY "Allow public/guest donation insertion"
    ON public.donations FOR INSERT WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.update_donor_aggregate_totals()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'succeeded'::donation_status_type AND NEW.profile_id IS NOT NULL THEN
        INSERT INTO public.donor_profiles (id, total_donated)
        VALUES (NEW.profile_id, NEW.amount)
        ON CONFLICT (id) DO UPDATE
        SET total_donated = public.donor_profiles.total_donated + NEW.amount,
            updated_at = TIMEZONE('utc'::text, NOW());
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_donation_status_updated ON public.donations;
CREATE TRIGGER on_donation_status_updated
    AFTER INSERT OR UPDATE OF status ON public.donations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_donor_aggregate_totals();

CREATE INDEX IF NOT EXISTS idx_donations_profile_id ON public.donations(profile_id);
CREATE INDEX IF NOT EXISTS idx_donations_status ON public.donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_transaction_id ON public.donations(transaction_id);
