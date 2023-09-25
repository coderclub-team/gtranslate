import { Audio } from "expo-av";
import { requestPermissionsAsync, PermissionStatus } from "expo-media-library";
import * as Permissions from "expo-permissions";
export const playBase64Audio = async (base64Content: string) => {
  const soundObject = new Audio.Sound();
  try {
    await soundObject.loadAsync({
      uri: `data:audio/mp3;base64,${base64Content}`,
    });
    await soundObject.playAsync();
  } catch (error) {
    console.error(error);
  }
};

