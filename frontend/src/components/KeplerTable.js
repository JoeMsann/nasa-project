import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fetchKeplerPaginated } from '../services/api';

const Container = styled.div`
  padding: 6rem 2rem 2rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2rem;
`;

const TableContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: rgba(102, 126, 234, 0.2);
`;

const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #ffffff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TableBody = styled.tbody``;

const TableRow = styled(motion.tr)`
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background: rgba(102, 126, 234, 0.1);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.875rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: rgba(255, 255, 255, 0.7);
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #ff6b6b;
  text-align: center;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.02);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;

const PaginationButton = styled.button`
  background: rgba(102, 126, 234, 0.2);
  border: 1px solid rgba(102, 126, 234, 0.3);
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;

  &:hover:not(:disabled) {
    background: rgba(102, 126, 234, 0.3);
    border-color: rgba(102, 126, 234, 0.5);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageInfo = styled.span`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
`;

const PageSizeSelector = styled.select`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  padding: 0.5rem;
  border-radius: 8px;
  margin-left: 1rem;

  option {
    background: #1a1a2e;
    color: #ffffff;
  }
`;

const PageInput = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  padding: 0.5rem;
  border-radius: 8px;
  width: 80px;
  text-align: center;
  margin: 0 0.5rem;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: rgba(102, 126, 234, 0.5);
    background: rgba(255, 255, 255, 0.15);
  }
`;

const PageInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 1rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
`;

function KeplerTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [pageInput, setPageInput] = useState('');
  const navigate = useNavigate();

  const fetchData = async (page, size) => {
    try {
      setLoading(true);
      const result = await fetchKeplerPaginated(page, size);

      console.log('=== KEPLER TABLE DATA DEBUG ===');
      console.log('Raw result:', result);

      // The API function returns result.data, which is an array: [{ success: true, pagination: {...}, data: [...] }]
      if (result && Array.isArray(result) && result.length > 0) {
        const apiResponse = result[0];

        if (apiResponse.success && apiResponse.data && Array.isArray(apiResponse.data)) {
          console.log('Found Kepler data:', apiResponse.data.length, 'records');
          console.log('Pagination info:', apiResponse.pagination);

          setData(apiResponse.data);
          setTotalPages(apiResponse.pagination.total_pages || 1);
        } else {
          console.log('API response indicates failure or no data');
          setData([]);
          setTotalPages(1);
        }
      } else {
        console.log('Unexpected data structure from API');
        setData([]);
        setTotalPages(1);
      }
      console.log('================================');
    } catch (err) {
      console.error('Error in fetchData:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const handleRowClick = (item) => {
    if (item.Kepler_ID || item.kepler_id || item.kepid || item.id) {
      const keplerId = item.Kepler_ID || item.kepler_id || item.kepid || item.id;
      navigate(`/kepler/${keplerId}`);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handlePageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value));
    setCurrentPage(1);
  };

  const handlePageInputChange = (event) => {
    setPageInput(event.target.value);
  };

  const handlePageInputSubmit = (event) => {
    if (event.key === 'Enter') {
      const pageNumber = parseInt(pageInput);
      if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
        setPageInput('');
      } else {
        setPageInput('');
      }
    }
  };

  const handleGoToPage = () => {
    const pageNumber = parseInt(pageInput);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setPageInput('');
    } else {
      setPageInput('');
    }
  };

  const selectedColumns = [
    'Kepler_ID',
    'Orbital_Period_(days)',
    'Planet_Radius_(Earth_radii)',
    'Equilibrium_Temperature_(K)',
    'Stellar_Effective_Temperature_(K)',
    'Stellar_Radius_(Solar_radii)',
    'Insolation_Flux_(Earth_flux)',
    'Transit_Orbital_Period_(days)'
  ];

  const formatColumnName = (columnName) => {
    return columnName
      .replace(/_/g, ' ')
      .replace(/\(([^)]+)\)/g, '($1)')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatValue = (value, columnName) => {
    if (value === null || value === undefined || value === -1) return 'N/A';

    if (typeof value === 'number') {
      // Kepler ID should be shown as integer
      if (columnName === 'Kepler_ID') {
        return Math.round(value).toString();
      }
      // Temperature, Radius, and Period with 2 decimal places
      if (columnName.includes('Temperature') || columnName.includes('Radius') || columnName.includes('Period')) {
        return value.toFixed(2);
      }
      // Other numeric values with 4 decimal places
      return value.toFixed(4);
    }

    return String(value);
  };

  const renderTableHeaders = () => {
    return selectedColumns.map(column => (
      <TableHeaderCell key={column}>
        {formatColumnName(column)}
      </TableHeaderCell>
    ));
  };

  const renderTableRows = () => {
    return data.map((item, index) => (
      <TableRow
        key={item.Row_ID || index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        onClick={() => handleRowClick(item)}
      >
        {selectedColumns.map(column => (
          <TableCell key={column}>
            {formatValue(item[column], column)}
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  return (
    <Container>
      <Header>
        <Title>Kepler Exoplanet Data</Title>
        <Subtitle>
          Explore the Kepler space telescope's exoplanet discoveries and predictions
        </Subtitle>
      </Header>

      <TableContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {loading && (
          <LoadingContainer>
            Loading Kepler data...
          </LoadingContainer>
        )}

        {error && (
          <ErrorContainer>
            <div>
              <h3>Error loading data</h3>
              <p>{error}</p>
              <button
                onClick={() => fetchData(currentPage, pageSize)}
                style={{
                  background: 'rgba(102, 126, 234, 0.2)',
                  border: '1px solid rgba(102, 126, 234, 0.3)',
                  color: '#ffffff',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  marginTop: '1rem'
                }}
              >
                Retry
              </button>
            </div>
          </ErrorContainer>
        )}

        {!loading && !error && data.length > 0 && (
          <>
            <Table>
              <TableHeader>
                <tr>
                  {renderTableHeaders()}
                </tr>
              </TableHeader>
              <TableBody>
                {renderTableRows()}
              </TableBody>
            </Table>

            <PaginationContainer>
              <div>
                <PaginationButton
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </PaginationButton>
                <PaginationButton
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  style={{ marginLeft: '0.5rem' }}
                >
                  Next
                </PaginationButton>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <PageInfo>
                  Page {currentPage} of {totalPages}
                </PageInfo>

                <PageInputContainer>
                  <span>Go to:</span>
                  <PageInput
                    type="number"
                    min="1"
                    max={totalPages}
                    value={pageInput}
                    onChange={handlePageInputChange}
                    onKeyPress={handlePageInputSubmit}
                    placeholder="Page"
                  />
                  <PaginationButton
                    onClick={handleGoToPage}
                    style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
                  >
                    Go
                  </PaginationButton>
                </PageInputContainer>
              </div>

              <div>
                <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}>
                  Show:
                </span>
                <PageSizeSelector value={pageSize} onChange={handlePageSizeChange}>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </PageSizeSelector>
              </div>
            </PaginationContainer>
          </>
        )}

        {!loading && !error && data.length === 0 && (
          <LoadingContainer>
            No Kepler data found
          </LoadingContainer>
        )}
      </TableContainer>
    </Container>
  );
}

export default KeplerTable;