import React, { Component, useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
// import { MotiView } from "@motify/components";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} from "react-native";
import Voice, {
  SpeechRecognizedEvent,
  SpeechResultsEvent,
  SpeechErrorEvent,
} from "@react-native-voice/voice";

type Props = {
  onSpeechStart: () => void;
  onSpeechEnd: (result: any[]) => void;
};
type State = {
  recognized: string;
  pitch: string;
  error: string;
  end: string;
  started: boolean;
  results: string[];
  partialResults: string[];
};

function Record(props:Props) {
  const [state, set_state] = useState<State>({
    recognized: "",
    pitch: "",
    error: "",
    end: "",
    started: false,
    results: [],
    partialResults: [],
  });
  useEffect(() => {
    (async () => {
      await Voice.destroy().then(Voice.removeAllListeners);
    })();
  }, []);

  const onSpeechStart = (e?: any) => {
    console.log("onSpeechStart: ", e);
    set_state((state) => ({ ...state, started: true }));
  };
  const onSpeechRecognized = (e: SpeechRecognizedEvent) => {
    console.log("onSpeechRecognized: ", e);

    set_state((state) => ({ ...state, recognized: "√" }));
  };
  const onSpeechEnd = (e: any) => {
    console.log("onSpeechEnd: ", e);

    set_state((state) => ({ ...state, end: "√", started: false }));
    onSpeechEnd(state.results);
  };
  const onSpeechError = (e: SpeechErrorEvent) => {
    console.log("onSpeechError: ", e);

    set_state((state) => ({ ...state, error: JSON.stringify(e) }));
  };
  const onSpeechResults = (e: SpeechResultsEvent) => {
    console.log("onSpeechResults: ", e);

    set_state((state) => ({ ...state, results: e.value! }));
  };
  const onSpeechPartialResults = (e: SpeechResultsEvent) => {
    console.log("onSpeechPartialResults: ", e);

    set_state((state) => ({ ...state, partialResults: e.value! }));
  };
  const onSpeechVolumeChanged = (e: any) => {
    console.log("onSpeechVolumeChanged: ", e);

    set_state((state) => ({ ...state, pitch: e.value! }));
  };
  const _startRecognizing = async () => {
    set_state((state) => ({
      ...state,
      recognized: "",
      pitch: "",
      error: "",
      started: false,
      results: [],
      partialResults: [],
      end: "",
    }));

    try {
      await Voice.start("en-US");
      onSpeechStart();
    } catch (e: any) {
      console.error(e.message);
    }
  };
  const _stopRecognizing = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };
  const _cancelRecognizing = async () => {
    try {
      await Voice.cancel();
    } catch (e) {
      console.error(e);
    }
  };
  const _destroyRecognizer = async () => {
    try {
      await Voice.destroy();
    } catch (e) {
      console.error(e);
    }
    set_state((state) => ({
      ...state,
      ecognized: "",
      pitch: "",
      error: "",
      started: false,
      results: [],
      partialResults: [],
      end: "",
    }));
  };
  useEffect(() => {
    try {
      Voice.onSpeechStart = onSpeechStart;
      Voice.onSpeechRecognized = onSpeechRecognized;
      Voice.onSpeechEnd = onSpeechEnd;
      Voice.onSpeechError = onSpeechError;
      Voice.onSpeechResults = onSpeechResults;
      Voice.onSpeechPartialResults = onSpeechPartialResults;
      Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;
    } catch (error: any) {
      console.log(error.messsage);
    }

    // Clean up by removing event listeners when the component unmounts
    return () => {
      Voice.onSpeechStart = () => {};
      Voice.onSpeechRecognized = () => {};
      Voice.onSpeechEnd = () => {};
      Voice.onSpeechError = () => {};
      Voice.onSpeechResults = () => {};
      Voice.onSpeechPartialResults = () => {};
      Voice.onSpeechVolumeChanged = () => {};
    };
  }, []); // The empty array as the second argument means this effect runs only once (on mount/unmount)

  return (
    <View style={styles.container}>
      {state.started ? (
        <TouchableHighlight onPress={_stopRecognizing}>
          <View
            style={{
              width: 75,
              height: 75,
              borderRadius: 75,
              backgroundColor: "#6E01EF",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {[...Array(3).keys()].map((index) => {
              return (
                <View
                  key={index}
                  style={[
                    StyleSheet.absoluteFillObject,
                    { backgroundColor: "#6E01EF", borderRadius: 75 },
                  ]}
                />
              );
            })}
            <FontAwesome name="microphone-slash" size={24} color="#fff" />
          </View>
        </TouchableHighlight>
      ) : (
        <TouchableHighlight onLongPress={_startRecognizing}>
          <View
            style={{
              width: 75,
              height: 75,
              borderRadius: 75,
              backgroundColor: "#6E01EF",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FontAwesome name="microphone" size={24} color="#fff" />
          </View>
        </TouchableHighlight>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
  },
  container: {},
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  action: {
    textAlign: "center",
    color: "#0000FF",
    marginVertical: 5,
    fontWeight: "bold",
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5,
  },
  stat: {
    textAlign: "center",
    color: "#B0171F",
    marginBottom: 1,
  },
});
export default Record;
