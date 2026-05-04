import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { getAllReservationsForAdmin } from "./adminApi";

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
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadReservations() {
      try {
        const response = await getAllReservationsForAdmin();
        setReservations(response.data);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unable to load admin reservations.";

        setErrorMessage(message);
      } finally {
        setIsLoading(false);
      }
    }

    loadReservations();
  }, []);

  const combinationReservations = reservations.filter(
    (reservation) => reservation.tables_need_combining,
  );

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

          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Owner Setup Alerts
                </Typography>

                <Typography sx={{ color: "#475569" }}>
                  {combinationReservations.length} reservation(s) require tables
                  to be combined.
                </Typography>
              </Stack>
            </CardContent>
          </Card>

          <Stack spacing={2}>
            {reservations.map((reservation) => {
              const tableNumbers = reservation.reservation_tables
                .map((item) => item.restaurant_tables.table_number)
                .join(" + ");

              const formattedDate = dayjs(reservation.reservation_date).format(
                "MMMM D, YYYY",
              );

              const formattedTime = dayjs(reservation.reservation_time).format(
                "h:mm A",
              );

              return (
                <Card key={reservation.id} sx={{ borderRadius: 4 }}>
                  <CardContent>
                    <Stack spacing={2}>
                      <Stack
                        sx={{justifyContent: "space-between", flexDirection: {xs: "column", sm: "row"}}}
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

                        <Stack sx={{flexDirection: "row", alignItems: "flex-end", gap: "10px", flexWrap: "wrap"}} spacing={1}>
                          <Chip label={reservation.status} />

                          {reservation.tables_need_combining ? (
                            <Chip
                              label="Owner Action: Combine Tables"
                              color="warning"
                            />
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
                              color={
                                reservation.holding_fee_paid
                                  ? "success"
                                  : "warning"
                              }
                            />
                          ) : null}
                        </Stack>
                      </Stack>

                      <Typography>Guests: {reservation.number_of_guests}</Typography>
                      <Typography>Table(s): {tableNumbers}</Typography>
                      <Typography>Email: {reservation.guest_email}</Typography>
                      <Typography>Phone: {reservation.guest_phone}</Typography>

                      {reservation.tables_need_combining ? (
                        <Alert severity="warning">
                          Owner notification: combine tables {tableNumbers} for
                          this reservation before the guest arrives.
                        </Alert>
                      ) : null}
                    </Stack>
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}