import { Box, Button, Card, CardContent, Container, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { ReservationDetails } from "../../../types";
import { authorizeHoldingFee, getReservationById } from "../reservationApi";

export default function ReservationPaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [reservation, setReservation] = useState<ReservationDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [paymentError, setPaymentError] = useState("");

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
        const message =
          error instanceof Error ? error.message : "Unable to load reservation payment details.";

        setErrorMessage(message);
      } finally {
        setIsLoading(false);
      }
    }

    loadReservation();
  }, [id]);

  const handleAuthorizeHoldingFee = async () => {
    if (!reservation) return;

    setPaymentError("");
    setIsAuthorizing(true);

    try {
      await authorizeHoldingFee(reservation.id);
      navigate(`/reservation/confirmation/${reservation.id}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to authorize holding fee.";

      setPaymentError(message);
    } finally {
      setIsAuthorizing(false);
    }
  };

  if (isLoading) {
    return (
      <Container sx={{ py: 6 }}>
        <Typography>Loading payment details...</Typography>
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

  const holdingFeeAmount = Number(reservation.holding_fee_amount).toFixed(2);

  return (
    <Box sx={{ minHeight: "100vh", background: "#f6f6f6", py: 6 }}>
      <Container maxWidth="sm">
        <Card sx={{ borderRadius: 4 }}>
          <CardContent>
            <Stack spacing={3}>
              <Typography variant="h3" sx={{ fontWeight: 800 }}>
                Holding Fee Required
              </Typography>

              <Typography>
                This reservation falls on a designated high-traffic date configured in our
                reservation system and requires a holding fee.
              </Typography>

              <Typography sx={{ fontWeight: 700 }}>
                No-shows may be charged a minimum ${holdingFeeAmount} holding fee.
              </Typography>

              <Typography sx={{ color: "#64748b" }}>
                For this MVP demo, payment processing is represented by tracking the holding-fee
                requirement in the database. Full card authorization will be added in a future
                iteration.
              </Typography>

              <Button
                variant="contained"
                size="large"
                disabled={isAuthorizing}
                onClick={handleAuthorizeHoldingFee}
              >
                {isAuthorizing ? "Authorizing..." : "Authorize Holding Fee"}
              </Button>

              {paymentError ? <Typography color="error">{paymentError}</Typography> : null}

              <Button variant="outlined" onClick={() => navigate("/reservation")}>
                Back to Reservation Search
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
