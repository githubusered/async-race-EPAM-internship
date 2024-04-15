import { Car, PatchResponse } from '../../utils/types';

const API_URL = 'http://localhost:3001';

export const fetchCars = async (): Promise<Car[]> => {
  try {
    const res = await fetch(`${API_URL}/garage`);
    const data = await res.json();
    if (data && Array.isArray(data)) {
      return data;
    }
    throw new Error('Invalid data format received');
  } catch (error) {
    throw new Error(`Error fetching cars: ${(error as Error).message}`);
  }
};

export const createCar = async (newCar: Car): Promise<Car> => {
  try {
    const response = await fetch(`${API_URL}/garage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCar),
    });
    if (!response.ok) {
      throw new Error(`Failed to create car: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error creating car: ${(error as Error).message}`);
  }
};

export const updateCar = async (
  carId: number,
  updatedCar: Partial<Car>,
): Promise<Car> => {
  try {
    const response = await fetch(`${API_URL}/garage/${carId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedCar),
    });
    if (!response.ok) {
      throw new Error(`Failed to update car: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error updating car: ${(error as Error).message}`);
  }
};

export const patchCar = async (
  carId: number,
  status: 'started' | 'stopped' | 'drive',
): Promise<PatchResponse> => {
  try {
    const response = await fetch(`${API_URL}/engine/?id=${carId}&status=${status}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to patch car: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error patching car: ${(error as Error).message}`);
  }
};

export const deleteCar = async (carId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/garage/${carId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete car: ${response.statusText}`);
    }
  } catch (error) {
    throw new Error(`Error deleting car: ${(error as Error).message}`);
  }
};
