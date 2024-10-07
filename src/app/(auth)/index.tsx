import React from 'react'
import BottomTabs from './BottomTabs'
import { BookmarksProvider } from './BookmarksContext'

export default function AuthenticatedLayout() {
  return (
    <BookmarksProvider>
      <BottomTabs />
    </BookmarksProvider>
  )
}
