/** @format */

import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";

import tw from "tailwind-react-native-classnames";
import { useEffect } from "react";
import { useLazyFetchOneQuery } from "../../redux/CountryApi";

const Details = ({ route }) => {
  const { code } = route.params;

  const [fetchOne, { isError, isLoading, data, isSuccess }] =
    useLazyFetchOneQuery();

  const hhh = async () => {
    await fetchOne(code);
  };

  useEffect(() => {
    hhh();
  }, []);
  {
    isError && <Text>Server error...</Text>;
  }

  return (
    <SafeAreaView style={[tw`h-full  `, {}]}>
      <ScrollView refreshControl={<RefreshControl onRefresh={hhh} />}>
        {data ? (
          <View style={[tw` p-5`, {}]}>
            <Image
              resizeMode='cover'
              source={{ uri: data[0]?.flags?.png }}
              style={[tw`w-full `, { height: 200 }]}
            />
            <View style={[tw`flex justify-center items-center`, {}]}>
              <Text style={tw`text-xl font-bold mt-2`}>
                Название: {data[0]?.name?.common}
              </Text>
              <Text style={tw`text-xl font-bold mt-2`}>
                Столица: {data[0]?.capital?.[0]}
              </Text>
              <Text style={tw`text-xl font-bold mt-2`}>
                Население: {data[0]?.population}
              </Text>
              <Text style={tw`text-xl font-bold mt-2`}>
                Площадь: {data[0]?.area} km²
              </Text>
              <Text style={tw`text-xl font-bold mt-2`}>
                Код страны: {data[0]?.ccn3}
              </Text>
            </View>
            <Text
              style={[
                tw`mt-5 font-semibold text-lg  text-gray-500`,
                { textAlign: "center" },
              ]}
            >
              {data[0]?.flags?.alt}
            </Text>
            <Text
              style={{
                textAlign: "center",
                marginTop: 20,
                fontWeight: "bold",
                fontSize: 25,
              }}
            >
              Национальный герб
            </Text>
            <Image
              resizeMode='cover'
              source={{ uri: data[0]?.coatOfArms?.png }}
              style={[tw`w-full mt-7 `, { height: 400 }]}
            />
          </View>
        ) : (
          <ActivityIndicator size={"large"} color={"black"} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Details;
