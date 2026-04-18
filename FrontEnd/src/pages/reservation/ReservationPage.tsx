import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export default function ReservationPage() {
  const hasSearched = false;
  const guestNumberOptions = [2, 4, 6, 8, 10, 12];

  const reservationOptions: Array<{
    id: string;
    label: string;
    capacity: number;
    tablesNeedCombining: boolean;
  }> = [];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f7f2e7 0%, #f4f4f5 100%)",
        py: { xs: 4, md: 8 },
      }}
    >
      <Container maxWidth="lg" sx={{ height: "100vh" }}>
        <Stack spacing={4}>
          <Box>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "2.2rem", md: "3.5rem" },
                color: "#0f172a",
              }}
            >
              Reserve a Table
            </Typography>

            <Typography
              variant="h6"
              sx={{
                marginTop: "1.5rem",
                color: "#475569",
              }}
            >
              Choose your date, time, and party size to find available tables.
            </Typography>
          </Box>

          <Card
            sx={{
              borderRadius: 5,
              boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Stack spacing={3}>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <TextField fullWidth type="date" />

                  <TextField fullWidth type="time" />
                  <TextField fullWidth select label="Number of Guests" defaultValue={2}>
                    {guestNumberOptions.map((num) => (
                      <MenuItem key={num} value={num}>
                        {num} Guests
                      </MenuItem>
                    ))}
                  </TextField>
                </Stack>

                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    minHeight: 55,
                    borderRadius: 5,
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "1rem",
                    backgroundColor: "#ea580c",
                    "&:hover": {
                      backgroundColor: "#c2410c",
                    },
                  }}
                  onClick={() => {
                    // TODO:
                    // 1. validate form
                    // 2. call backend search endpoint
                    // 3. store results in Zustand
                    // 4. render results below or navigate to next step
                  }}
                >
                  Search Available Tables
                </Button>
              </Stack>
            </CardContent>
          </Card>
          <Card
            sx={{
              borderRadius: 5,

              boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Stack spacing={2}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,

                    color: "#0f172a",
                  }}
                >
                  Available Options
                </Typography>

                {!hasSearched ? (
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#64748b",
                    }}
                  >
                    Search for available tables to see reservation options.
                  </Typography>
                ) : reservationOptions.length === 0 ? (
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#64748b",
                    }}
                  >
                    No available tables were found for that time.
                  </Typography>
                ) : (
                  <Stack spacing={2}>
                    {reservationOptions.map((option) => (
                      <Card
                        key={option.id}
                        variant="outlined"
                        sx={{
                          borderRadius: 4,
                        }}
                      >
                        <CardContent>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            {option.label}
                          </Typography>

                          <Typography variant="body2" sx={{ color: "#475569", mt: 1 }}>
                            Capacity: {option.capacity}
                          </Typography>

                          <Typography variant="body2" sx={{ color: "#475569" }}>
                            {option.tablesNeedCombining
                              ? "Tables need to be combined"
                              : "Single table available"}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}
