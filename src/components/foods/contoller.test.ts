import request from "supertest";
import express from "express";
import * as controller from "./controller";
import * as service from "./service";

jest.mock("./service");

const app = express();
app.get("/foods/:id", controller.getFoodById);

describe("Food Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /foods/:id", () => {
    it("should return a food item by id", async () => {
      const mockFood = { id: 1, name: "Pizza" };
      (service.getFoodById as jest.Mock).mockResolvedValue(mockFood);

      const response = await request(app).get("/foods/1");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toEqual(mockFood);
    });

    it("should return 404 if food item is not found", async () => {
      (service.getFoodById as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get("/foods/999");

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Food item not found");
    });

    it("should return 500 if there is a server error", async () => {
      (service.getFoodById as jest.Mock).mockRejectedValue(
        new Error("Server error"),
      );

      const response = await request(app).get("/foods/1");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Server error");
    });

    it("should return 400 if the id is not a number", async () => {
      const response = await request(app).get("/foods/abc");

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Invalid food ID format");
    });
  });
});