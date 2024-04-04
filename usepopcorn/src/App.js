import { useEffect, useState } from "react";
import StarRating from "./StarRating";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "f77ce815";
export default function App() {
  const [query, setQuery] = useState("Amazon");
  const [movies, setMovies] = useState([]);
  const [isLoader, setIsLoader] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [watched, setWatched] = useState([]);

  // fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=interstellar
  // `)
  //   .then((res) => res.json())
  //   .then((data) => setMovies(data.Search));
  // useEffect(() => {
  //   console.log("A");
  // }, [query]);
  // useEffect(() => {
  //   console.log("B");
  // });

  function handleSelectMovie(id) {
    // setSelectedId(id);
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }
  function handleAddWatched(movie) {
    console.log(watched);
    setWatched((watched) => [...watched, movie]);
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }
  useEffect(() => {
    async function fetchData() {
      try {
        // console.log(query);
        setError("");
        setIsLoader(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
        );
        if (!res.ok)
          throw new error("Something went wrong with fetching movies");
        const data = await res.json();
        if (data.Response === "False") throw new Error("Movie not found");
        // console.log(data.Search);
        setMovies(data.Search);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoader(false);
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
    }
    fetchData();
  }, [query]);

  return (
    <>
      <Navbar query={query} onSetQuery={setQuery}>
        <Numresult movies={movies} />
      </Navbar>
      <Main>
        <ListBox movies={movies}>
          {/* {isLoader ? <Loader /> : <List movies={movies} />} */}
          {/* only one statement run at a time */}
          {isLoader && <Loader />}
          {!isLoader && !error && (
            <List movies={movies} handleSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </ListBox>
        {selectedId ? (
          <ListBox movies={movies}>
            {selectedId ? (
              <MovieDetails
                onAddWatched={handleAddWatched}
                selectedId={selectedId}
                handleCloseMovie={handleCloseMovie}
              />
            ) : null}
          </ListBox>
        ) : (
          <Watched
            watched={watched}
            setWatched={setWatched}
            handleAddWatched={handleAddWatched}
          />
        )}
      </Main>
    </>
  );
}

const ErrorMessage = ({ message }) => {
  return (
    <p className="error">
      <span>💀</span>
      {message}
    </p>
  );
};
const Loader = () => {
  return <p className="loader">Loading...</p>;
};

const Navbar = ({ children, query, onSetQuery }) => {
  return (
    <nav className="nav-bar">
      <Logo />
      <Input query={query} onSetQuery={onSetQuery} />
      {children}
    </nav>
  );
};
const Logo = () => {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
};
const Input = ({ query, onSetQuery }) => {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => onSetQuery(e.target.value)}
    />
  );
};
const Numresult = ({ movies }) => {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
};

const Main = ({ children }) => {
  return (
    <main className="main">
      {children}
      {/* <Watched /> */}
    </main>
  );
};

const ListBox = ({ children }) => {
  const [isOpen1, setIsOpen1] = useState(true);
  return (
    <div className="box">
      <Button isOpen1={isOpen1} setIsOpen1={setIsOpen1} />
      {isOpen1 && children}
    </div>
  );
};
function MovieDetails({ selectedId, handleCloseMovie, onAddWatched }) {
  const [movie, setMovie] = useState({});
  const [isLoader, setIsLoader] = useState(false);
  const [userRating, setUserRating] = useState("");

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;
  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };

    onAddWatched(newWatchedMovie);
    handleCloseMovie();

    // setAvgRating(Number(imdbRating));
    // setAvgRating((avgRating) => (avgRating + userRating) / 2);
  }
  // console.log(title, year);
  //Pehle movie empty ho gi to display undefined
  // then due to useEffect value occurs
  useEffect(() => {
    setIsLoader(true);
    async function getMovieDetails() {
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
      );
      const data = await res.json();
      setMovie(data);
      setIsLoader(false);
    }
    getMovieDetails();
  }, [movie]);
  return (
    <div className="details">
      <>
        <header>
          <button onClick={handleCloseMovie} className="btn-back">
            &larr;
          </button>
          <img src={poster} alt={`Poster of ${movie} movie`} />
          <div className="details-overview">
            <h2>{title}</h2>
            <p>
              {released} &bull; {runtime}
            </p>
            <p>{genre}</p>
            <p>
              <span>⭐️</span>
              {imdbRating} IMDb rating
            </p>
          </div>
        </header>

        <section>
          <div className="rating">
            <StarRating maxRating={10} size={24} onSetRating={setUserRating} />
            {userRating > 0 && (
              <button className="btn-add" onClick={handleAdd}>
                + Add to list
              </button>
            )}
          </div>
          <p>
            <em>{plot}</em>
          </p>
          <p>Starring {actors}</p>
          <p>Directed by {director}</p>
        </section>
      </>
    </div>
  );
}
const Watched = ({ watched, setWatched }) => {
  // const [watched, setWatched] = useState(tempWatchedData);

  const [isOpen2, setIsOpen2] = useState(true);

  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
      >
        {isOpen2 ? "–" : "+"}
      </button>
      {isOpen2 && (
        <>
          <div className="summary">
            <h2>Movies you watched</h2>
            <div>
              <p>
                <span>#️⃣</span>
                <span>{watched.length} movies</span>
              </p>
              <p>
                <span>⭐️</span>
                <span>{avgImdbRating}</span>
              </p>
              <p>
                <span>🌟</span>
                <span>{avgUserRating}</span>
              </p>
              <p>
                <span>⏳</span>
                <span>{avgRuntime} min</span>
              </p>
            </div>
          </div>

          <ul className="list">
            {watched.map((movie) => (
              <li key={movie.imdbID}>
                <img src={movie.poster} alt={`${movie.title} poster`} />
                <h3>{movie.title}</h3>
                <div>
                  <p>
                    <span>⭐️</span>
                    <span>{movie.imdbRating}</span>
                  </p>
                  <p>
                    <span>🌟</span>
                    <span>{movie.userRating}</span>
                  </p>
                  <p>
                    <span>⏳</span>
                    <span>{movie.runtime} min</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

const Button = ({ isOpen1, setIsOpen1 }) => {
  return (
    <button className="btn-toggle" onClick={() => setIsOpen1((open) => !open)}>
      {isOpen1 ? "–" : "+"}
    </button>
  );
};
const List = ({ movies, handleSelectMovie }) => {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <li onClick={() => handleSelectMovie(movie.imdbID)} key={movie.imdbID}>
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>🗓</span>
              <span>{movie.Year}</span>
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
};
