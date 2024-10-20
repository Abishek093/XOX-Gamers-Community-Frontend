// import React, { useCallback, useState, useEffect } from "react";
// import SearchBar from "../../components/User/Friends/SearchBar";
// import FriendRequest from "../../components/User/Friends/FriendRequest";
// import SearchResult from "../../components/User/Friends/SearchResult";
// import debounce from "lodash.debounce";
// import axiosInstance from "../../services/userServices/axiosInstance";

// interface User {
//   id: string;
//   username: string;
//   displayName: string;
//   profileImage: string;
// }

// const Friends: React.FC = () => {
//   const API_URL = import.meta.env.VITE_USER_API_URL;

//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchResults, setSearchResults] = useState<User[]>([]);
//   const [lastQuery, setLastQuery] = useState("");

//   const fetchSearchResults = async (query: string) => {
//     if (query.trim() !== "" && query !== lastQuery) {
//       try {
//         const response = await axiosInstance.get(
//           `${API_URL}searchUsers?query=${query}`
//         );
//         setSearchResults(response.data.results);
//         setLastQuery(query);
//       } catch (error) {
//         console.error("Error fetching search results:", error);
//       }
//     }
//   };

//   const debouncedSearchResult = useCallback(debounce(fetchSearchResults, 300), [
//     lastQuery,
//   ]);

//   const handleSearchChange = (query: string) => {
//     setSearchQuery(query);
//     debouncedSearchResult(query);
//   };

//   useEffect(() => {
//     return () => {
//       debouncedSearchResult.cancel();
//     };
//   }, [debouncedSearchResult]);

//   return (
//     <div className="p-12">
//       <div className="grid grid-cols-3 gap-4">
//         <p>Search Friends</p>
//         <p className="col-start-3 px-4">Friend Requests</p>
//       </div>
//       <div className="grid grid-cols-3 gap-4 pt-4">
//         <div className="col-span-2">
//           <SearchBar onSearchChange={handleSearchChange} />
//           <div className="h-auto mt-4 rounded-md">
//             <SearchResult results={searchResults} />
//           </div>
//         </div>
//         <div className="col-start-3">
//           <FriendRequest />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Friends;
import React, { useCallback, useState, useEffect } from "react";
import SearchBar from "../../components/User/Friends/SearchBar";
import FriendRequest from "../../components/User/Friends/FriendRequest";
import SearchResult from "../../components/User/Friends/SearchResult";
import debounce from "lodash.debounce";
import axiosInstance from "../../services/userServices/axiosInstance";

interface User {
  id: string;
  username: string;
  displayName: string;
  profileImage: string;
}

const Friends: React.FC = () => {
  const API_URL = import.meta.env.VITE_USER_API_URL;
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSuggestions = async () => {
    try {
      const response = await axiosInstance.get(`fetch-suggestions`);
      setSuggestions(response.data.results);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setLoading(false);
    }
  };

  const fetchSearchResults = async (query: string) => {
    if (query.trim() !== "") {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `${API_URL}searchUsers?query=${query}`
        );
        setSearchResults(response.data.results);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setLoading(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const debouncedSearchResult = useCallback(
    debounce(fetchSearchResults, 300),
    []
  );

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
    } else {
      debouncedSearchResult(query);
    }
  };

  useEffect(() => {
    fetchSuggestions();
    return () => {
      debouncedSearchResult.cancel();
    };
  }, [debouncedSearchResult]);

  return (
    <div className="p-12">
      <div className="grid grid-cols-3 gap-4">
        <p>Search Friends</p>
        <p className="col-start-3 px-4">Friend Requests</p>
      </div>
      <div className="grid grid-cols-3 gap-4 pt-4">
        <div className="col-span-2">
          <SearchBar onSearchChange={handleSearchChange} />
          <div className="h-auto mt-4 rounded-md">
            {loading ? (
              <p>Loading...</p>
            ) : searchQuery.trim() === "" ? (
              <SearchResult results={suggestions} title="Suggestions" />
            ) : (
              <SearchResult results={searchResults} title="Search Results" />
            )}
          </div>
        </div>
        <div className="col-start-3">
          <FriendRequest />
        </div>
      </div>
    </div>
  );
};

export default Friends;