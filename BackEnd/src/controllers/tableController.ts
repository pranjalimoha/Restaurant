import * as tableService from "../services/tableService.js";
import type {
  AppNext,
  AppRequest,
  AppResponse,
  EmptyBody,
  EmptyParams,
  CreateTableRequest,
} from "../types.js";

type AvailableTablesQuery = {
  date?: string;
  time?: string;
  numberOfGuests?: string;
};

export const getTableById = async (
  req: AppRequest,
  res: AppResponse,
  next: AppNext,
) => {
  try {
    const { id } = req.params;

    const table = await tableService.getTableById(id);

    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: table,
    });
  } catch (error) {
    return next(error);
  }
};

export const createTable = async (
  req: AppRequest<CreateTableRequest>,
  res: AppResponse,
  next: AppNext,
) => {
  try {
    const table = await tableService.createTable(req.body);

    return res.status(201).json({
      success: true,
      message: "Table created successfully",
      data: table,
    });
  } catch (error) {
    return next(error);
  }
};

export const getAllTables = async (
  _req: AppRequest,
  res: AppResponse,
  next: AppNext,
) => {
  try {
    const tables = await tableService.getAllTables();

    return res.status(200).json({
      success: true,
      data: tables,
    });
  } catch (error) {
    return next(error);
  }
};

export const getAvailableTablesForReservation = async (
  req: AppRequest<EmptyBody, EmptyParams, AvailableTablesQuery>,
  res: AppResponse,
  next: AppNext,
) => {
  try {
    const { date, time, numberOfGuests } = req.query;

    if (!date || !time || !numberOfGuests) {
      return res.status(400).json({
        success: false,
        message: "Date, time, and number of guests are required",
      });
    }

    const guests = Number.parseInt(numberOfGuests, 10);

    if (isNaN(guests)) {
      return res.status(400).json({
        success: false,
        message: "Invalid number of guests",
      });
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date",
      });
    }

    const result = await tableService.getAvailableTablesForReservation(
      parsedDate,
      time,
      guests,
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};
