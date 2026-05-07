import categoriService from '../service/categoriService.js';

const getAll = async (req, res) => {
  try {
    const categories = await categoriService.getAll(req.query);
    res.status(200).json({
      success: true,
      message: "Data Kategori sukses diambil",
      data: categories
    })
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message,
      data: null
    });
  }
};

export default { getAll };