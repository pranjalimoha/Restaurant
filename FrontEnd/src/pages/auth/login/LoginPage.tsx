import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const {
    loginForm,
    loading,
    error,
    setLoginField,
    setLoading,
    setError,
    loginSuccess,
    resetLoginForm,
  } = useAuthStore();

  const handleLogin = async () => {
    setError(null);

    // ✅ VALIDATION
    if (!loginForm.email || !loginForm.password) {
      setError("Please fill in all fields");
      return;
    }

    if (!loginForm.email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    if (loginForm.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: loginForm.email,
          userPassword: loginForm.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      const token = data.data.token;
      const user = data.data.user;

      // ✅ Store globally
      loginSuccess(token, user);

      // ✅ Save in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      resetLoginForm();
      //navigate("/");
      navigate("/profile");

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
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
                  <LoginRoundedIcon className={styles.icon} />
                </Box>

                <Box className={styles.header}>
                  <Typography variant="h2" className={styles.title}>
                    Sign In
                  </Typography>
                  <Typography variant="h6" className={styles.subtitle}>
                    Welcome back to Reserve & Dine
                  </Typography>
                </Box>

                <Stack spacing={3} sx={{ width: "stretch" }}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    placeholder="Enter your email"
                    value={loginForm.email}
                    onChange={(e) =>
                      setLoginField("email", e.target.value)
                    }
                  />

                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginField("password", e.target.value)
                    }
                  />
                </Stack>

                <Button
                  variant="contained"
                  size="large"
                  className={styles.signInButton}
                  onClick={handleLogin}
                  disabled={loading}
                >
                  {loading ? "Signing In..." : "Sign In"}
                </Button>

                {/* ✅ ERROR DISPLAY */}
                {error && (
                  <Typography variant="body2" color="error">
                    {error}
                  </Typography>
                )}

                <Box className={styles.footer}>
                  <Typography variant="body1" className={styles.footerText}>
                    Don&apos;t have an account?
                  </Typography>

                  <Button
                    onClick={() => navigate("/register")}
                    className={styles.registerButton}
                  >
                    Create one
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