import React, { Component } from "react";
import Pagination from "../components/Pagination";
import ListGroup from "./listGroup";
import { paginate } from "../utils/paginate.js";
import { getGenres } from "../services/fakeGenreService";
import { getMovies } from "../services/fakeMovieService.js";

export class Movies extends Component {
  //Setting the State
  state = {
    genres: [],
    movies: [],
    currentPage: 1,
    pageSize: 4,
  };

  //Life Cycle hooks
  componentDidMount() {
    const genres = [{ name: "All Genres" }, ...getGenres()];
    this.setState({ movies: getMovies(), genres });
  }

  //Methods
  handleGenreSelect = (genre) => {
    this.setState({ selectedGenre: genre, currentPage: 1 });
  };

  handleDelete = (movie) => {
    const movies = this.state.movies.filter((m) => m._id !== movie._id);
    this.setState({ movies: movies });
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  // Rendering
  render() {
    const {
      pageSize,
      currentPage,
      selectedGenre,
      movies: allMovies,
    } = this.state;

    //Filtering before pagination:
    const filtered =
      selectedGenre && selectedGenre._id
        ? allMovies.filter((m) => m.genre._id === selectedGenre._id)
        : allMovies;

    //Paginate movies
    const movies = paginate(filtered, currentPage, pageSize);

    const message =
      this.state.movies.length === 0
        ? `There are no movies in the database.`
        : `Showing ${filtered.length} movies in the database`;

    return (
      <div className="row">
        <div className="col-3">
          <ListGroup
            items={this.state.genres}
            selectedItem={this.state.selectedGenre}
            onItemSelect={this.handleGenreSelect}
          />
        </div>
        <div className="col">
          <p>{message}</p>
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Genre</th>
                <th>Stock</th>
                <th>Rate</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie._id}>
                  <td>{movie.title}</td>
                  <td>{movie.genre.name}</td>
                  <td>{movie.numberInStock}</td>
                  <td>{movie.dailyRentalRate}</td>
                  <td>
                    <button
                      onClick={() => this.handleDelete(movie)}
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            itemsCount={filtered.length}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }
}

export default Movies;
