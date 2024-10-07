import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

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

interface BookmarksContextType {
  bookmarks: Book[]
  addBookmark: (book: Book) => void
  removeBookmark: (bookId: string) => void
}

const BookmarksContext = createContext<BookmarksContextType | undefined>(
  undefined
)

export const BookmarksProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [bookmarks, setBookmarks] = useState<Book[]>([])

  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const storedBookmarks = await AsyncStorage.getItem('bookmarks')
        if (storedBookmarks) {
          setBookmarks(JSON.parse(storedBookmarks))
        }
      } catch (error) {
        console.error('Error loading bookmarks:', error)
      }
    }

    loadBookmarks()
  }, [])

  const saveBookmarks = async (updatedBookmarks: Book[]) => {
    try {
      await AsyncStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks))
    } catch (error) {
      console.error('Error saving bookmarks:', error)
    }
  }

  const addBookmark = (book: Book) => {
    setBookmarks((prevBookmarks) => {
      if (!prevBookmarks.some((b) => b.id === book.id)) {
        const updatedBookmarks = [...prevBookmarks, book]
        saveBookmarks(updatedBookmarks)
        return updatedBookmarks
      }
      return prevBookmarks
    })
  }

  const removeBookmark = (bookId: string) => {
    setBookmarks((prevBookmarks) => {
      const updatedBookmarks = prevBookmarks.filter(
        (book) => book.id !== bookId
      )
      saveBookmarks(updatedBookmarks)
      return updatedBookmarks
    })
  }

  return (
    <BookmarksContext.Provider
      value={{ bookmarks, addBookmark, removeBookmark }}
    >
      {children}
    </BookmarksContext.Provider>
  )
}

export const useBookmarks = () => {
  const context = useContext(BookmarksContext)
  if (context === undefined) {
    throw new Error('useBookmarks must be used within a BookmarksProvider')
  }
  return context
}
