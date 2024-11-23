import { Alert, Button, Snackbar, TextField } from "@mui/material";
import { green } from "@mui/material/colors";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { currentUser, register } from "../../State/Auth/Action";
import { useFormik } from "formik";
import * as Yup from "yup";

const Signup = () => {
  const [openSnackBar, setOpenSnackbar] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(""); // Store the error message
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store); // Get auth state from Redux
  const { error, signup } = auth || {}; // Extract error and signup from auth state
  const token = localStorage.getItem("jwt");

  const validationSchema = Yup.object().shape({
    full_name: Yup.string().required("Full Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      full_name: "",
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await dispatch(register(values));
        setOpenSnackbar(true); // Show success Snackbar
      } catch (err) {
        setErrorMessage(err?.error || "An unexpected error occurred."); // Set error message
        setOpenSnackbar(true); // Show error Snackbar
      }
    },
  });

  const handleCloseSnackBar = () => {
    setOpenSnackbar(false);
    setErrorMessage(""); // Clear the error message
  };

  useEffect(() => {
    if (token) {
      dispatch(currentUser(token));
    }
  }, [token]);

  useEffect(() => {
    if (auth.reqUser?.full_name) {
      navigate("/");
    }
  }, [auth.reqUser]);

  return (
    <div>
      <div className="flex justify-center h-screen items-center">
        <div className="w-[30%] p-10 shadow-md bg-white">
          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <TextField
              fullWidth
              label="Full Name"
              name="full_name"
              type="text"
              value={formik.values.full_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.full_name && Boolean(formik.errors.full_name)
              }
              helperText={formik.touched.full_name && formik.errors.full_name}
              placeholder="Enter your full name"
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              placeholder="Enter your email address"
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              placeholder="Enter your password"
            />

            <div>
              <Button
                type="submit"
                sx={{ bgcolor: green[700], padding: ".5rem 0rem" }}
                className="w-full bg-green-600"
                variant="contained"
              >
                Signup
              </Button>
            </div>
          </form>

          <div className="flex space-x-3 items-center mt-5">
            <p>Already have an account?</p>
            <Button variant="text" onClick={() => navigate("/signin")}>
              Signin
            </Button>
          </div>
        </div>
      </div>

      <Snackbar
        open={openSnackBar && !errorMessage && Boolean(signup?.jwt)}
        autoHideDuration={6000}
        onClose={handleCloseSnackBar}
      >
        <Alert
          onClose={handleCloseSnackBar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Your account was created successfully.
        </Alert>
      </Snackbar>

      <Snackbar
        open={openSnackBar && Boolean(errorMessage)}
        autoHideDuration={6000}
        onClose={handleCloseSnackBar}
      >
        <Alert
          onClose={handleCloseSnackBar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage || "Signup failed. Please try again."}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Signup;
