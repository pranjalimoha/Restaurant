import * as tableService from '../services/tableService.js';

export const getAvailableTablesForReservation = async (req, res, next) => {
    try {
        const { date, time, numberOfGuests } = req.query;
        if (!date || !time || !numberOfGuests) {
            return res.status(400).json({
                error: 'Date, time, and number of guests are required'
            });
        }
        const result = await tableService.getAvailableTablesForReservation(date, time, parseInt(numberOfGuests));

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const getAllTables = async (req, res, next) => {
    try {
        const tables = await tableService.getAllTables();

        res.status(200).json({
            success: true,
            data: tables,
        });
    } catch (error) {
        next(error);
    }
};

export const getTableById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const table = await tableService.getTableById(id);
        if (!table) {
            return res.status(404).json({
                success: false,
                message: 'Table not found',
            });

            res.status(200).json({
                success: true,
                data: table,
            });
        }
    }
    catch (error) {
        next(error);
    }
};

export const createTable = async (req, res, next) => {
    try {
        const table = await tableService.createTable(req.body);

        res.status(201).json({
            success: true,
            message: 'Table created successfully',
            data: table,
        });
    } catch (error) {
        next(error);
    }
};
