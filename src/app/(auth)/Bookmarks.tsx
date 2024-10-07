import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native'
import { useBookmarks } from './BookmarksContext'
import { Ionicons } from '@expo/vector-icons'

export default function Bookmarks() {
  const { bookmarks, removeBookmark } = useBookmarks()

  const renderItem = ({ item }) => (
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
          onPress={() => removeBookmark(item.id)}
          style={styles.removeButton}
        >
          <Ionicons name="trash-outline" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      {bookmarks.length === 0 ? (
        <Text style={styles.emptyMessage}>No bookmarks yet</Text>
      ) : (
        <FlatList
          data={bookmarks}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  list: {
    paddingBottom: 16,
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
  removeButton: {
    marginTop: 8,
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
})
