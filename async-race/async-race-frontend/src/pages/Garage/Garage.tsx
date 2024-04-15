import React, { useState, useEffect } from 'react';
import './Garage.css';
import Btn from '../../components/Buttons/Btn';
import CarAnimations from '../../components/CarAnimations/CarAnimations';
import Input from '../../components/Input/Input';

import { Car } from '../../utils/types';
import {
  createCar,
  deleteCar,
  fetchCars,
  patchCar,
  updateCar,
} from '../../components/ApiClient/ApiClient';
import WinnerPopup from '../../components/WinnerPopup/WinnerPopup';

const Garage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [cars, setCars] = useState<Car[]>([]);
  const carsPerPage = 7;
  const [totalCars, setTotalCars] = useState(0);

  const [selectedCarId, setSelectedCarId] = useState<number | null>(null);
  const [newCarData, setNewCarData] = useState<Partial<Car>>({});
  const [newCarDataToCreate, setNewCarDataToCreate] = useState<Partial<Car>>(
    {},
  );
  const [animationDurations, setAnimationDurations] = useState<{ [key: number]: number }>({});

  const [winner, setWinner] = useState<{ id: number; name: string; time: number } | null>(null);
  const [winsCount, setWinsCount] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    const storedPage = localStorage.getItem('garagePage');
    if (storedPage) {
      setCurrentPage(Number(storedPage));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('garagePage', currentPage.toString());
  }, [currentPage]);

  const fetchData = async () => {
    try {
      const data = await fetchCars();
      setCars(data);
      setTotalCars(data.length);
    } catch (error) {
      console.error((error as Error).message);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleRaceCompletion = (car: Car) => {
    const winnerData = {
      id: car.id,
      name: car.name,
      time: animationDurations[car.id],
    };
    setWinner(winnerData);
    updateWinsCount(car.id); // Update wins count when a car wins
  };

  const updateWinsCount = (carId: number) => {
    setWinsCount(prevState => ({
      ...prevState,
      [carId]: (prevState[carId] || 0) + 1, // Increment wins count for the car
    }));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => {
      const nextPage = prevPage + 1;
      const lastCarIndex = nextPage * carsPerPage;
      if (lastCarIndex <= totalCars) {
        return nextPage;
      }
      return prevPage + 1;
    });
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(1, prevPage - 1));
  };

  const generateCars = async () => {
    // Real car names and models
    const carNames = [
      'Toyota',
      'Honda',
      'Ford',
      'Chevrolet',
      'Nissan',
      'BMW',
      'Mercedes-Benz',
      'Audi',
      'Volkswagen',
      'Tesla',
    ];
    const carModels = [
      'Corolla',
      'Civic',
      'F-150',
      'Silverado',
      'Altima',
      '3 Series',
      'C-Class',
      'A4',
      'Golf',
      'Model S',
    ];

    const colors = ['#e6e6fa', '#fede00', '#6c779f', '#ef3c40', '#00b8d4']; // Add more colors if needed

    const newCars = Array.from({ length: 100 }, () => ({
      name: `${carNames[Math.floor(Math.random() * carNames.length)]} ${
        carModels[Math.floor(Math.random() * carModels.length)]
      }`,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    try {
      await Promise.all(
        newCars.map(async (car) => {
          const response = await fetch('http://localhost:3001/garage', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(car),
          });
          if (!response.ok) {
            throw new Error(`Failed to post car: ${response.statusText}`);
          }
          // Parse the response JSON to get the ID of the newly created car
          await response.json();
        }),
      );
      // Refresh the list of cars after successfully generating them
      fetchData(); // Assuming you have a function named fetchData to fetch cars from the server
    } catch (error) {
      console.error('Error generating cars:', error);
    }
  };

  const handleCarUpdate = async (
    carId: number | null,
    updatedCarData: Partial<Car>,
  ) => {
    if (carId !== null) {
      try {
        await updateCar(carId, updatedCarData);
        // If the car was successfully updated, fetch the updated list of cars
        fetchData();
      } catch (error) {
        console.error('Error updating car:', error);
      }
    }
  };
  const handleCarCreate = async (newDataToCreate: Partial<Car>) => {
    if (newDataToCreate) {
      try {
        await createCar(newDataToCreate as Car);
        setTotalCars((prevTotalCars) => prevTotalCars + 1);
        // If the car was successfully updated, fetch the updated list of cars
        fetchData();

        // setTotalCars()
      } catch (error) {
        console.error('Error updating car:', error);
      }
    }
  };

  const handleCarRemove = async (carId: number) => {
    if (carId !== null) {
      try {
        await deleteCar(carId);
        // If the car was successfully deleted, update the local state
        const updatedCars = cars.filter((car) => car.id !== carId);
        setCars(updatedCars);
        setTotalCars((prevTotalCars) => prevTotalCars - 1);
      } catch (error) {
        console.error('Error deleting car:', error);
      }
    }
  };
  const handleCarStart = async (carId:number) => {
    try {
    // Call patchCar function to start the car
      const response = await patchCar(carId, 'started');
      // Retrieve velocity and distance from the response data
      const { velocity, distance } = response;
      // Calculate animation duration based on velocity and distance
      const time = Math.round(distance / velocity);
      // Update animation duration state
      setAnimationDurations((prevState) => ({
        ...prevState,
        [carId]: time,
      }));
      console.log(time, 'time', velocity, 'velocity', distance, 'distance');
      console.log(animationDurations);
      console.log(carId);
    } catch (error) {
      console.error('Error starting car:', error);
    }
  };

  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = cars.slice(indexOfFirstCar, indexOfLastCar);

  return (
    <div className="garageContainer">
      <div className="interactBtnsAndInputs">
        <div className="createAndUpdate">
          <div className="createForm">
            <div className="createFormInputs">
              <Input
                placeholder="TYPE CAR BRAND"
                id="inputForCreateCarBrandName"
              />
              <Input
                type="color"
                onChange={(e) => setNewCarDataToCreate((prevData) => ({
                  ...prevData,
                  color: e.target.value,
                }))}
              />
            </div>
            <Btn
              title="CREATE"
              style={{ color: '#6a0080', borderColor: '#6a0080' }}
              onClick={() => {
                const inputElement = document.getElementById(
                  'inputForCreateCarBrandName',
                ) as HTMLInputElement;
                if (inputElement) {
                  if (inputElement.value) {
                    const updatedNewCarData = {
                      ...newCarDataToCreate,
                      name: inputElement.value,
                    };
                    handleCarCreate(updatedNewCarData);
                    inputElement.value = '';
                  }
                } else {
                  console.error(
                    'Element with ID inputForUpdateCarBrandName not found.',
                  );
                }
              }}
            />
          </div>
          <div className="updateForm">
            <div className="updateFormInputs">
              <Input
                placeholder="TYPE CAR BRAND"
                id="inputForUpdateCarBrandName"
              />
              <Input
                type="color"
                onChange={(e) => setNewCarData((prevData) => ({
                  ...prevData,
                  color: e.target.value,
                }))}
              />
            </div>
            <Btn
              title="UPDATE"
              style={{ color: '#6a0080', borderColor: '#6a0080' }}
              onClick={() => {
                const inputElement = document.getElementById(
                  'inputForUpdateCarBrandName',
                ) as HTMLInputElement;
                if (inputElement) {
                  if (inputElement.value) {
                    const updatedCarData = {
                      ...newCarData,
                      name: inputElement.value,
                    };
                    handleCarUpdate(selectedCarId, updatedCarData);
                    inputElement.value = '';
                    setSelectedCarId(null);
                  }
                } else {
                  console.error(
                    'Element with ID inputForUpdateCarBrandName not found.',
                  );
                }
              }}
            />
          </div>
        </div>
        <div className="generateOneHundredRandomCars">
          <Btn
            title="GENERATE CARS"
            style={{ color: '#4CAF50', borderColor: '#4CAF50' }}
            onClick={generateCars}
          />
        </div>
      </div>
      <CarAnimations
        cars={currentCars}
        onCarRemove={handleCarRemove}
        onCarSelect={setSelectedCarId}
        selectedCarId={selectedCarId}
        onCarStart={handleCarStart}
        animationDurations={animationDurations}
      />
      {winner && <WinnerPopup winner={winner} onClose={() => setWinner(null)} />}
      <footer>
        <span className="totalNumberOfCars">
          Garage(
          {totalCars}
          )
        </span>
        <div className="pagination">
          <Btn
            title="Prev"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          />
          <Btn
            title="Next"
            onClick={handleNextPage}
            disabled={indexOfLastCar >= totalCars}
          />
        </div>
        <span className="currentPageNumber">
          Page#
          {currentPage}
        </span>
      </footer>
    </div>
  );
};

export default Garage;
