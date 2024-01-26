import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet } from "react-native";
import { io } from 'socket.io-client';

interface ChatComponentProps {
    endpoint: string;
}

interface Message {
    id: number;
    text: string;
}

const HomeScreen: React.FC<ChatComponentProps> = ({ endpoint }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io(endpoint, {
            transports: ['websocket'], // Use WebSocket transport only
        });
        setSocket(newSocket);

        newSocket.on("message", (message: Message) => {
            setMessages(prevMessages => [...prevMessages, message]);
        });

        // The cleanup function should return void, not a Socket object
        return () => { newSocket.disconnect(); };
    }, [endpoint]);

    const sendMessage = () => {
        if (input && socket) {
            const newMessage = { id: Date.now(), text: input };
            socket.emit('message', newMessage);
            console.log(newMessage);
            setMessages(prevMessages => [...prevMessages, newMessage]); // Also display the message on the guide's screen
            setInput('');
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                renderItem={({ item }) => <Text style={styles.message}>{item.text}</Text>}
                keyExtractor={(item) => item.id.toString()}
                inverted={false} // Set to true if you want the list to start from the bottom
            />
            <TextInput
                style={styles.input}
                value={input}
                onChangeText={setInput}
                placeholder="Type a message..."
                onSubmitEditing={sendMessage} // Send message when the user submits the input (e.g., pressing enter)
            />
            <Button title="Send" onPress={sendMessage} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start', // Changed to 'flex-start' to align items to the top
        alignItems: 'center',
        paddingTop: 20, // Add padding at the top
    },
    message: {
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
        backgroundColor: '#f0f0f0',
        alignSelf: 'stretch', // Make message bubbles stretch to the width of the container
        marginHorizontal: 10, // Add horizontal margin
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        width: '90%', // Reduced width to allow space for the button
        marginBottom: 10,
    },
});

export default HomeScreen;