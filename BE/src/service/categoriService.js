import kategoriRepository from "../repositories/categoriRepository.js";

const getAll = async (query) => {
  return await kategoriRepository.findAll(query);
};

export default {
  getAll,
};