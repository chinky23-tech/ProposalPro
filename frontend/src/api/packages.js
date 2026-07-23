import { request } from './auth.js';

export const packagesApi = {
  // GET all service packages
  getAllPackages: (token) => 
    request('/packages', { token }),

  // GET package by ID
  getPackageById: (id, token) => 
    request(`/packages/${id}`, { token }),

  // POST create new package
  createPackage: (data, token) => 
    request('/packages', { method: 'POST', body: data, token }),

  // PUT update package
  updatePackage: (id, data, token) => 
    request(`/packages/${id}`, { method: 'PUT', body: data, token }),

  // DELETE package tier
  deletePackage: (id, token) => 
    request(`/packages/${id}`, { method: 'DELETE', token }),
};

export default packagesApi;