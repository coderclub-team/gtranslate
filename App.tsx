import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
import { translate, speak } from "google-translate-api-x";
import { TextInput } from "react-native-paper";
import ISO6391 from "iso-639-1";
import { writeFileSync } from 'fs';
// import { translateText } from './functions';
// AIzaSyCxbe-4E1TPFz94fblfjU7zirNhteUokFE
// import { Translate } from "@google-cloud/translate/build/src/v2";
// const translate=new Translate({
//   projectId: "AIzaSyCxbe-4E1TPFz94fblfjU7zirNhteUokFE",
// })
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import React, { useCallback, useEffect } from "react";
import { useLocales } from "expo-localization";
// {
//   "currencyCode": "INR",
//   "currencySymbol": "₹",
//   "decimalSeparator": ".",
//   "digitGroupingSeparator": ",",
//   "languageCode": "en",
//   "languageTag": "en-IN",
//   "measurementSystem": "metric",
//   "regionCode": "IN",
//   "textDirection": "ltr"
// }

export default function App() {
  const all_names = ISO6391.getAllNames();
  const locale = useLocales();
  const [selected_left, setSelected_left] = React.useState("en");
  const [selected_right, setSelected_right] = React.useState("ta");
  const [input, set_input] = React.useState("");
  const [translation, set_translation] = React.useState("");

  useEffect(() => setSelected_left(locale[0].languageCode), []);
  useEffect(() => {
    const trans = async () => {
      const result = await translate(input, {
        from: selected_left,
        to: selected_right,
        autoCorrect: true,
      });
      set_translation(result.text);
      console.log(result);
    };

    const timeoutId = setTimeout(() => {
      trans();
      // Call the function here
    }, 1000); // 1000 milliseconds is 1 second
    return () => clearTimeout(timeoutId);
  }, [input]);

  const on_change_left = (value: string) => {
    const code = ISO6391.getCode(value);

    setSelected_left(code);
  };
  const on_change_right = (value: string) => {
    const code = ISO6391.getCode(value);
    setSelected_right(code);
  };
  const handle_left_speak =async (value:string,to:string) => {
   
  try {
   const file= await speak(value, {
      to: to,
      autoCorrect:true,

    })
    writeFileSync('cat.mp3', file, {encoding:'base64'})
    console.log(file)
  } catch (error) {
    console.log(error);
  }
  };
  const handle_right_speak =async (value:string,to:string) => {
    const code=ISO6391.getCode(to);
    try {
      await speak(value, {
        to: code,
      })
    } catch (error) {
      console.log(error);
    }
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
        style={{
          width: 300,
        }}
        multiline
        placeholder="Type here"
        onChangeText={set_input}
        left={<TextInput.Icon icon="microphone-outline" />}
        right={
          <TextInput.Icon onPress={()=>handle_left_speak(input,selected_left)} icon="volume-high" />
        }
      />
      <View
        style={{
          height: 100,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name="md-swap-vertical-sharp" size={24} color="black" />
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
        style={{
          width: 300,
        }}
        multiline
        placeholder="Translated text"
        value={translation}
        left={<TextInput.Icon icon="microphone-outline" />}
        right={
          <TextInput.Icon onPress={()=>handle_right_speak(translation,selected_right)} icon="volume-high" />
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
});
