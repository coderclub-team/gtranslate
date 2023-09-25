import { Tabs } from "expo-router";
import { Entypo } from "@expo/vector-icons";
import { Button, Dialog, Portal, PaperProvider, Text } from 'react-native-paper';
import React from "react";
export default function Layout() {
  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);
  return (
    <PaperProvider>
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Entypo name="language" size={size} color={color} />
          ),
          tabBarLabel: "Translate",
          title: "Translate",
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Entypo name="chat" size={size} color={color} />
          ),
          tabBarLabel: "Connect",
          title: "Connect",
        }}
      />
    </Tabs>
    </PaperProvider>
  );
}
