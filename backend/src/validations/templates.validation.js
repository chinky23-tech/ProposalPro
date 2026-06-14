export const validateTemplateInput = (data) => {
  const { title, content } = data;

  if (!title || title.trim() === "") {
    throw new Error("Template title is required");
  }

  if (!content || content.trim() === "") {
    throw new Error("Template content cannot be empty");
  }

  return {
    title: title.trim(),
    content: content.trim()
  };
};