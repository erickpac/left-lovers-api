import request from "supertest";
import express from "express";
import { getUsers } from "./controller";
import { getAllUsers } from "@/components/users/service";
import { sendSuccessResponse, sendErrorResponse } from "@/common/responses";

jest.mock("@/components/users/service");
jest.mock("@/common/responses");

const app = express();
app.get("/users", getUsers);

describe("Users controller", () => {
  describe("GET /users", () => {
    const mockUsers = [{ id: 1, name: "John Doe" }];
    const errorMessage = "An error occurred";

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return a list of users", async () => {
      (getAllUsers as jest.Mock).mockResolvedValue(mockUsers);
      (sendSuccessResponse as jest.Mock).mockImplementation(({ res, data }) => {
        res.status(200).json(data);
      });

      const response = await request(app).get("/users");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsers);
      expect(getAllUsers).toHaveBeenCalledTimes(1);
      expect(sendSuccessResponse).toHaveBeenCalledWith({
        res: expect.anything(),
        data: mockUsers,
      });
    });

    it("should handle errors", async () => {
      (getAllUsers as jest.Mock).mockRejectedValue(new Error(errorMessage));
      (sendErrorResponse as jest.Mock).mockImplementation(
        ({ res, message }) => {
          res.status(500).json({ error: message });
        },
      );

      const response = await request(app).get("/users");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: errorMessage });
      expect(getAllUsers).toHaveBeenCalledTimes(1);
      expect(sendErrorResponse).toHaveBeenCalledWith({
        res: expect.anything(),
        message: errorMessage,
      });
    });
  });
});