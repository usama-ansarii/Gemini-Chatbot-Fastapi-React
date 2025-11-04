import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "../components/Logo";
import { useFormik } from "formik";
import { loginSchema } from "../schemas";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { loginUserAsyncThunk } from "../store/slices/authSlice";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialValues = {
  email: "",
  password: "",
};

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { values, errors, touched, handleChange, handleSubmit, handleBlur } =
    useFormik({
      initialValues,
      validationSchema: loginSchema,
      onSubmit: async (values, action) => {
        const resultAction = await dispatch(loginUserAsyncThunk(values));

        if (loginUserAsyncThunk.fulfilled.match(resultAction)) {
          toast.success("Login successful!");
          action.resetForm();
          setTimeout(() => navigate("/chat"), 1000); 
        } else {
          toast.error(resultAction.payload || "Login failed, please try again!");
        }
      },
    });

  return (
    <div className="auth-wrapper">
      <ToastContainer /> 
      <Container>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col md={8} lg={6} xl={5}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="card-glass auth-form"
            >
              <div className="text-center mb-4">
                <Logo />
                <h2 className="gradient-text mt-3">Welcome Back</h2>
                <p>Login to continue your chat experience 💬</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label className="label">Email</label>
                  <input
                    type="email"
                    placeholder="example@mail.com"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="input-field"
                  />
                  {errors.email && touched.email && (
                    <div className="error">{errors.email}</div>
                  )}
                </div>

                <div className="form-group mb-3 position-relative">
                  <label className="label">Password</label>
                  <div className="password-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="input-field"
                    />
                    <span
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                    </span>
                  </div>
                  {errors.password && touched.password && (
                    <div className="error">{errors.password}</div>
                  )}
                </div>

                <div className="d-flex justify-content-end align-items-center mb-3">
                  <Link to="/forgot" className="link">
                    Forgot password?
                  </Link>
                </div>

                <Button type="submit" className="w-100 btn-primary">
                  Login
                </Button>

                <p className="text-center mt-3 small">
                  Don’t have an account?{" "}
                  <Link to="/signup" className="link">
                    Sign up
                  </Link>
                </p>
              </form>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
