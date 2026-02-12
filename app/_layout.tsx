import { Stack, useRouter, usePathname } from "expo-router";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import "react-native-url-polyfill/auto";
import { View, ActivityIndicator } from "react-native";

function RootLayoutNav() {
  const { isAuthenticated, isLoading, user, isProviderProfileComplete } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    console.log('[LAYOUT DEBUG] isAuthenticated:', isAuthenticated, '| user role:', user?.role, '| isProviderProfileComplete:', isProviderProfileComplete, '| pathname:', pathname);

    const inAuthGroup = pathname.startsWith("/auth");
    const inProfessionalsGroup = pathname.startsWith("/(professionals)");
    const inUsersGroup = pathname.startsWith("/(users)");
    const inOnboardingGroup = pathname.startsWith("/onboarding");
    const isRoot = pathname === "/";

    if (!isAuthenticated && (inProfessionalsGroup || inUsersGroup || inOnboardingGroup)) {
      // Redirect to landing if trying to access protected route without auth
      router.replace("/");
    } else if (isAuthenticated) {
      if (user?.role === "PROVIDER" || user?.role === "BOTH") {
        if (isProviderProfileComplete) {
          // Provider profile is complete, go to dashboard (only if not already there)
          if (inAuthGroup || isRoot || inOnboardingGroup) {
            router.replace("/(professionals)/ProfessionalDashboard");
          }
        } else {
          // Provider profile not complete, go to onboarding (only if not already there)
          if (inAuthGroup || isRoot || inProfessionalsGroup) {
            router.replace("/onboarding/ProviderOnboarding");
          }
        }
      } else {
        // Customer
        if (inAuthGroup || isRoot || inOnboardingGroup) {
          router.replace("/(users)/UserDashboard");
        }
      }
    }
  }, [isAuthenticated, isLoading, pathname, user, isProviderProfileComplete]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1a1a2e" }}>
        <ActivityIndicator size="large" color="#e94560" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
