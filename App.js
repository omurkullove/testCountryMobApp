/** @format */

import Details from "./screens/Details/Details";
import Favourites from "./screens/Favourites/Favourites";
import Main from "./screens/Main/Main";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { store } from "./redux/store";

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <Provider store={store}>
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name='Main'
              component={Main}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name='Details'
              component={Details}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name='Favourites'
              component={Favourites}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </Provider>
  );
}
