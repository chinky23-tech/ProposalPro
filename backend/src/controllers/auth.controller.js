import { registerUserService, loginUserService, getMeService } from "../services/auth.service.js";
import { validateRegisterInput, validateLoginInput } from "../validations/auth.validation.js";
import { successResponse, createdResponse } from "../utils/response.util.js";
import { handleError } from "../utils/error.util.js";

export const register = async (req, res) => {
  try {
    const validatedData = validateRegisterInput(req.body);
    const data = await registerUserService(validatedData);
  
    return createdResponse(res, data, "User registered successfully");
  } catch (error) {
    return handleError(res, error);
  }
};

export const login = async (req, res) => {
  try {
    const validatedData = validateLoginInput(req.body);
    const data = await loginUserService(validatedData);
    
  
    return successResponse(res, data, "Login successful");
  } catch (error) {
    return handleError(res, error);
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await getMeService(req.user.id);
    

    return successResponse(res, user, "User profile fetched successfully");
  } catch (error) {
    return handleError(res, error);
  }
};