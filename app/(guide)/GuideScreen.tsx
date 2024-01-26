// app/guide/GuideScreen.tsx

import React from 'react';
import { View, Text } from 'react-native';
import ChatScreen from '../../components/ChatScreen';

const GuideScreen: React.FC = () => {
    return (
        <View>
            <Text>Guide Screen</Text>
            <ChatScreen />
        </View>
    );
};

export default GuideScreen;
