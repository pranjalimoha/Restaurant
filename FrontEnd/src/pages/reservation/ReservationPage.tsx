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
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  guestNumberOptions,
  type ReservationOption,
  type ReservationSearchFormValues,
} from "../../types";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useReservationStore } from "../../store/reservationFlowStore";
import { reservationSearchSchema } from "../../schema/reservationSchema";
import { searchAvailableTables } from "../reservation/reservationApi";

export default function ReservationPage() {
  const navigate = useNavigate();
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const today = new Date().toLocaleDateString("en-CA");

  const setSearchCriteria = useReservationStore((state) => state.setSearchCriteria);
  const setAvailableTables = useReservationStore((state) => state.setAvailableTables);
  const selectTable = useReservationStore((state) => state.selectTable);
  const availableTables = useReservationStore((state) => state.availableTables);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ReservationSearchFormValues>({
    resolver: zodResolver(reservationSearchSchema),
    defaultValues: {
      date: "",
      time: "",
      numberOfGuests: 2,
    },
  });

  type BackendTable = {
    id: string;
    table_number?: string | number;
    tableNumber?: string | number;
    capacity: number;
  };

  type BackendCombination = {
    tables: BackendTable[];
    totalCapacity: number;
    needsCombination: boolean;
  };

  type BackendAvailabilityData = {
    availableTables: BackendTable[];
    suggestedCombinations: BackendCombination[];
  };

  function mapBackendResultsToOptions(
    data: BackendAvailabilityData,
    numberOfGuests: number,
  ): ReservationOption[] {
    const directTableOptions = data.availableTables.map((table) => ({
      id: `table-option-${table.id}`,
      tableIds: [table.id],
      tableNumbers: [String(table.table_number ?? table.tableNumber ?? "")],
      totalCapacity: table.capacity,
      tablesNeedCombining: false,
      wastedSeats: table.capacity - numberOfGuests,
    }));

    const combinationOptions = data.suggestedCombinations.map((combo, index) => ({
      id: `combo-option-${index}`,
      tableIds: combo.tables.map((table) => table.id),
      tableNumbers: combo.tables.map((table) =>
        String(table.table_number ?? table.tableNumber ?? ""),
      ),
      totalCapacity: combo.totalCapacity,
      tablesNeedCombining: combo.needsCombination,
      wastedSeats: combo.totalCapacity - numberOfGuests,
    }));

    return [...directTableOptions, ...combinationOptions];
  }

  const onSubmit = async (values: ReservationSearchFormValues) => {
    setErrorMessage("");

    const selectedDate = new Date(`${values.date}T00:00:00`);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    if (selectedDate < todayDate) {
      setErrorMessage("Please select today or a future date.");
      setAvailableTables([]);
      setHasSearched(false);
      return;
    }

    const [hour, minute] = values.time.split(":").map(Number);
    const selectedMinutes = hour * 60 + minute;

    const openingMinutes = 10 * 60;
    const closingMinutes = 22 * 60;

    if (selectedMinutes < openingMinutes || selectedMinutes > closingMinutes) {
      setErrorMessage("Reservations are only allowed between 10:00 AM and 10:00 PM.");
      setAvailableTables([]);
      setHasSearched(false);
      return;
    }

    setHasSearched(true);
    setIsSearching(true);
    setSearchCriteria(values);

    try {
      const response = await searchAvailableTables(values);
      const options = mapBackendResultsToOptions(response.data, values.numberOfGuests);
      setAvailableTables(options);
    } catch (error) {
      console.error(error);
      setAvailableTables([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectTable = (option: ReservationOption) => {
    selectTable(option);
    navigate("/reservation/details");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f7f2e7 0%, #f4f4f5 100%)",
      }}
    >
      <Container>
        <Stack spacing={4}>
          <Box>
            <Typography variant="h2" sx={{ fontWeight: 700, color: "#0f172a" }}>
              Reserve a Table
            </Typography>

            <Typography variant="h6" sx={{ color: "#475569" }}>
              Choose your date, time, and party size to find available tables.
            </Typography>
          </Box>

          <Card sx={{ borderRadius: 5, boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)" }}>
            <CardContent>
              <Stack component="form" spacing={2} onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2}>
                  <Controller
                    name="date"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="date"
                        slotProps={{
                          htmlInput: {
                            min: today,
                          },
                        }}
                        error={Boolean(errors.date)}
                        helperText={errors.date?.message}
                      />
                    )}
                  />

                  <Controller
                    name="time"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="time"
                        error={Boolean(errors.time)}
                        helperText={errors.time?.message}
                      />
                    )}
                  />

                  <Controller
                    name="numberOfGuests"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        select
                        label="Number of Guests"
                        value={field.value}
                        onChange={(event) => field.onChange(Number(event.target.value))}
                        error={Boolean(errors.numberOfGuests)}
                        helperText={errors.numberOfGuests?.message}
                      >
                        {guestNumberOptions.map((num) => (
                          <MenuItem key={num} value={num}>
                            {num} Guests
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Stack>

                {errorMessage && (
                  <Typography color="error" sx={{ fontWeight: 600 }}>
                    {errorMessage}
                  </Typography>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isSubmitting || isSearching}
                  sx={{
                    minHeight: 55,
                    borderRadius: 5,
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "1rem",
                    backgroundColor: "#ea580c",
                    "&:hover": { backgroundColor: "#c2410c" },
                  }}
                >
                  {isSearching ? "Searching..." : "Search Available Tables"}
                </Button>
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 5, boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)" }}>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: "#0f172a" }}>
                  Available Options
                </Typography>

                {!hasSearched ? (
                  <Typography variant="body1" sx={{ color: "#64748b" }}>
                    Search for available tables to see reservation options.
                  </Typography>
                ) : isSearching ? (
                  <Typography variant="body1" sx={{ color: "#64748b" }}>
                    Checking table availability...
                  </Typography>
                ) : availableTables.length === 0 ? (
                  <Typography variant="body1" sx={{ color: "#64748b" }}>
                    No available tables were found for that time.
                  </Typography>
                ) : (
                  <Stack spacing={2}>
                    {availableTables.map((option) => (
                      <Card key={option.id} variant="outlined" sx={{ borderRadius: 5 }}>
                        <CardContent>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            Table Option: {option.tableNumbers.join(" + ")}
                          </Typography>

                          <Typography variant="body2" sx={{ color: "#475569", mt: 1 }}>
                            Capacity: {option.totalCapacity}
                          </Typography>

                          <Typography variant="body2" sx={{ color: "#475569" }}>
                            {option.tablesNeedCombining
                              ? "Tables need to be combined"
                              : "Single table available"}
                          </Typography>

                          <Typography variant="body2" sx={{ color: "#475569" }}>
                            Wasted Seats: {option.wastedSeats}
                          </Typography>

                          <Button
                            variant="contained"
                            sx={{ mt: 2, textTransform: "none", borderRadius: 5, fontWeight: 700 }}
                            onClick={() => handleSelectTable(option)}
                          >
                            Select This Option
                          </Button>
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
