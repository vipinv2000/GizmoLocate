import React from 'react'
import { SearchContextProvide } from '../../context/SearchContext'
import Searchproducts from './Search'
import ViewCart from './ViewCart'

const UserHome = () => {
  return (
    <div>
      <SearchContextProvide>
        <Searchproducts />
      </SearchContextProvide>
      <h1>ccccc</h1>
      <ViewCart />
    </div>
  )
}

export default UserHome