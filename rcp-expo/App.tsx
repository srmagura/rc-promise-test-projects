import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { CancellablePromise, Cancellation } from "real-cancellable-promise";
import { cancellableFetch } from "./cancellableFetch";

function getActivity(): CancellablePromise<unknown> {
  return cancellableFetch("https://www.boredapi.com/api/activity");
}

export default function App() {
  const [response, setResponse] = useState("");

  async function doRequest(): Promise<void> {
    try {
      const obj = await getActivity();
      setResponse(JSON.stringify(obj));
    } catch (e) {
      console.error(e);
    }
  }

  const [timerFinished, setTimerFinished] = useState(false);
  const timerRef = useRef<CancellablePromise<unknown>>();

  async function doTimer(): Promise<void> {
    setTimerFinished(false);

    try {
      await (timerRef.current = CancellablePromise.delay(3000));
      setTimerFinished(true);
    } catch (e) {
      if (e instanceof Cancellation) {
        return;
      }

      throw e;
    }
  }

  function cancelTimer(): void {
    timerRef.current?.cancel();
  }

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 16 }}>
        <Button onPress={doRequest} title="Start request" />
      </View>
      <Text>Response: {response}</Text>

      <View style={{ marginTop: 32, marginBottom: 16, flexDirection: "row" }}>
        <View style={{ marginRight: 32 }}>
          <Button onPress={doTimer} title="Start timer" />
        </View>
        <Button onPress={cancelTimer} title="Cancel timer" />
      </View>
      <Text>Timer finished: {timerFinished.toString()}</Text>
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
