export const handleError = (
res,
error,
context = "Error"
) => {
console.error(
`${context}:`,
error?.message || error
);

const validationMessages = [
"required",
"empty",
"between",
"invalid",
"must be",
"not found",
];

const isValidationError =
validationMessages.some(
(msg) =>
error?.message
?.toLowerCase()
?.includes(msg)
);

if (isValidationError) {
return res.status(400).json({
success: false,
message: error.message,
});
}

return res.status(500).json({
success: false,
message:
process.env.NODE_ENV ===
"production"
? "Internal Server Error"
: error.message,
});
};
