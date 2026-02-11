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
        // Redirect to onboarding if profile is not complete
        router.replace("/(professionals)/ProfessionalDashboard");
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
