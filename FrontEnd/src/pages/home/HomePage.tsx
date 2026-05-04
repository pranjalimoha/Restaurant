import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Box className={styles.page}>
      <AppBar position="static" elevation={0} className={styles.appBar}>
        <Toolbar className={styles.toolbar}>
          <Box className={styles.brandWrap}>
            <Typography noWrap variant="h4" className={styles.brandTitle}>
              Reserve & Dine
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="small"
            onClick={() => navigate("/admin")}
            sx={{
              minWidth: "auto",
              px: 2,
              borderRadius: 3,
              textTransform: "none",
              fontWeight: 700,
              backgroundColor: "#7c3aed", // purple admin color
              "&:hover": {
                backgroundColor: "#6d28d9",
              },
            }}
          >
            Admin
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate("/login")}
            className={styles.loginButton}
          >
            Login / Register
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" className={styles.container}>
        <Stack spacing={6}>
          <Box className={styles.hero}>
            <Typography variant="h1" className={styles.heroTitle}>
              {`Welcome to Reserve & Dine`}
            </Typography>

            <Typography variant="h5" className={styles.heroSubtitle}>
              {`Your table is waiting`}
            </Typography>
          </Box>

          <Stack direction={{ xs: "column", md: "row" }} spacing={4} className={styles.choiceStack}>
            <Card className={styles.choiceCard}>
              <CardActionArea onClick={() => navigate("/reservation")}>
                <CardContent className={styles.choiceCardContent}>
                  <Stack spacing={3} className={styles.choiceCardInner}>
                    <Box className={`${styles.iconCircle} ${styles.guestCircle}`}>
                      <Groups2OutlinedIcon className={`${styles.icon} ${styles.guestIcon}`} />
                    </Box>
                    <Typography variant="h4" className={styles.choiceTitle}>
                      Continue as Guest
                    </Typography>

                    <Typography variant="h6" className={styles.choiceDescription}>
                      Make a quick reservation without signing in
                    </Typography>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>

            <Card className={styles.choiceCard}>
              <CardActionArea onClick={() => navigate("/login")}>
                <CardContent className={styles.choiceCardContent}>
                  <Stack spacing={3} className={styles.choiceCardInner}>
                    <Box className={`${styles.iconCircle} ${styles.registeredCircle}`}>
                      <HowToRegOutlinedIcon className={`${styles.icon} ${styles.registeredIcon}`} />
                    </Box>

                    <Typography variant="h4" className={styles.choiceTitle}>
                      Registered User
                    </Typography>

                    <Typography variant="h6" className={styles.choiceDescription}>
                      Sign in to access your account and earn points
                    </Typography>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          </Stack>

          <Box className={styles.infoSection}>
            <Box className={styles.overlay}>
              <Typography className={styles.infoText}>
                Reservations are highly recommended. Please let us know if there is anything we can
                do to enhance your dining experience. If your preferred date or time is unavailable,
                please call us and we will do our best to accommodate your desired date and time.
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
