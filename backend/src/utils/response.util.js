export const successResponse = (
res,
data = null,
message = "Success",
statusCode = 200
) => {
return res.status(statusCode).json({
success: true,
message,
data,
});
};

export const createdResponse = (
res,
data = null,
message = "Created successfully"
) => {
return res.status(201).json({
success: true,
message,
data,
});
};

export const notFoundResponse = (
res,
message = "Resource not found"
) => {
return res.status(404).json({
success: false,
message,
});
};

export const unauthorizedResponse = (
res,
message = "Unauthorized"
) => {
return res.status(401).json({
success: false,
message,
});
};

export const forbiddenResponse = (
res,
message = "Forbidden"
) => {
return res.status(403).json({
success: false,
message,
});
};
