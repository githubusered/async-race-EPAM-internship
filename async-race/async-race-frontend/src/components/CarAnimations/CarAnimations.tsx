import React, { useState, useEffect } from 'react';
import './CarAnimations.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCarSide, faPlay, faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import Btn from '../Buttons/Btn';

import { CarAnimationsProps } from '../../utils/types';

const CarAnimations: React.FC<CarAnimationsProps> = ({
  cars,
  onCarRemove,
  onCarSelect,
  selectedCarId,
  onCarStart,
  animationDurations,
}) => {
  const [runningAnimations, setRunningAnimations] = useState<{ [key: number]: boolean }>({});
  const [pausedAnimations, setPausedAnimations] = useState<{ [key: number]: boolean }>({});
  const [raceStarted, setRaceStarted] = useState(false);

  const handleStart = (carId:number) => {
    onCarStart(carId);
    setRunningAnimations((prevState) => ({
      ...prevState,
      [carId]: true,
    }));
    setPausedAnimations((prevState) => ({
      ...prevState,
      [carId]: false,
    }));
  };
  const start = () => {
    setRunningAnimations({});
    setPausedAnimations({});
    cars.forEach((car) => handleStart(car.id));
  };
  const onAnimationEnd = (carId: number) => {
    const carElement = document.getElementById(`${carId}`);
    if (carElement) {
      carElement.style.animation = 'none';
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      carElement.offsetHeight;
      carElement.style.animation = `moveRight-${carId} ${0}ms`;
    }
  };
  const handleStop = (carId: number) => {
    setPausedAnimations((prevState) => ({
      ...prevState,
      [carId]: !prevState[carId],
    }));
    setRunningAnimations((prevState) => ({
      ...prevState,
      [carId]: false,
    }));
    onAnimationEnd(carId);
  };
  const reset = () => {
    setRunningAnimations({});
    setPausedAnimations({});
    cars.forEach((car) => {
      handleStop(car.id); // Stop the car
    });
  };

  useEffect(() => {
    const startRace = () => {
      start(); // Start the race
    };

    const resetRace = () => {
      reset(); // Reset the race
    };

    if (raceStarted) {
      startRace();
    } else {
      resetRace();
    }
  }, [raceStarted]);

  const handleStartRace = () => {
    setRaceStarted(true);
  };

  const handleResetRace = () => {
    setRaceStarted(false);
  };

  const handleCarSelect = (carId: number) => {
    onCarSelect(carId);
  };

  const handleCarRemove = (carId: number) => {
    onCarRemove(carId);
  };

  const handleAnimationIteration = (carId: number) => {
    setPausedAnimations((prevState) => ({
      ...prevState,
      [carId]: true,
    }));
  };

  return (
    <div>
      <div className="playAndResetBtns">
        <Btn
          title="RACE"
          style={{ color: '#4CAF50', borderColor: '#4CAF50' }}
          onClick={handleStartRace}
          icon={faPlay}
          disabled={raceStarted}
        />
        <Btn
          title="RESET"
          style={{ color: '#6a0080', borderColor: '#6a0080' }}
          onClick={handleResetRace}
          icon={faRotateLeft}
          disabled={!raceStarted}
        />
      </div>
      <div className="race-track">
        <div className="carList">
          {cars.map((car) => (
            <div key={car.id} className="carPath">
              <div className="SRSR">
                <div className="selectAndRemove">
                  <Btn
                    title="SELECT"
                    onClick={() => handleCarSelect(car.id)}
                    style={{
                      color: selectedCarId === car.id ? '#00f' : '#0D47A1',
                      borderColor: '#0D47A1',
                    }}
                  />
                  <Btn
                    title="REMOVE"
                    onClick={() => handleCarRemove(car.id)}
                    style={{ color: '#6a0080', borderColor: '#6a0080' }}
                    disabled={selectedCarId !== car.id}
                  />
                </div>
                <div className="stopAndRun">
                  <Btn
                    title="A"
                    onClick={() => handleStart(car.id)}
                    style={{ color: '#FFEB3B', borderColor: '#FFEB3B' }}
                  />
                  <Btn
                    title="B"
                    onClick={() => handleStop(car.id)}
                    style={{ color: '#FFEB3B', borderColor: '#FFEB3B' }}
                    disabled={!runningAnimations[car.id]}
                  />
                </div>
              </div>
              <div
                className="car"
                id={`${car.id}`}
                onAnimationIteration={() => handleAnimationIteration(car.id)}
                style={{
                  color: car.color,
                  animationDuration: pausedAnimations[car.id] ? '0ms' : `${animationDurations[car.id]}ms`,
                  animationName: `moveRight-${car.id}`,
                  animationPlayState: pausedAnimations[car.id] ? 'paused' : 'running',
                }}
              >
                <FontAwesomeIcon icon={faCarSide} className="carIcon" />
                {car.name}
              </div>
              <style>
                {`@keyframes moveRight-${car.id} {
                  from {
                    transform: translateX(0%);
                  }
                  to {
                    transform: translateX(950%);
                  }
                }`}
              </style>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarAnimations;
