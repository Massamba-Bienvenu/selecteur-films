import React, { Component } from "react";
import MoviesTable from "./common/MoviesTable";
import Pagination from "../components/Pagination";
import ListGroup from "./common/ListGroup";
import { paginate } from "../utils/paginate.js";
import { getGenres } from "../services/fakeGenreService";
import { getMovies } from "../services/fakeMovieService.js";
import _ from "lodash";

export class Movies extends Component {
  //Setting the State
  state = {
    genres: [],
    movies: [],
    currentPage: 1,
    pageSize: 4,
    sortColumn: { path: "title", order: "asc" },
  };

  //Life Cycle hooks
  componentDidMount() {
    const genres = [{ _id: "", name: "All Genres" }, ...getGenres()];
    this.setState({ movies: getMovies(), genres });
  }

  //Methods
  handleLike = (movie) => {
    const movies = [...this.state.movies];
    const index = movies.indexOf(movie);
    movies[index] = { ...movies[index] };
    movies[index].liked = !movies[index].liked;
    this.setState({ movies });
  };

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

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  getPageData = () => {
    const {
      pageSize,
      currentPage,
      selectedGenre,
      movies: allMovies,
      sortColumn,
    } = this.state;

    //Filtering before pagination:
    const filtered =
      selectedGenre && selectedGenre._id
        ? allMovies.filter((m) => m.genre._id === selectedGenre._id)
        : allMovies;

    //Sorting after filtering
    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    //Paginate movies
    const movies = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: movies };
  };

  // Rendering
  render() {
    const { pageSize, currentPage } = this.state;

    const { totalCount, data: movies } = this.getPageData();

    const message =
      this.state.movies.length === 0
        ? `There are no movies in the database.`
        : `Showing ${totalCount} movies in the database`;

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
          <MoviesTable
            movies={movies}
            sortColumn={this.state.sortColumn}
            onLike={this.handleLike}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
          />

          <Pagination
            itemsCount={totalCount}
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
