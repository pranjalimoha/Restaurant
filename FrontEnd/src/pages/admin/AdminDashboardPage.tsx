import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import {
  completeReservationForAdmin,
  getAllReservationsForAdmin,
  markReservationNoShowForAdmin,
  type PaymentMethod,
} from "./adminApi";

type AdminReservation = {
  id: string;
  guest_name: string | null;
  guest_email: string | null;
  guest_phone: string | null;
  reservation_date: string;
  reservation_time: string;
  number_of_guests: number;
  status: string;
  tables_need_combining: boolean;
  requires_holding_fee: boolean;
  holding_fee_paid: boolean;
  reservation_tables: {
    restaurant_tables: {
      table_number: string;
      capacity: number;
    };
  }[];
};

export default function AdminDashboardPage() {
  const [reservations, setReservations] = useState<AdminReservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingReservationId, setUpdatingReservationId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [filter, setFilter] = useState<"all" | "combined">("all");

  const [activeCompleteId, setActiveCompleteId] = useState<string | null>(null);
  const [amountSpent, setAmountSpent] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");

  async function loadReservations() {
    try {
      setErrorMessage("");

      const response = await getAllReservationsForAdmin();
      setReservations(response.data);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load admin reservations.";

      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadReservations();
  }, []);

  function openCompleteForm(reservationId: string) {
    setActiveCompleteId(reservationId);
    setAmountSpent("");
    setPaymentMethod("CASH");
    setErrorMessage("");
    setSuccessMessage("");
  }

  function closeCompleteForm() {
    setActiveCompleteId(null);
    setAmountSpent("");
    setPaymentMethod("CASH");
  }

  async function handleCompleteReservation(reservationId: string) {
    const numericAmountSpent = Number(amountSpent);

    if (amountSpent.trim() === "" || Number.isNaN(numericAmountSpent) || numericAmountSpent < 0) {
      setErrorMessage("Please enter a valid amount spent.");
      return;
    }

    try {
      setUpdatingReservationId(reservationId);
      setErrorMessage("");
      setSuccessMessage("");

      await completeReservationForAdmin(reservationId, numericAmountSpent, paymentMethod);

      setSuccessMessage("Reservation marked as completed.");
      closeCompleteForm();
      await loadReservations();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to complete reservation.";

      setErrorMessage(message);
    } finally {
      setUpdatingReservationId("");
    }
  }

  async function handleMarkNoShow(reservationId: string) {
    try {
      setUpdatingReservationId(reservationId);
      setErrorMessage("");
      setSuccessMessage("");

      await markReservationNoShowForAdmin(reservationId);

      setSuccessMessage("Reservation marked as no-show.");
      await loadReservations();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to mark reservation as no-show.";

      setErrorMessage(message);
    } finally {
      setUpdatingReservationId("");
    }
  }

  const combinationReservations = reservations.filter(
    (reservation) => reservation.tables_need_combining,
  );

  const visibleReservations = filter === "combined" ? combinationReservations : reservations;

  if (isLoading) {
    return (
      <Container sx={{ py: 6 }}>
        <Typography>Loading admin dashboard...</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", background: "#f6f6f6", py: 6 }}>
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 800 }}>
              Admin Dashboard
            </Typography>

            <Typography sx={{ color: "#475569", mt: 1 }}>
              View reservations and table setup requirements.
            </Typography>
          </Box>

          {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

          {successMessage ? <Alert severity="success">{successMessage}</Alert> : null}

          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Owner Setup Alerts
                </Typography>

                <Stack direction="row" spacing={2} sx={{ mt: 2, justifyContent: "center" }}>
                  <Button
                    variant={filter === "all" ? "contained" : "outlined"}
                    onClick={() => setFilter("all")}
                  >
                    View All Reservations
                  </Button>

                  <Button
                    variant={filter === "combined" ? "contained" : "outlined"}
                    color="warning"
                    onClick={() => setFilter("combined")}
                  >
                    View Combine Table Alerts
                  </Button>
                </Stack>

                <Typography sx={{ color: "#475569" }}>
                  {combinationReservations.length} reservation(s) require tables to be combined.
                </Typography>
              </Stack>
            </CardContent>
          </Card>

          <Stack spacing={2}>
            {visibleReservations.length === 0 ? (
              <Card sx={{ borderRadius: 4 }}>
                <CardContent>
                  <Typography sx={{ color: "#64748b" }}>
                    No reservations match this filter.
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              visibleReservations.map((reservation) => {
                const tableNumbers = reservation.reservation_tables
                  .map((item) => item.restaurant_tables.table_number)
                  .join(" + ");

                const formattedDate = new Date(reservation.reservation_date).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    timeZone: "UTC",
                  },
                );

                const formatTimeSlot = (time: string) => {
                  const start = dayjs(time);
                  const end = start.add(1, "hour");

                  return `${start.format("h:mm A")} - ${end.format("h:mm A")}`;
                };

                const formattedTime = formatTimeSlot(reservation.reservation_time);

                const isConfirmedReservation = reservation.status === "CONFIRMED";

                const isUpdatingThisReservation = updatingReservationId === reservation.id;

                return (
                  <Card key={reservation.id} sx={{ borderRadius: 4 }}>
                    <CardContent>
                      <Stack spacing={2}>
                        <Stack
                          sx={{
                            justifyContent: "space-between",
                            flexDirection: { xs: "column", sm: "row" },
                          }}
                          spacing={2}
                        >
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                              {reservation.guest_name || "Guest Reservation"}
                            </Typography>

                            <Typography sx={{ color: "#64748b" }}>
                              {formattedDate} at {formattedTime}
                            </Typography>
                          </Box>

                          <Stack
                            sx={{
                              flexDirection: "row",
                              alignItems: "flex-end",
                              gap: "10px",
                              flexWrap: "wrap",
                            }}
                            spacing={1}
                          >
                            <Chip label={reservation.status} />

                            {reservation.tables_need_combining ? (
                              <Chip label="Owner Action: Combine Tables" color="warning" />
                            ) : (
                              <Chip label="Single Table" color="success" />
                            )}

                            {reservation.requires_holding_fee ? (
                              <Chip
                                label={
                                  reservation.holding_fee_paid
                                    ? "Holding Fee Paid"
                                    : "Holding Fee Pending"
                                }
                                color={reservation.holding_fee_paid ? "success" : "warning"}
                              />
                            ) : null}
                          </Stack>
                        </Stack>

                        <Typography>Guests: {reservation.number_of_guests}</Typography>

                        <Typography>Table(s): {tableNumbers || "Not assigned"}</Typography>

                        <Typography>Email: {reservation.guest_email || "N/A"}</Typography>

                        <Typography>Phone: {reservation.guest_phone || "N/A"}</Typography>

                        {reservation.tables_need_combining ? (
                          <Alert severity="warning">
                            Owner notification: combine tables {tableNumbers} for this reservation
                            before the guest arrives.
                          </Alert>
                        ) : null}

                        {isConfirmedReservation ? (
                          <Stack direction="row" spacing={2}>
                            <Button
                              variant="contained"
                              color="success"
                              disabled={isUpdatingThisReservation}
                              onClick={() => openCompleteForm(reservation.id)}
                            >
                              Mark Completed
                            </Button>

                            <Button
                              variant="outlined"
                              color="error"
                              disabled={isUpdatingThisReservation}
                              onClick={() => handleMarkNoShow(reservation.id)}
                            >
                              Mark No Show
                            </Button>
                          </Stack>
                        ) : (
                          <Typography sx={{ color: "#64748b" }}>
                            Actions available only for CONFIRMED reservations.
                          </Typography>
                        )}

                        {activeCompleteId === reservation.id ? (
                          <Box
                            sx={{
                              mt: 2,
                              p: 2,
                              border: "1px solid #e2e8f0",
                              borderRadius: 3,
                              background: "#ffffff",
                            }}
                          >
                            <Stack spacing={2}>
                              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                Complete Reservation
                              </Typography>

                              <TextField
                                label="Amount Spent"
                                type="number"
                                value={amountSpent}
                                onChange={(event) => setAmountSpent(event.target.value)}
                                fullWidth
                              />

                              <FormControl>
                                <FormLabel>Payment Method</FormLabel>

                                <RadioGroup
                                  row
                                  value={paymentMethod}
                                  onChange={(event) =>
                                    setPaymentMethod(event.target.value as PaymentMethod)
                                  }
                                >
                                  <FormControlLabel value="CASH" control={<Radio />} label="Cash" />

                                  <FormControlLabel
                                    value="CREDIT"
                                    control={<Radio />}
                                    label="Credit"
                                  />

                                  <FormControlLabel
                                    value="CHECK"
                                    control={<Radio />}
                                    label="Check"
                                  />
                                </RadioGroup>
                              </FormControl>

                              <Stack direction="row" spacing={2}>
                                <Button
                                  variant="contained"
                                  color="success"
                                  disabled={isUpdatingThisReservation}
                                  onClick={() => handleCompleteReservation(reservation.id)}
                                >
                                  Submit Completion
                                </Button>

                                <Button
                                  variant="outlined"
                                  disabled={isUpdatingThisReservation}
                                  onClick={closeCompleteForm}
                                >
                                  Cancel
                                </Button>
                              </Stack>
                            </Stack>
                          </Box>
                        ) : null}
                      </Stack>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
