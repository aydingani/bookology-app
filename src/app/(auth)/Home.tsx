import { useState, useEffect } from 'react'
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import axios from 'axios'
import { Ionicons } from '@expo/vector-icons'
import { useBookmarks } from '../BookmarksContext'
import { GOOGLE_BOOKS_API_KEY } from '@env'

interface Book {
  id: string
  volumeInfo: {
    title: string
    authors?: string[]
    publisher?: string
    publishedDate?: string
    language?: string
    imageLinks?: {
      thumbnail?: string
    }
  }
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [books, setBooks] = useState<Book[]>([])
  const { bookmarks, addBookmark } = useBookmarks()

  const handleSearch = async () => {
    if (!searchQuery) return

    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${searchQuery}&key=${GOOGLE_BOOKS_API_KEY}`
      )
      setBooks(response.data.items)
    } catch (error) {
      console.error('Error fetching books: ', error)
    }
  }

  const handleBookmark = (book: Book) => {
    addBookmark(book)
  }

  const isBookmarked = (book: Book) => {
    return bookmarks.some((b) => b.id === book.id)
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search for books..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
      />
      <Button title="Search" onPress={handleSearch} />
      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.bookItem}>
            {item.volumeInfo.imageLinks && (
              <Image
                source={{ uri: item.volumeInfo.imageLinks.thumbnail }}
                style={styles.bookImage}
              />
            )}
            <View style={styles.infoContainer}>
              <Text style={styles.title}>{item.volumeInfo.title}</Text>
              <Text style={styles.publisher}>{item.volumeInfo.publisher}</Text>
              <Text style={styles.authors}>
                {item.volumeInfo.authors?.join(', ')}
              </Text>
              <Text style={styles.details}>
                {item.volumeInfo.publishedDate} ({item.volumeInfo.language})
              </Text>
              <TouchableOpacity
                onPress={() => handleBookmark(item)}
                style={styles.bookmarkButton}
              >
                <Ionicons
                  name={isBookmarked(item) ? 'bookmark' : 'bookmark-outline'}
                  size={24}
                  color="blue"
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  bookItem: {
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bookImage: {
    width: 100,
    height: 150,
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  publisher: {
    fontStyle: 'italic',
    marginBottom: 4,
  },
  authors: {
    marginBottom: 4,
  },
  details: {
    color: 'gray',
  },
  bookmarkButton: {
    marginTop: 8,
  },
})
