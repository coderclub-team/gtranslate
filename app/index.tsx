import { StatusBar } from "expo-status-bar";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import { translate, speak } from "google-translate-api-x";
import {
  TextInput,
} from "react-native-paper";
import ISO6391 from "iso-639-1";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect } from "react";
import { useLocales } from "expo-localization";
import { playBase64Audio } from "../functions";
import { useTheme } from "@react-navigation/native";
export default function App() {
  const all_names = ISO6391.getAllNames();
  const locale = useLocales();
  const [selected_left, setSelected_left] = React.useState("en");
  const [selected_right, setSelected_right] = React.useState("ta");
  const [input, set_input] = React.useState("");
  const [translation, set_translation] = React.useState("");
  const { colors } = useTheme();
  useEffect(() => setSelected_left(locale[0].languageCode), []);
  useEffect(() => {
    const trans = async () => {
      const result = await translate(input, {
        from: selected_left,
        to: selected_right,
        autoCorrect: true,
      });
      set_translation(result.text);
    };

    const timeoutId = setTimeout(() => trans(), 1000); // 1000 milliseconds is 1 second
    return () => clearTimeout(timeoutId);
  }, [input]);

  const on_change_left = (value: string) =>
    setSelected_left(ISO6391.getCode(value));

  const on_change_right = (value: string) =>
    setSelected_right(ISO6391.getCode(value));

  const handle_input_speak = async (value: string, to: string) => {
    try {
      const file = await speak(value, {
        to: to,
        autoCorrect: true,
      });
      await playBase64Audio(file);
    } catch (error) {
      console.log(error);
    }
  };
  const handle_translation_speak = async (value: string, to: string) => {
    try {
      const file = await speak(value, {
        to: to,
        autoCorrect: true,
      });
      await playBase64Audio(file);
    } catch (error) {
      console.log(error);
    }
  };
  const handle_swap_press = (trans: string) => {
    const temp = selected_left;
    setSelected_left(selected_right);
    setSelected_right(temp);
    set_input(trans);
  };

  return (
    <View style={styles.container}>
      <Picker
        placeholder="Pick a language"
        mode="dropdown"
        style={{ height: 50, width: 200 }}
        selectedValue={ISO6391.getName(selected_left)}
        onValueChange={on_change_left}
      >
        {all_names.map((language) => (
          <Picker.Item key={language} label={language} value={language} />
        ))}
      </Picker>
      <TextInput
        mode="flat"
        style={styles.input}
        multiline
        value={input}
        placeholder="Type here"
        onChangeText={set_input}
        left={<TextInput.Icon icon="microphone-outline" />}
        right={
          <TextInput.Icon
            disabled={input.length === 0}
            onPress={() => handle_input_speak(input, selected_left)}
            icon="volume-high"
            color={input.length === 0 ? "grey" : colors.primary}
          />
        }
      />
      <View
        style={{
          height: 100,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity
          style={{
            width: 50,
            height: 50,
            backgroundColor: "white",
            elevation: 10,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 50,
          }}
          onPress={() => handle_swap_press(translation)}
          children={
            <Ionicons
              name="md-swap-vertical-sharp"
              size={24}
              color={colors.primary}
            />
          }
        />
      </View>

      <Picker
        style={{ height: 50, width: 200 }}
        mode="dropdown"
        selectedValue={ISO6391.getName(selected_right)}
        onValueChange={on_change_right}
      >
        {all_names.map((language) => (
          <Picker.Item key={language} label={language} value={language} />
        ))}
      </Picker>
      <TextInput
        style={styles.input}
        multiline
        placeholder="Translated text"
        value={translation}
        left={
          <TextInput.Icon
            icon="microphone-outline"
          />
        }
        right={
          <TextInput.Icon
            onPress={() =>
              handle_translation_speak(translation, selected_right)
            }
            icon="volume-high"
            color={input.length === 0 ? "grey" : colors.primary}
          />
        }
      />
     
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: 300,
  },
});
