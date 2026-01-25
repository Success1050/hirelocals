// Mock auth actions for now
export const userSignup = async (
  email: string,
  password: string,
  fullName: string,
  phone: string,
  role: string
) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log("Mock Signup:", { email, password, fullName, phone, role });
  return { success: true };
};

export const userLogin = async (email: string, password: string) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log("Mock Login:", { email, password });
  return { success: true };
};
