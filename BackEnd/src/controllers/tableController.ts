import * as tableService from "../services/tableService.js";
import type {
  AppNext,
  AppRequest,
  AppResponse,
  EmptyBody,
  EmptyParams,
} from "../types.js";

type AvailableTablesQuery = {
  date?: Date;
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
  req: AppRequest,
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
  req: AppRequest<EmptyParams, EmptyBody, AvailableTablesQuery>,
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

    const result = await tableService.getAvailableTablesForReservation(
      date,
      time,
      Number.parseInt(numberOfGuests, 10),
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};
