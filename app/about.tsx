import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { requestPermissionsAsync, PermissionStatus } from "expo-media-library";
import { Audio } from "expo-av";
export default function about() {
  const [hasPermission, setHasPermission] = React.useState(false);
  const [recording, setRecording] = React.useState(new Audio.Recording());
  const requestPermission = async () => {
    const response = await requestPermissionsAsync();
    if (response.status === PermissionStatus.GRANTED) {
        Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
            
        })
      setHasPermission(true);
      return true;
    }
  };

  useEffect(() => {``
    requestPermission();
  }, []);
  const record = async () => {
    try {
      await recording.prepareToRecordAsync();
      await recording.startAsync();
    } catch (error) {
      console.log(error);
    }
  };
  const stope = async () => {
    recording.stopAndUnloadAsync();
  };

  return (
    <View>
      <Text>about</Text>
      <Pressable
        children={({ pressed }) => (
          <Text style={{ color: pressed ? "red" : "blue" }}>Press Me</Text>
        )}
        onPress={() => record()}
      />
      <Pressable
        children={({ pressed }) => (
          <Text style={{ color: pressed ? "red" : "blue" }}>Press Me</Text>
        )}
        onPress={() => record()}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
