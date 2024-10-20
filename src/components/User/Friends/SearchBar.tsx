import React, {ChangeEvent} from 'react'
import { FaSearch} from 'react-icons/fa';

interface SearchResultProps{
    onSearchChange:(query: string) => void;
}

const SearchBar: React.FC<SearchResultProps> = ({onSearchChange}) => {

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        onSearchChange(e.target.value)
    }

  return (
    <div className='grid col-span-2 bg-white h-20 rounded-md'>
        <div className="relative w-full p-4">
        <div className="absolute inset-y-0 flex items-center  pb-2 pl-3 pointer-events-none">
            <FaSearch className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </div>
        <input
            type="text"
            id="simple-search"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search Username..."
            onChange={handleInputChange}
            required
        />
        </div>
    </div>
  )
}

export default SearchBar