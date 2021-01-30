import React, { Component } from "react";
import Pagination from "../components/Pagination";
import { getMovies } from "../services/fakeMovieService.js";
import { paginate } from "../utils/paginate.js";

export class Movies extends Component {
  state = {
    currentPage: 1,
    pageSize: 4,
    movies: getMovies(),
  };

  handleDelete = (movie) => {
    const movies = this.state.movies.filter((m) => m._id !== movie._id);
    this.setState({ movies: movies });
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  render() {
    const message =
      this.state.movies.length === 0
        ? `There are no movies in the database.`
        : `Showing ${this.state.movies.length} movies in the database`;

    const { pageSize, currentPage, movies:allMovies } = this.state;

    //Paginate movies
    const movies = paginate(allMovies, currentPage, pageSize);

    return (
      <React.Fragment>
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
          itemsCount={this.state.movies.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={this.handlePageChange}
        />
      </React.Fragment>
    );
  }
}

export default Movies;
