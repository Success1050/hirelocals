import { Stack, useRouter } from "expo-router";

import "react-native-url-polyfill/auto";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { View, Text } from "react-native";
import { Session } from "@supabase/supabase-js";

export default function RootLayout() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setloading] = useState<boolean>(false);
  const [role, setRole] = useState<"user" | "professional" | "">("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/auth/signin");
      }
      setloading(true);
      setSession(session);
      setloading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace("/auth/signin");
      }
      setloading(true);
      setSession(session);
      setloading(false);
    });
  }, []);

  useEffect(() => {
    if (!session) return;
    setloading(true);
    const getProfile = async () => {
      const { data: profile, error: profileerror } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", session?.user?.id)
        .single();

      if (profileerror) {
        console.log(profileerror);
        setloading(false);
      }

      setRole(profile?.role);
      setloading(false);
    };
    getProfile();
  }, [session]);

  if (loading) {
    return (
      <View>
        <Text>Loading</Text>
      </View>
    );
  }

  if (role == "user") {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(users)" />
      </Stack>
    );
  }

  if (role == "professional") {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(professionals)" />
      </Stack>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
