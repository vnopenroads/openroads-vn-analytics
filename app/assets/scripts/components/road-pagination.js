import React from 'react';
import {
  range
} from 'lodash';
import {
  compose,
  withProps,
  withHandlers
} from 'recompose';
import T from './t';


const PageNumber = withHandlers({
  buttonClick: ({ setPage, page }) => () => setPage(page)
})(({ page, currentPage, buttonClick }) => (
  <li>
    {page === currentPage ?
      <strong>{page}</strong> :
      <button
        className="button button-base-light"
        onClick={buttonClick}
      >
        {page}
      </button>
    }
  </li>
));


const RoadPagination = ({
  start, end, page: currentPage, roadPageCount, setPage, nextPage, previousPage
}) => (
  <div className="a-paginator">
    <ul>
      {
        range(start, end + 1).map((page) => (
          <PageNumber
            key={page}
            page={page}
            currentPage={currentPage}
            setPage={setPage}
          />
        ))
      }
    </ul>
    <button
      className="button button-base-light"
      onClick={previousPage}
      disabled={currentPage === 1}
    >
      <T>Previous</T>
    </button>
    <button
      className="button button-base-light"
      onClick={nextPage}
      disabled={currentPage === roadPageCount}
    >
      <T>Next</T>
    </button>
  </div>
);


export default compose(
  withProps(({ page, roadPageCount }) => {
    const start = Math.max(page - 10, 1);
    const end = Math.min(start + 10, roadPageCount);
    return { start, end };
  }),
  withHandlers({
    nextPage: ({ page, setPage }) => () => setPage(Math.max(page + 1, 1)),
    previousPage: ({ page, roadPageCount, setPage }) => () => setPage(Math.min(page - 1, roadPageCount))
  })
)(RoadPagination);
