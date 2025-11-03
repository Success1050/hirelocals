import { supabase } from "@/lib/supabase";

export const userSignup = async (
  email: string,
  password: string,
  fullName: string,
  phone: string,
  role: string
) => {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { fullName, phone, role } },
  });

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
};
