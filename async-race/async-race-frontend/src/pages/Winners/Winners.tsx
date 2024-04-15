import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faArrowRight,
  faCarSide,
} from '@fortawesome/free-solid-svg-icons';
import Btn from '../../components/Buttons/Btn';
import './Winners.css';

const Winners: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [winners, setWinners] = useState<any[]>([]);
  const [totalWinners, setTotalWinners] = useState(0);
  const [sortByWinsAsc, setSortByWinsAsc] = useState(true);
  const [sortByTimeAsc, setSortByTimeAsc] = useState(true);

  useEffect(() => {
    const storedPage = localStorage.getItem('winnersPage');
    if (storedPage) {
      setCurrentPage(Number(storedPage));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('winnersPage', currentPage.toString());
  }, [currentPage]);

  useEffect(() => {
    const fetchWinners = async () => {
      try {
        const response = await fetch('http://localhost:3001/winners');
        if (!response.ok) {
          throw new Error('Failed to fetch winners');
        }
        const data = await response.json();
        setWinners(data);
        setTotalWinners(data.length);
      } catch (error) {
        console.error('Error fetching winners:', error);
      }
    };

    fetchWinners();
  }, []);

  const sortWinnersByWins = () => {
    const sortedWinners = [...winners].sort((a, b) => {
      if (sortByWinsAsc) {
        return a.wins - b.wins;
      }
      return b.wins - a.wins;
    });
    setWinners(sortedWinners);
    setSortByWinsAsc(!sortByWinsAsc);
  };

  const sortWinnersByTime = () => {
    const sortedWinners = [...winners].sort((a, b) => {
      if (sortByTimeAsc) {
        return a.time - b.time;
      }
      return b.time - a.time;
    });
    setWinners(sortedWinners);
    setSortByTimeAsc(!sortByTimeAsc);
  };

  const indexOfLastWinner = currentPage * itemsPerPage;
  const indexOfFirstWinner = indexOfLastWinner - itemsPerPage;
  const currentWinners = winners.slice(indexOfFirstWinner, indexOfLastWinner);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  return (
    <div className="winnersContainer">
      <h2>
        WINNERS
        (
        {totalWinners}
        )
      </h2>
      <table className="winnerPropertiesTitles">
        <thead>
          <tr className="titles">
            <th>No</th>
            <th>CAR</th>
            <th>NAME</th>
            <th
              onClick={sortWinnersByWins}
              style={{ cursor: 'pointer', color: 'green' }}
            >
              WINS
            </th>
            <th
              onClick={sortWinnersByTime}
              style={{ cursor: 'pointer', color: 'yellow' }}
            >
              BEST TIME(SECONDS)
            </th>
          </tr>
        </thead>
        <tbody>
          {currentWinners.map((winner) => (
            <tr className="properties" key={winner.id}>
              <td>{indexOfFirstWinner + winner.id + 1}</td>
              <td>
                <FontAwesomeIcon
                  icon={faCarSide}
                  className="carIcon"
                  style={{ color: 'purple' }}
                />
              </td>
              <td>{winner.car}</td>
              <td>{winner.wins}</td>
              <td>{winner.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination Controls */}
      <div className="pagination" style={{ marginTop: '10px' }}>
        <Btn title="prev" onClick={handlePrevPage} disabled={currentPage === 1}>
          <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: '20px' }} />
        </Btn>
        <span style={{ fontSize: '20px', color: 'white' }}>
          PAGE#
          {currentPage}
        </span>
        <Btn
          title="next"
          onClick={handleNextPage}
          disabled={indexOfLastWinner >= winners.length}
        >
          <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '20px' }} />
        </Btn>
      </div>
    </div>
  );
};

export default Winners;
