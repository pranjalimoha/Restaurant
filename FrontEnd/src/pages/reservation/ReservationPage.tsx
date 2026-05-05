import { zodResolver } from "@hookform/resolvers/zod";
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
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { reservationSearchSchema } from "../../schema/reservationSchema";
import { useReservationStore } from "../../store/reservationFlowStore";
import {
  guestNumberOptions,
  type ReservationOption,
  type ReservationSearchFormValues,
} from "../../types";
import { searchAvailableTables } from "./reservationApi";

const generateTimeSlots = () => {
  const slots = [];
  let start = 10 * 60; // 10:00 AM
  const end = 22 * 60; // 10:00 PM

  while (start < end) {
    const endSlot = start + 60;

    const format = (mins: number) => {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      const ampm = h >= 12 ? "PM" : "AM";
      const hour12 = h % 12 === 0 ? 12 : h % 12;

      return `${hour12}:${m.toString().padStart(2, "0")} ${ampm}`;
    };

    slots.push({
      label: `${format(start)} - ${format(endSlot)}`,
      value: `${Math.floor(start / 60)
        .toString()
        .padStart(2, "0")}:${(start % 60).toString().padStart(2, "0")}`,
    });

    start += 60;
  }

  return slots;
};

const timeSlots = generateTimeSlots();

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

  function mapBackendResultsToOptions(data: any, numberOfGuests: number): ReservationOption[] {
    const directTableOptions: ReservationOption[] = data.availableTables.map((table: any) => ({
      id: `table-option-${table.id}`,
      tableIds: [table.id],
      tableNumbers: [table.table_number],
      totalCapacity: table.capacity,
      tablesNeedCombining: false,
      wastedSeats: table.capacity - numberOfGuests,
    }));

    const combinationOptions: ReservationOption[] = data.suggestedCombinations
      .filter((combo: any) => combo.tables.length > 1)
      .map((combo: any, index: number) => ({
        id: `combo-option-${index}`,
        tableIds: combo.tables.map((table: any) => table.id),
        tableNumbers: combo.tables.map((table: any) => table.table_number),
        totalCapacity: combo.totalCapacity,
        tablesNeedCombining: combo.tables.length > 1,
        wastedSeats: combo.totalCapacity - numberOfGuests,
      }));

    return combinationOptions.length > 0 ? combinationOptions : directTableOptions;
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
                      select
                      label="Select Time Slot"
                      value={field.value}
                      onChange={(event) => field.onChange(event.target.value)}
                      error={Boolean(errors.time)}
                      helperText={errors.time?.message}
                    >
                      {timeSlots.map((slot) => (
                        <MenuItem key={slot.value} value={slot.value}>
                          {slot.label}
                        </MenuItem>
                      ))}
                    </TextField>
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
                            sx={{
                              mt: 2,
                              textTransform: "none",
                              borderRadius: 5,
                              fontWeight: 700,
                            }}
                            onClick={() => {
                              console.log("CLICKED OPTION:", option);
                              selectTable(option);
                              navigate("/reservation/details");
                            }}
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
