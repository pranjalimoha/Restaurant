import { useNavigate } from "react-router-dom";
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
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Box className={styles.page}>
      <AppBar position="static" elevation={0} className={styles.appBar}>
        <Toolbar className={styles.toolbar}>
          <Box className={styles.brandWrap}>
            <Typography noWrap variant="h4" className={styles.brandTitle}>
              Restaurant Placeholder
            </Typography>
          </Box>
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

          <Card className={styles.reserveCard}>
            <CardContent className={styles.reserveCardContent}>
              <Stack spacing={3}>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={2}
                  className={styles.reserveHeader}
                >
                  <Box className={styles.reserveHeadingWrap}>
                    <Typography variant="h2" className={styles.reserveTitle}>
                      Reserve a Table
                    </Typography>

                    <Typography variant="h6" className={styles.reserveSubtitle}>
                      Start your reservation in just a few steps.
                    </Typography>
                  </Box>

                  <Box className={styles.reserveIconBox}>
                    <RestaurantOutlinedIcon className={styles.reserveIcon} />
                  </Box>
                </Stack>

                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate("/reservation")}
                  className={styles.reserveButton}
                >
                  Search Available Tables
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}
