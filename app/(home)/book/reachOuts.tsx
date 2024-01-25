import React from 'react';
import { View, Text, StatusBar } from 'react-native';
import Colors from '../../../constants/Colors';
import { useNavigation } from 'expo-router/src/useNavigation';
import { useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import Seperator from '../../../components/seperator';
import CustomButton from '../../../components/CustomButton';


function ReachOuts() {

    let reachOutData = [{ location: "Patan Dhoka, Asan", guideName: "John Doe", languages: ["Eng", "Nep"], Time: "14th Dec", peopleNumber: 3, Description: "I have children so, I need you to be able to juggle and do magic tricks like a professional magician otherwise you are cancelled.", coverage: ["Travel Coverage", "Food Coverage", "Stay Coverage"] }, { location: "Kupondole, Nepal", guideName: "lol Doe", languages: ["Eng", "Nep"], Time: "14th Dec", peopleNumber: 3, Description: "No personal requests", coverage: ["Travel Coverage", "Food Coverage", "Stay Coverage"] }]
    const [tourData, setTourData] = useState<{
        location: string;
        guideName: string;
        languages: string[];
        Time: string;
        peopleNumber: number;
        Description: string;
        coverage: string[];
    }[]>(reachOutData);
    useNavigation().setOptions({
        headerShown: false
    })
    return (
        <ScrollView className='mx-4 mt-3' style={{ paddingTop: StatusBar.currentHeight }}>
            <Text className='text-2xl' style={{ color: Colors.primary['primary-0'] }}>Reach Outs</Text>
            <Seperator />
            <View style={{ marginTop: 10 }}>
                {tourData.map((item, index) => (
                    <ReachOutItem key={index} item={item} index={index} />
                ))}
            </View>
        </ScrollView>
    );
}

function ReachOutItem(props: { item: { location: string; guideName: string; languages: string[]; Time: string; peopleNumber: number; Description: string; coverage: string[]; }; index: number; }) {
    const { item, index } = props;
    const [accepted, setAccepted] = useState(false);
    const handleAccept = () => {
        setAccepted(true);
    }
    return (
        <View style={{ marginBottom: 20 }}>
            <Text className='text-xl'>{item.location}</Text>
            <Text className='text-sm' style={{ color: Colors.primary['primary-3'] }}>{item.guideName}</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ marginTop: 10, flexDirection: "column" }}>
                    <Text className='text-sm'>Languages : {item.languages.join(", ")}</Text>
                    <Text className='text-sm'>Time : {item.Time}</Text>
                    <Text className='text-sm'>No. of people : {item.peopleNumber}</Text>
                </View>
                <View style={{ marginTop: 10 }}>
                    <Text className='text-sm' style={{ color: Colors.primary.btn }}>{item.coverage.join("\n")}</Text>
                </View>
            </View>
            <View className='mt-3'>
                <Text className='text-sm'>{item.Description}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
                <CustomButton
                    title={accepted ? "Accepted" : "Accept"}
                    onPress={() => { handleAccept() }}
                    style={{ width: 100 }}
                    disabled={accepted}
                />
            </View>
            <Seperator />
        </View>
    )
}
export default ReachOuts;