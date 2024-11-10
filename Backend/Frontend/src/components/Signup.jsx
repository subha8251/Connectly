import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

function Signup() {
  const [authUser, setAuthUser] = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password", "");
  const confirmPassword = watch("confirmPassword", "");

  const validatePasswordMatch = (value) => {
    return value === password || "Passwords do not match";
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("fullname", data.fullname);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);
    formData.append("image", data.image[0]); // File input for the image

    try {
      const response = await axios.post("/api/user/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Set the header for FormData
        },
      });

      if (response.data) {
        toast.success("Signup successful");
        localStorage.setItem("ChatApp", JSON.stringify(response.data));
        setAuthUser(response.data);
      }
    } catch (error) {
      if (error.response) {
        toast.error("Error: " + error.response.data.error);
      }
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border border-black px-6 py-2 rounded-md space-y-3 w-96"
      >
        <h1 className="text-2xl items-center text-blue-600 font-bold">Messenger</h1>

        <h2 className="text-2xl items-center">
          Create a new <span className="text-blue-600 font-semibold">Account</span>
        </h2>

        {/* Fullname */}
        <label className="input input-bordered flex items-center gap-2">
          <input
            type="text"
            className="grow"
            placeholder="Fullname"
            {...register("fullname", { required: true })}
          />
        </label>
        {errors.fullname && (
          <span className="text-red-500 text-sm font-semibold">
            This field is required
          </span>
        )}

        {/* Email */}
        <label className="input input-bordered flex items-center gap-2">
          <input
            type="email"
            className="grow"
            placeholder="Email"
            {...register("email", { required: true })}
          />
        </label>
        {errors.email && (
          <span className="text-red-500 text-sm font-semibold">
            This field is required
          </span>
        )}

        {/* Password */}
        <label className="input input-bordered flex items-center gap-2">
          <input
            type="password"
            className="grow"
            placeholder="password"
            {...register("password", { required: true })}
          />
        </label>
        {errors.password && (
          <span className="text-red-500 text-sm font-semibold">
            This field is required
          </span>
        )}

        {/* Confirm Password */}
        <label className="input input-bordered flex items-center gap-2">
          <input
            type="password"
            className="grow"
            placeholder="confirm password"
            {...register("confirmPassword", {
              required: true,
              validate: validatePasswordMatch,
            })}
          />
        </label>
        {errors.confirmPassword && (
          <span className="text-red-500 text-sm font-semibold">
            {errors.confirmPassword.message}
          </span>
        )}

        {/* Image upload */}
        <label className="input input-bordered flex items-center gap-2">
          <input
            type="file"
            {...register("image")}
          />
        </label>
        

        <div className="flex justify-center">
          <input
            type="submit"
            value="Signup"
            className="text-white bg-blue-600 cursor-pointer w-full rounded-lg py-2"
          />
        </div>
        <p>
          Have an Account?{" "}
          <Link
            to={"/login"}
            className="text-blue-500 underline cursor-pointer ml-1"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
