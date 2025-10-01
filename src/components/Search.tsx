import React from 'react'

const Search = () => {
  return (
    <div className="flex-1 rounded-2xl border border-border focus-within:ring-primary ring-2 ring-transparent overflow-hidden">
      <input
        type="search"
        placeholder="Search..."
        className="w-full h-full p-2 outline-none px-4 border-0 focus:ring-0"
      />
    </div>
  )
}

export default Search
