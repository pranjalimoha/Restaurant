import { useNavigate } from "react-router-dom";
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
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import styles from "./RegisterPage.module.css";

export default function RegisterPage() {
  const navigate = useNavigate();

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
                  />

                  <TextField
                    fullWidth
                    label="Email Address"
                    placeholder="Enter your email"
                  />

                  <TextField
                    fullWidth
                    label="Phone Number"
                    placeholder="Enter your phone number"
                  />

                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    placeholder="Create a password"
                  />

                  <TextField
                    fullWidth
                    label="Confirm Password"
                    type="password"
                    placeholder="Confirm your password"
                  />
                </Stack>

                <Button
                  variant="contained"
                  size="large"
                  className={styles.registerButton}
                >
                  Create Account
                </Button>

                <Box className={styles.footer}>
                  <Typography variant="body1" className={styles.footerText}>
                    Already have an account?
                  </Typography>

                  <Button
                    onClick={() => navigate("/login")}
                    className={styles.signInButton}
                  >
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