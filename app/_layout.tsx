import { Stack, useRouter, usePathname } from "expo-router";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import "react-native-url-polyfill/auto";
import { View, ActivityIndicator } from "react-native";

function RootLayoutNav() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = pathname.startsWith("/auth");
    const inProfessionalsGroup = pathname.startsWith("/(professionals)");
    const inUsersGroup = pathname.startsWith("/(users)");
    const isRoot = pathname === "/";

    if (!isAuthenticated && (inProfessionalsGroup || inUsersGroup)) {
      // Redirect to landing if trying to access protected route without auth
      router.replace("/");
    } else if (isAuthenticated && (inAuthGroup || isRoot)) {
      // Redirect to appropriate dashboard if already authenticated and trying to access login/signup or landing
      if (user?.role === "PROVIDER" || user?.role === "BOTH") {
        router.replace("/(professionals)/ProfessionalDashboard");
      } else {
        router.replace("/(users)/UserDashboard");
      }
    }
  }, [isAuthenticated, isLoading, pathname, user]);

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
