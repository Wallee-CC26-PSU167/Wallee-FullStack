import profileService from "../service/ProfileService.js";

const getProfile = async (req, res) => {
  try {
    const profile = await profileService.getProfile(req.user.id);
    res.status(201).json(profile);
  } catch (err) {
    return response.error(res, err.message, 404);
    res.status(404).json({ error: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const updated = await profileService.updateProfile(req.user.id, req.body);
    res.status(201).json(updated);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export default { getProfile, updateProfile };