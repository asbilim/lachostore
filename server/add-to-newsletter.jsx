"use server";
const backendUrl = process.env.BACKEND_URL;

export const subscribeToNewsletter = async (data) => {
  const url = "/content/newsletter/";
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/content/newsletter/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error:", errorData);
      return {
        success: false,
        message: "Failed to subscribe to the newsletter",
        error: errorData,
      };
    }

    const result = await response.json();
    console.log("Success:", result);
    return { success: true, message: "Subscribed successfully!", data: result };
  } catch (error) {
    console.error("Error:", error);
    return {
      success: false,
      message: "An error occurred while subscribing. Please try again.",
      error: error,
    };
  }
};
