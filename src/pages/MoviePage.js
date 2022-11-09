import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "../config";
import MovieCart from "../components/movie/MovieCart";
import useDebounce from "../hooks/useDebounce";
import ReactPaginate from "react-paginate";

// const pageCount = 5;
const itemsPerPage = 20;
const MoviePage = () => {
  const [pageCount, setPageCount] = useState(0);
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);

  const [nextPage, setNextPage] = useState(1);
  const [url, setUrl] = useState(
    `https://api.themoviedb.org/3/movie/popular?api_key=95f2419536f533cdaa1dadf83c606027&page=${nextPage}`
  );
  const { data, error } = useSWR(url, fetcher);
  const loading = !data && !error;
  const [filter, setFilter] = useState("");
  const filterDebounce = useDebounce(filter, 500);
  const handleQueryChange = (e) => {
    setFilter(e.target.value);
  };
  useEffect(() => {
    if (filterDebounce) {
      setUrl(
        `https://api.themoviedb.org/3/search/movie?api_key=95f2419536f533cdaa1dadf83c606027&query=${filterDebounce}&page=${nextPage}`
      );
    } else {
      setUrl(
        `https://api.themoviedb.org/3/movie/popular?api_key=95f2419536f533cdaa1dadf83c606027&page=${nextPage}`
      );
    }
  }, [filterDebounce, nextPage]);
  const movies = data?.results || [];

  useEffect(() => {
    if (!data || !data.total_pages) return;
    setPageCount(Math.ceil(data.total_results / itemsPerPage));
  }, [data, itemOffset]);
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % data.total_results;
    setItemOffset(newOffset);
    setNextPage(event.selected + 1);
  };
  return (
    <div className="py-10 page-container mt-20">
      <div className="flex mb-20 w-full max-w-[600px] mx-auto">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Type here to search..."
            className="w-full p-4 bg-slate-800 text-white outline-none"
            onChange={handleQueryChange}
          />
        </div>
        <button className="p-4 bg-primary text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </button>
      </div>
      {loading && (
        <div className="w-10 h-10 rounded-full border-4 border-primary border-t-4 border-t-transparent mx-auto animate-spin mb-10"></div>
      )}
      <div className="grid grid-cols-4 gap-10">
        {!loading &&
          movies.length > 0 &&
          movies.map((item) => (
            <MovieCart key={item.id} item={item}></MovieCart>
          ))}
      </div>
      {!loading && (
        <div className="mt-10">
          <ReactPaginate
            breakLabel="..."
            nextLabel=">"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel="<"
            renderOnZeroPageCount={null}
            className="demo w-full max-w-[600px] mx-auto flex justify-center items-center gap-x-5"
          />
        </div>
      )}
    </div>
  );
};

export default MoviePage;
