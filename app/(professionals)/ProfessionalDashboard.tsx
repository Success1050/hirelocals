import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";

const ProfessionalDashboard = () => {
  const router = useRouter();
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return console.log(error);
    }
    Alert.alert("logged out", "logged out successfully");
    router.replace("/auth/signin");
  };
  return (
    <ScreenWrapper>
      <View>
        <Text>ProfessionalDashboard</Text>
      </View>
      <TouchableOpacity onPress={logout}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
};

export default ProfessionalDashboard;

const styles = StyleSheet.create({});
