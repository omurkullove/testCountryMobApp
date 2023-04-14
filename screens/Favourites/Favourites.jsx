/** @format */

import {
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import tw from "tailwind-react-native-classnames";
import { useNavigation } from "@react-navigation/native";

const Favourites = () => {
  const [items, setItems] = useState([]);

  const naviagation = useNavigation();

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("fav", (err, result) => {
        if (result !== null) {
          setItems(JSON.parse(result));
        } else {
          setItems([]);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  async function clearStorage() {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteOneItemFromStorage(population) {
    try {
      const data = await AsyncStorage.getItem("fav");
      if (!data) return;
      const newData = JSON.parse(data).filter(
        item => item.population !== population
      );
      await AsyncStorage.setItem("fav", JSON.stringify(newData));
      setItems(newData);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <SafeAreaView style={[tw`h-full `, {}]}>
      <ScrollView refreshControl={<RefreshControl onRefresh={getData} />}>
        <View style={[tw`flex items-center mt-7`, {}]}>
          <TouchableOpacity
            style={[tw`flex items-center border-2 p-3`]}
            onPress={() => clearStorage()}
          >
            <Text>Очистить избранные</Text>
          </TouchableOpacity>
        </View>
        <View style={[tw`flex items-center`, {}]}>
          {items &&
            items?.map(item => (
              <TouchableOpacity
                onPress={() => {
                  naviagation.navigate("Details", {
                    code: item?.ccn3,
                  });
                }}
                key={item?.ccn3}
                style={[tw`rounded-lg border-2 mt-10 `, { width: "70%" }]}
              >
                <View style={[tw``]}>
                  <Image
                    style={[tw`w-full h-28  rounded-lg `, {}]}
                    resizeMode='cover'
                    source={{
                      uri: item?.flags?.png,
                    }}
                  />
                  <View
                    style={[
                      tw`rounded-lg flex justify-evenly`,
                      { height: 200 },
                    ]}
                  >
                    <Text>Название: {item?.name?.common}</Text>
                    <Text>Столица: {item?.capital?.[0]}</Text>
                    <Text>Население: {item?.population}</Text>
                    <Text>Площадь: {item?.area} km²</Text>
                    <Text>Код страны: {item?.ccn3}</Text>
                    <Text>
                      Язык:
                      {item?.languages
                        ? Object.values(item?.languages).join(" / ")
                        : "Нет информации"}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => deleteOneItemFromStorage(item?.population)}
                  style={[
                    tw` w-full border-2 h-16  flex items-center justify-center`,
                    {},
                  ]}
                >
                  <Text
                    style={[
                      tw`font-bold`,
                      { textAlign: "center ", zIndex: 999 },
                    ]}
                  >
                    Удалить из избранных
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          <Text>ewfjefoi</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Favourites;
