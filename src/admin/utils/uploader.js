const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const uploadPreset =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export async function uploadToCloudinary(file) {
  if (!cloudName || !uploadPreset) {
    throw new Error("Missing Cloudinary environment variables");
  }

  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Upload failed");
  }

  return data.secure_url;
}