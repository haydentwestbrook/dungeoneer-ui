import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const loginMutation = useMutation(
    async (values: { email: string; password: string }) => {
      const response = await axios.post("/api/login", values);
      return response.data;
    },
    {
      onError: (error: any) => {
        console.error("Login failed:", error);
        alert("Incorrect password. Please try again.");
      },
      onSuccess: (data) => {
        Cookies.set("loginToken", data.token);
        navigate("/dashboard");
      },
    }
  );

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      loginMutation.mutate(values);
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-yellow-500">
          Enter the Forgotten Realm
        </h1>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className={`w-full px-4 py-2 mt-1 text-gray-900 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                formik.touched.email && formik.errors.email
                  ? "border-red-500"
                  : ""
              }`}
            />
            {formik.touched.email && formik.errors.email ? (
              <p className="mt-1 text-sm text-red-500">{formik.errors.email}</p>
            ) : null}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className={`w-full px-4 py-2 mt-1 text-gray-900 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                formik.touched.password && formik.errors.password
                  ? "border-red-500"
                  : ""
              }`}
            />
            {formik.touched.password && formik.errors.password ? (
              <p className="mt-1 text-sm text-red-500">
                {formik.errors.password}
              </p>
            ) : null}
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-gray-900 bg-yellow-500 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            disabled={loginMutation.isLoading}
          >
            {loginMutation.isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
