import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import styles from "./RegisterPage.module.css";

export default function RegisterPage() {
  const navigate = useNavigate();

  const {
    registerForm,
    setRegisterField,
    loading,
    error,
    setLoading,
    setError,
    resetRegisterForm,
  } = useAuthStore();

  useEffect(() => {
    resetRegisterForm();
  }, []);

  const handleRegister = async () => {
    try {
      setError(null);

      if (registerForm.password !== registerForm.confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      setLoading(true);

      await axios.post("http://localhost:5001/api/auth/register", {
        userName: registerForm.name,
        userEmail: registerForm.email,
        userPhone: registerForm.phone,
        userPassword: registerForm.password,
        userMailingAddress: registerForm.mailingAddress,
        userBillingAddress: registerForm.billingSameAsMailing
          ? registerForm.mailingAddress
          : registerForm.billingAddress,
        isBillingAddressSame: registerForm.billingSameAsMailing,
        preferredPayment: registerForm.preferredPayment,
      });

      const loginRes = await axios.post("http://localhost:5001/api/auth/login", {
        userEmail: registerForm.email,
        userPassword: registerForm.password,
      });

      // store token
      localStorage.setItem("token", loginRes.data.data.token);

      // go to profile
      resetRegisterForm();
      navigate("/profile");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className={styles.page}>
      <Container maxWidth="sm" className={styles.container}>
        <Stack spacing={3}>
          <Button
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => navigate("/")}
            className={styles.backButton}
          >
            Home
          </Button>

          <Card className={styles.card}>
            <CardContent className={styles.cardContent}>
              <Stack spacing={4} className={styles.content}>
                <Box className={styles.iconCircle}>
                  <PersonAddAltRoundedIcon className={styles.icon} />
                </Box>

                <Box className={styles.header}>
                  <Typography variant="h2" className={styles.title}>
                    Create Account
                  </Typography>

                  <Typography variant="h6" className={styles.subtitle}>
                    Join Reserve &amp; Dine and manage your reservations with ease
                  </Typography>
                </Box>

                <Stack spacing={3} className={styles.formStack}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    placeholder="Enter your full name"
                    value={registerForm.name}
                    onChange={(e) => setRegisterField("name", e.target.value)}
                  />

                  <TextField
                    fullWidth
                    label="Email Address"
                    placeholder="Enter your email"
                    value={registerForm.email}
                    onChange={(e) => setRegisterField("email", e.target.value)}
                  />

                  <TextField
                    fullWidth
                    label="Phone Number"
                    placeholder="Enter your phone number"
                    value={registerForm.phone}
                    onChange={(e) => setRegisterField("phone", e.target.value)}
                  />

                  <TextField
                    fullWidth
                    label="Mailing Address"
                    placeholder="Enter your mailing address"
                    value={registerForm.mailingAddress}
                    onChange={(e) => setRegisterField("mailingAddress", e.target.value)}
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={registerForm.billingSameAsMailing}
                        onChange={(e) => setRegisterField("billingSameAsMailing", e.target.checked)}
                      />
                    }
                    label="Billing address same as mailing address"
                  />

                  {!registerForm.billingSameAsMailing && (
                    <TextField
                      fullWidth
                      label="Billing Address"
                      placeholder="Enter your billing address"
                      value={registerForm.billingAddress}
                      onChange={(e) => setRegisterField("billingAddress", e.target.value)}
                    />
                  )}

                  <TextField
                    fullWidth
                    select
                    label="Preferred Payment"
                    value={registerForm.preferredPayment}
                    onChange={(e) => setRegisterField("preferredPayment", e.target.value)}
                  >
                    <MenuItem value="CASH">Cash</MenuItem>
                    <MenuItem value="CREDIT">Credit</MenuItem>
                    <MenuItem value="CHECK">Check</MenuItem>
                  </TextField>

                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    placeholder="Create a password"
                    value={registerForm.password}
                    autoComplete="new-password"
                    onChange={(e) => setRegisterField("password", e.target.value)}
                  />

                  <TextField
                    fullWidth
                    label="Confirm Password"
                    type="password"
                    placeholder="Confirm your password"
                    value={registerForm.confirmPassword}
                    autoComplete="new-password"
                    onChange={(e) => setRegisterField("confirmPassword", e.target.value)}
                  />
                </Stack>

                {error && (
                  <Typography color="error" variant="body2">
                    {error}
                  </Typography>
                )}

                <Button
                  variant="contained"
                  size="large"
                  className={styles.registerButton}
                  onClick={handleRegister}
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>

                <Box className={styles.footer}>
                  <Typography variant="body1" className={styles.footerText}>
                    Already have an account?
                  </Typography>

                  <Button onClick={() => navigate("/login")} className={styles.signInButton}>
                    Sign in
                  </Button>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}
