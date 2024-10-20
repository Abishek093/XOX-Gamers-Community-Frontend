import React, { useEffect, useState } from 'react';

interface Game {
  id: number;
  name: string;
  background_image: string;
  released: string;
  platforms: { platform: { name: string } }[];
  genres: { name: string }[];
}

const GamingNews: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const apiKey = import.meta.env.VITE_RAWG_API;

  // const fetchGames = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await fetch(
  //       `https://api.rawg.io/api/games?key=${apiKey}&page=${page}&page_size=40&ordering=-released`
  //     );
  //     const data = await response.json();
      
  //     // Filter games with images
  //     const gamesWithImages = data.results.filter((game: Game) => game.background_image);
      
  //     setGames(prevGames => {
  //       const newGames = [...prevGames, ...gamesWithImages];
  //       // Remove duplicates based on game id
  //       return Array.from(new Map(newGames.map(game => [game.id, game])).values());
  //     });

  //     // If we don't have enough games with images, fetch more
  //     if (gamesWithImages.length < 15 && data.next) {
  //       setPage(prevPage => prevPage + 1);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching games:', error);
  //   }
  //   setLoading(false);
  // };
  const fetchGames = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.rawg.io/api/games?key=${apiKey}&page=${page}&page_size=40&ordering=-released`
      );
      const data = await response.json();
  
      const gamesWithImages = data.results.filter((game: Game) => 
        game.background_image && !game.genres.some(genre => genre.name === 'Casual' || genre.name === 'Indie' || genre.name === 'RPG')
      );
  
      setGames(prevGames => {
        const newGames = [...prevGames, ...gamesWithImages];
        return Array.from(new Map(newGames.map(game => [game.id, game])).values());
      });
  
      // If we don't have enough games with images, fetch more
      if (gamesWithImages.length < 15 && data.next) {
        setPage(prevPage => prevPage + 1);
      }
    } catch (error) {
      console.error('Error fetching games:', error);
    }
    setLoading(false);
  };
  
  useEffect(() => {
    fetchGames();
  }, [page]);

  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !loading) {
      setPage(prevPage => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Latest Gaming Updates</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <div key={game.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <img
              src={game.background_image}
              alt={game.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2 line-clamp-2">{game.name}</h2>
              <p className="text-sm text-gray-600 mb-2">
                Release Date: {game.released ? new Date(game.released).toLocaleDateString() : 'TBA'}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Platforms: {game.platforms ? game.platforms.map(p => p.platform.name).join(', ') : 'N/A'}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Genres: {game.genres ? game.genres.map(g => g.name).join(', ') : 'N/A'}
              </p>
              <a
                href={`https://rawg.io/games/${game.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
              >
                More Info
                <svg className="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>
      {loading && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="w-full h-48 bg-gray-300"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                <div className="mt-4 flex justify-between items-center">
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  <div className="h-8 bg-gray-300 rounded w-24"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GamingNews;