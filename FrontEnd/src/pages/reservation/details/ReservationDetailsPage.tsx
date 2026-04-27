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
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useReservationStore } from "../../../store/reservationFlowStore";
import { GuestDetails } from "../../../types";
import { guestDetailsSchema } from "../../../schema/reservationSchema";
import { createReservation } from "../reservationApi";
import { useState } from "react";

export default function ReservationDetailsPage() {
  const navigate = useNavigate();

  const selectedTable = useReservationStore((s) => s.selectedTable);
  const setGuestDetails = useReservationStore((s) => s.setGuestDetails);
  const searchCriteria = useReservationStore((state) => state.searchCriteria);
  const [submitError, setSubmitError] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GuestDetails>({
    resolver: zodResolver(guestDetailsSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (values: GuestDetails) => {
    if (!searchCriteria || !selectedTable) {
      navigate("/reservation");
      return;
    }

    setSubmitError("");
    setGuestDetails(values);

    try {
      const response = await createReservation({
        searchCriteria,
        selectedTable,
        guestInfo: values,
      });

      const reservation = response.data;

      if (reservation.requiresHoldingFee) {
        navigate(`/reservation/payment/${reservation.reservation.id}`);
      } else {
        navigate(`/reservation/confirmation/${reservation.reservation.id}`);
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while creating the reservation.";

      setSubmitError(message);
    }
  };

  if (!selectedTable) {
    return (
      <Container>
        <Typography>No table selected. Go back.</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", background: "#f6f6f6", py: 6 }}>
      <Container maxWidth="md">
        <Stack spacing={4}>
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            Enter Your Details
          </Typography>

          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Stack component="form" spacing={3} onSubmit={handleSubmit(onSubmit)}>
                <Stack direction="row" spacing={2}>
                  <Controller
                    name="firstName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="First Name"
                        error={!!errors.firstName}
                        helperText={errors.firstName?.message}
                      />
                    )}
                  />

                  <Controller
                    name="lastName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Last Name"
                        error={!!errors.lastName}
                        helperText={errors.lastName?.message}
                      />
                    )}
                  />
                </Stack>

                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Email"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />

                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Phone Number"
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                    />
                  )}
                />
                <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
                  {isSubmitting ? "Creating Reservation..." : "Continue"}
                </Button>
                {submitError ? <Typography color="error">{submitError}</Typography> : null}
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}
