import axios from 'axios';

export const fetchPokemonDetails = async (url: string) => {
  const response = await axios.get(url);
  return response.data;
};

export const fetchSpeciesDetails = async (url: string) => {
  const response = await axios.get(url);
  return response.data;
};

export const fetchEvolutionChain = async (url: string) => {
  const response = await axios.get(url);
  return response.data;
};

export const fetchLocationEncounters = async (url: string) => {
  const response = await axios.get(url);
  return response.data;
};
