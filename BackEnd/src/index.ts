import type { NextFunction, Request, Response } from "express";

export type AppRequest<
  Body = unknown,
  Params = unknown,
  Query = unknown,
> = Request<Params, unknown, Body, Query>;

export type AppResponse<T = unknown> = Response<T>;

export type AppNext = NextFunction;

export type CreateReservationRequest = {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  reservationDate: string;
  reservationTime: string;
  numberOfGuests: number;
  selectedTableIds: string[];
  specialRequests?: string;
};
