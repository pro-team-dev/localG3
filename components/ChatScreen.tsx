// components/ChatScreen.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import io from 'socket.io-client';
import { WebSocketServer } from "../Server/index"; // ?? Adjust the import path

const socket = io(WebSocketServer); // Replace with your server URL

const ChatScreen: React.FC = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [inputMessage, setInputMessage] = useState('');

    useEffect(() => {
        // Listen for incoming messages
        socket.on('message', (data) => {
            setMessages([...messages, data.text]);
        });

        return () => {
            // Clean up when component unmounts
            socket.disconnect();
        };
    }, [messages]);

    // Function to send a message
    const sendMessage = () => {
        // Emit the message to the server
        socket.emit('message', { text: inputMessage });
        setInputMessage('');
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                <TextInput
                    style={{ flex: 1, marginRight: 10, padding: 10, borderColor: 'gray', borderWidth: 1 }}
                    placeholder="Type your message"
                    value={inputMessage}
                    onChangeText={(text) => setInputMessage(text)}
                />
                <Button title="Send" onPress={sendMessage} />
            </View>
            <View>
                {messages.map((msg, index) => (
                    <Text key={index}>{msg}</Text>
                ))}
            </View>
        </View>
    );
};

export default ChatScreen;
