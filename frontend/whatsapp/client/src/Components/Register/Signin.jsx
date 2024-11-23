import { Alert, Button, Snackbar, TextField } from "@mui/material";
import { green } from "@mui/material/colors";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { currentUser, login } from "../../State/Auth/Action";
import { useFormik } from "formik";
import * as Yup from "yup";

const Signin = () => {
  const [openSnackBar, setOpenSnackbar] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store); // Get auth state from Redux
  const { error, signin } = auth || {}; // Extract error and signin from auth state
  const token = localStorage.getItem("jwt");

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required "),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(login(values));
      setOpenSnackbar(true);
      console.log("login form value", values);
    },
  });

  const handleCloseSnackBar = () => {
    setOpenSnackbar(false);
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
      <div className="flex justify-center h-screen  items-center">
        <div className="w-[30%]  p-10 shadow-md bg-white">
          <form onSubmit={formik.handleSubmit} className="space-y-5">
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
                className="w-full  bg-green-600"
                variant="contained"
              >
                Signin
              </Button>
            </div>
          </form>

          <div className="flex space-x-3 items-center  mt-5">
            <p className="m-0">Create New Account</p>
            <Button variant="text" onClick={() => navigate("/signup")}>
              Signup
            </Button>
          </div>
        </div>
      </div>

      <Snackbar
  open={openSnackBar && error}
  autoHideDuration={6000}
  onClose={(event, reason) => {
    if (reason !== "clickaway") {
      handleCloseSnackBar();
    }
  }}
>
  <Alert
    onClose={handleCloseSnackBar}
    severity="error"
    sx={{ width: "100%" }}
  >
    {error || "Invalid email or password."}
  </Alert>
</Snackbar>



     
    </div>
  );
};

export default Signin;
