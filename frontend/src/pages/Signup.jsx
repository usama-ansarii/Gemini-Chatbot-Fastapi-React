import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "../components/Logo";
import { useFormik } from "formik";
import { signupSchema } from "../schemas";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { registerUserAsyncThunk } from "../store/slices/authSlice";
import { toast } from "react-toastify"; 

const initialValues = {
  fullname: "",
  email: "",
  password: "",
};

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { values, errors, touched, handleChange, handleSubmit, handleBlur } =
    useFormik({
      initialValues,
      validationSchema: signupSchema,
      onSubmit: async (values, action) => {
        const result = await dispatch(registerUserAsyncThunk(values));

        if (registerUserAsyncThunk.fulfilled.match(result)) {
          toast.success("Signup successful! Please login now."); 
          action.resetForm();
          navigate("/"); 
        } else {
          toast.error(result.payload || "Signup failed, please try again!"); 
        }
      },
    });

  return (
    <div className="signup-wrapper">
      <Container>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col md={8} lg={7} xl={5}>
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="signup-card p-4 shadow-lg rounded-4"
            >
              <div className="text-center mb-3">
                <Logo />
                <h2 className="gradient-text mt-3">Create Account</h2>
                <p className="text-muted small">
                  Start chatting with your AI assistant 🤖
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label className="label">Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    name="fullname"
                    value={values.fullname}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="input-field"
                  />
                  {errors.fullname && touched.fullname && (
                    <div className="error">{errors.fullname}</div>
                  )}
                </div>

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

                <Button className="w-100 mt-2 btn-primary" type="submit">
                  Sign Up
                </Button>

                <p className="text-center mt-3 small">
                  Already have an account?{" "}
                  <Link to="/" className="link">
                    Login
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

export default Signup;
