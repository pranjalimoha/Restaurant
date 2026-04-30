import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Card, CardContent, Container, Stack, Typography } from "@mui/material";
import { getReservationById } from "../reservationApi";
import dayjs from "dayjs";
import { ReservationDetails } from "../../../types";

export default function ReservationConfirmationPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [reservation, setReservation] = useState<ReservationDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        async function loadReservation() {
            if (!id) {
                setErrorMessage("Missing reservation ID.");
                setIsLoading(false);
                return;
            }

            try {
                const response = await getReservationById(id);
                setReservation(response.data);
            } catch (error) {
                const message = error instanceof Error ? error.message : "Unable to load reservation.";

                setErrorMessage(message);
            } finally {
                setIsLoading(false);
            }
        }

        loadReservation();
    }, [id]);

    if (isLoading) {
        return (
            <Container sx={{ py: 6 }}>
                <Typography>Loading reservation confirmation...</Typography>
            </Container>
        );
    }

    if (errorMessage || !reservation) {
        return (
            <Container sx={{ py: 6 }}>
                <Stack spacing={2}>
                    <Typography color="error">{errorMessage || "Reservation not found."}</Typography>
                    <Button variant="contained" onClick={() => navigate("/reservation")}>
                        Back to Reservations
                    </Button>
                </Stack>
            </Container>
        );
    }

    const tableNumbers = reservation.reservation_tables
        .map((item) => item.restaurant_tables.table_number)
        .join(" + ");

    const formattedDate = dayjs(reservation.reservation_date).format("MMMM D, YYYY");

    const formattedTime = dayjs(reservation.reservation_time).format("h:mm A");
    const isRegisteredUser = Boolean(reservation.user_id);

    return (
        <Box sx={{ minHeight: "100vh", background: "#f6f6f6", py: 6 }}>
            <Container maxWidth="md">
                <Stack spacing={4}>
                    <Box>
                        <Typography variant="h3" sx={{ fontWeight: 800 }}>
                            Thank you {reservation.guest_name}, your reservation is confirmed.
                        </Typography>

                        <Typography sx={{ color: "#475569", mt: 1 }}>
                            Confirmation ID: {reservation.id}
                        </Typography>
                    </Box>

                    <Card sx={{ borderRadius: 4 }}>
                        <CardContent>
                            <Stack spacing={2}>
                                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                    Reservation Details
                                </Typography>

                                <Typography>Name: {reservation.guest_name}</Typography>
                                <Typography>Email: {reservation.guest_email}</Typography>
                                <Typography>Phone: {reservation.guest_phone}</Typography>
                                <Typography>Date: {formattedDate}</Typography>
                                <Typography>Time: {formattedTime}</Typography>
                                <Typography>Guests: {reservation.number_of_guests}</Typography>
                                <Typography>Table(s): {tableNumbers}</Typography>
                                <Typography>Status: {reservation.status?.replace("_", " ")}</Typography>

                                {reservation.requires_holding_fee ? (
                                    <Typography>
                                        Holding Fee Required: ${Number(reservation.holding_fee_amount).toFixed(2)}
                                    </Typography>
                                ) : (
                                    <Typography>No holding fee required.</Typography>
                                )}
                                <Typography sx={{ color: "#475569" }}>
                                    A confirmation email will be sent shortly.
                                </Typography>
                            </Stack>
                        </CardContent>
                    </Card>
                    <Stack spacing={2} sx={{ alignItems: "center" }}>
                        <Button
                            variant="contained"
                            onClick={() => navigate("/reservation")}
                            sx={{ width: 300 }}
                        >
                            Make Another Reservation
                        </Button>

                        {isRegisteredUser ? (
                            <Button
                                variant="outlined"
                                onClick={() => navigate("/profile")}
                                sx={{ width: 300 }}
                            >
                                View Profile
                            </Button>
                        ) : (
                            <Typography sx={{ color: "#475569", textAlign: "center" }}>
                                Please save your Confirmation ID or email to look up your reservation later.
                            </Typography>
                        )}
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
}
