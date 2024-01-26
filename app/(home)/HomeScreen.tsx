// app/home/HomeScreen.tsx

import React from 'react';
import { View, Text } from 'react-native';
import ChatScreen from '../../components/ChatScreen';

const HomeScreen: React.FC = () => {
    return (
        <View>
            <Text>Home Screen (Tourist)</Text>
            <ChatScreen />
        </View>
    );
};

export default HomeScreen;
