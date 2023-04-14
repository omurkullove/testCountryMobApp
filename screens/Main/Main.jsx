/** @format */

import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import {
  useLazyFetchAllCountriesQuery,
  useLazyFetchCountriesByRegionQuery,
  useLazySearcgCountriesQuery,
} from "../../redux/CountryApi";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "tailwind-react-native-classnames";
import { useNavigation } from "@react-navigation/native";

const REGIONS = [
  {
    id: "1",
    name: "Aзия",
    endpoint: "Asia",
  },
  {
    id: "2",
    name: "Европа",
    endpoint: "Europe",
  },
  {
    id: "3",
    name: "Африка",
    endpoint: "Africa",
  },
  {
    id: "4",
    name: "Америка",
    endpoint: "America",
  },
  {
    id: "5",
    name: "Австралия и Океания",
    endpoint: "Oceania",
  },
];

const Main = () => {
  const [value, setValue] = useState("");

  const [isAll, setIsAll] = useState(true);
  const [isByRegions, setIsByRegions] = useState(false);
  const [isBySearch, setIsBySearch] = useState(false);

  const [favourites, setFavourites] = useState([]);

  const [fff, setFff] = useState([]);

  const navigation = useNavigation();

  // Fetch all Countries
  const [fectCountry, { isLoading: isAllLoading, data }] =
    useLazyFetchAllCountriesQuery("");

  // Fetch country by region
  const [fetchByRegion, { data: regionCountries, isLoading: isRegionLoading }] =
    useLazyFetchCountriesByRegionQuery();

  const handleFetchByRegion = async region => {
    await fetchByRegion(region);
    setIsByRegions(true);
    setIsAll(false);
    setIsBySearch(false);
  };

  // Fetch country by seatch field
  const [
    handleSearchCountry,
    { data: SearchedRes, isLoading: isSearchLoadig },
  ] = useLazySearcgCountriesQuery();

  //  First render of all Countries
  useEffect(() => {
    const loadData = async () => await fectCountry();
    loadData();

    console.log(fff);
    console.log(fff.includes(item => item.population == "287371"));
  }, []);

  // Fetch by input value
  const handleSearch = async () => {
    await handleSearchCountry(value.replace(/\s/g, ""));

    setIsBySearch(true);
    setIsByRegions(false);
    setIsAll(false);
    setValue("");
  };

  const addData = async value => {
    setFavourites(prev => [...prev, value]);
    try {
      await AsyncStorage.setItem("fav", JSON.stringify(favourites));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={tw`  h-full p-5  bg-gray-100`}>
      <View style={[tw`flex flex-row  justify-between `, {}]}>
        {REGIONS.map(region => (
          <TouchableOpacity
            onPress={() => handleFetchByRegion(region.endpoint)}
            key={region.id}
            style={[
              tw`border-2 py-2 flex justify-center items-center  bg-gray-200`,
              { width: 70 },
            ]}
          >
            <Text style={[tw`text-xs font-bold`, { color: "green" }]}>
              {region.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={[tw`flex items-center w-full mt-2`, {}]}>
        <TouchableOpacity
          onPress={() => {
            fectCountry();
            setIsByRegions(false);
            setIsBySearch(false);
            setIsAll(true);
          }}
          style={[tw`border-2 py-2 flex justify-center items-center w-1/2`]}
        >
          <Text style={[tw`font-semibold`, {}]}>Показать все страны</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Favourites")}
          style={[tw`border-2 py-2 flex  items-center w-1/2 mt-5`]}
        >
          <Text>Избранные</Text>
        </TouchableOpacity>
      </View>
      <View style={[tw` mt-8 flex flex-row justify-between mb-8`, {}]}>
        <TextInput
          value={value}
          onChangeText={setValue}
          placeholder='Введите название страны'
          style={[tw`border-2 rounded-xl px-5`, { width: "70%", height: 50 }]}
        />
        <TouchableOpacity
          onPress={handleSearch}
          style={[
            tw`border-2 rounded-xl flex items-center justify-center`,
            { width: "20%" },
          ]}
        >
          <Text>Поиск</Text>
        </TouchableOpacity>
      </View>
      <ScrollView refreshControl={<RefreshControl onRefresh={fetchByRegion} />}>
        <View style={[tw`mt-10 h-full flex items-center mt-10`, {}]}>
          {isAllLoading && <ActivityIndicator size={"large"} color={"black"} />}
          {isRegionLoading && (
            <ActivityIndicator size={"large"} color={"black"} />
          )}
          {isSearchLoadig && (
            <ActivityIndicator size={"large"} color={"black"} />
          )}

          {isAll &&
            data?.map(item => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Details", {
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
                  style={[
                    tw` w-full border-2 bg-blue-400 text-white h-16 flex items-center justify-center `,
                    {},
                  ]}
                  onPress={() => addData(item)}
                >
                  <Text style={[tw`font-bold`, { zIndex: 999 }]}>
                    Добавить в избранные
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          {isByRegions &&
            regionCountries?.map(item => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Details", {
                    code: item?.ccn3,
                  })
                }
                key={item?.cca2}
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
                  style={[
                    tw` w-full border-2 bg-gray-500 text-white h-16 flex items-center justify-center `,
                    {},
                  ]}
                  onPress={() => addData(item)}
                >
                  <Text style={[tw`font-bold`, { zIndex: 999 }]}>
                    Добавить в избранные
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          {isBySearch &&
            SearchedRes?.map(item => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Details", {
                    code: item?.ccn3,
                  })
                }
                key={item?.cca3}
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
                  style={[
                    tw` w-full border-2 bg-gray-500 text-white h-16 flex items-center justify-center `,
                    {},
                  ]}
                  onPress={() => addData(item)}
                >
                  <Text style={[tw`font-bold`, { zIndex: 999 }]}>
                    Добавить в избранные
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Main;
