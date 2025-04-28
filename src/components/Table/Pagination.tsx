import React from 'react';

interface Props {
  total: number;
  currentPage: number;
  setCurrentPage: (page: number | ((prevPage: number) => number)) => void;
  rowsPerPage: number;
}

const Pagination: React.FC<Props> = ({ total, currentPage, setCurrentPage, rowsPerPage }) => {
  const pages = Math.ceil(total / rowsPerPage);

  return (
    <div className="pagination">
      <button disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>First</button>
      <button disabled={currentPage === 1} onClick={() => setCurrentPage((prev: number) => prev - 1)}>Prev</button>

      {[...Array(pages)].map((_, idx) => (
        <button
          key={idx}
          className={currentPage === idx + 1 ? 'active' : ''}
          onClick={() => setCurrentPage(idx + 1)}
        >
          {idx + 1}
        </button>
      ))}

      <button disabled={currentPage === pages} onClick={() => setCurrentPage((prev: number) => prev + 1)}>Next</button>
      <button disabled={currentPage === pages} onClick={() => setCurrentPage(pages)}>Last</button>
    </div>
  );
};

export default Pagination;
