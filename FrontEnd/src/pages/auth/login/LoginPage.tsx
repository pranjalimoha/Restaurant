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
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
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
                  <LoginRoundedIcon className={styles.icon} />
                </Box>
                <Box className={styles.header}>
                  <Typography variant="h2" className={styles.title}>
                    Sign In
                  </Typography>
                  <Typography variant="h6" className={styles.subtitle}>
                    {`Welcome back to Reserve & Dine`}
                  </Typography>
                </Box>
                <Stack spacing={3} sx={{width: "stretch"}}>
                  <TextField
                    fullWidth
                    label="User ID or Email"
                    placeholder="Enter your user ID"
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                  />
                </Stack>
                <Button
                  variant="contained"
                  size="large"
                  className={styles.signInButton}
                >
                  Sign In
                </Button>
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