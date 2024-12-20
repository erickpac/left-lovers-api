import { CustomError } from "@/common/custom/error";
import * as service from "../service";
import prisma from "@/database/client";

jest.mock("@/database/client", () => ({
  foodItem: {
    findUnique: jest.fn(),
  },
}));

describe("Food Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getFoodById", () => {
    it("should return food details with average rating and total reviews", async () => {
      const mockFoodItem = {
        id: 1,
        name: "Pizza",
        store: {
          id: 1,
          name: "Pizza Store",
          reviews: [{ rating: 4 }, { rating: 5 }],
          categories: [{ category: { name: "Italian" } }],
          highlights: [
            { id: 1, votes: 10 },
            { id: 2, votes: 8 },
            { id: 3, votes: 6 },
          ],
        },
      };

      (prisma.foodItem.findUnique as jest.Mock).mockResolvedValue(mockFoodItem);

      const result = await service.getFoodById(1);

      expect(result).toEqual({
        id: 1,
        name: "Pizza",
        store: {
          id: 1,
          name: "Pizza Store",
          reviews: {
            total: 2,
            averageRating: 4.5,
          },
          categories: [{ category: { name: "Italian" } }],
          highlights: [
            { id: 1, votes: 10 },
            { id: 2, votes: 8 },
            { id: 3, votes: 6 },
          ],
        },
      });
    });

    it("should throw CustomError if food item is not found", async () => {
      (prisma.foodItem.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.getFoodById(999)).rejects.toThrow(CustomError);
    });
  });

  describe("getAverageRating", () => {
    it("should calculate average rating correctly for reviews", () => {
      const mockFoodItem = {
        id: 1,
        name: "Pizza",
        store: {
          id: 1,
          name: "Pizza Store",
          reviews: [{ rating: 3 }, { rating: 4 }, { rating: 5 }],
          categories: [],
          highlights: [],
        },
      };

      (prisma.foodItem.findUnique as jest.Mock).mockResolvedValue(mockFoodItem);

      return service.getFoodById(1).then((result) => {
        expect(result?.store.reviews.averageRating).toBe(4);
      });
    });
  });
});
