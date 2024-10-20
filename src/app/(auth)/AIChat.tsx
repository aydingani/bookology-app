import { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { OPENAI_API_KEY } from '@env'

interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
}

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadMessages()
  }, [])

  const loadMessages = async () => {
    try {
      const storedMessages = await AsyncStorage.getItem('aiChatMessages')
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages))
      }
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const saveMessages = async (updatedMessages: Message[]) => {
    try {
      await AsyncStorage.setItem(
        'aiChatMessages',
        JSON.stringify(updatedMessages)
      )
    } catch (error) {
      console.error('Error saving messages:', error)
    }
  }

  const sendMessage = async () => {
    if (inputText.trim() === '') return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    saveMessages(updatedMessages)
    setInputText('')
    setIsLoading(true)

    try {
      const chatHistory = updatedMessages.map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text,
      }))

      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: chatHistory,
          }),
        }
      )

      console.log('API Response Status:', response.status)

      if (!response.ok) {
        const errorBody = await response.text()
        console.error('Error response body:', errorBody)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('API Response Data:', data)

      const aiResponse =
        data.choices[0]?.message?.content ||
        "I'm sorry, I couldn't generate a response."

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
      }

      const newMessages = [...updatedMessages, aiMessage]
      setMessages(newMessages)
      saveMessages(newMessages)
    } catch (error) {
      console.error('Detailed error:', error)
      Alert.alert(
        'Error',
        `Failed to get response from OpenAI API. Error: ${error.message}`,
        [{ text: 'OK' }]
      )
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Sorry, I couldn't process your request. Error: ${error.message}`,
        sender: 'ai',
      }
      const newMessages = [...updatedMessages, errorMessage]
      setMessages(newMessages)
      saveMessages(newMessages)
    } finally {
      setIsLoading(false)
    }
  }

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageBubble,
        item.sender === 'user' ? styles.userBubble : styles.aiBubble,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  )

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message..."
          editable={!isLoading}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={sendMessage}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.sendButtonText}>Send</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messageList: {
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5EA',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})

export default AIChat
