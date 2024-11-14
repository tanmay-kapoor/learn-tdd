import { Response } from "express";
import Author from "../models/author"; // Adjust the import to your Author model path
import * as AuthorFunctions from "../pages/authors"; // Import everything from your module
import { getAuthorList, showAllAuthors } from "../pages/authors"; // Import your functions

describe("Author Functions", () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    describe("getAuthorList", () => {
        it("should fetch and format the authors list correctly", async () => {
            const sortedAuthors = [
                {
                    first_name: "Jane",
                    family_name: "Austen",
                    date_of_birth: new Date("1775-12-16"),
                    date_of_death: new Date("1817-07-18"),
                },
                {
                    first_name: "Amitav",
                    family_name: "Ghosh",
                    date_of_birth: new Date("1835-11-30"),
                    date_of_death: new Date("1910-04-21"),
                },
                {
                    first_name: "Rabindranath",
                    family_name: "Tagore",
                    date_of_birth: new Date("1812-02-07"),
                    date_of_death: new Date("1870-06-09"),
                },
            ];

            const mockFind = jest.fn().mockReturnValue({
                sort: jest.fn().mockResolvedValue(sortedAuthors),
            });

            Author.find = mockFind;

            const result = await getAuthorList();
            const expectedAuthors = [
                "Austen, Jane : 1775 - 1817",
                "Ghosh, Amitav : 1835 - 1910",
                "Tagore, Rabindranath : 1812 - 1870",
            ];
            expect(result).toEqual(expectedAuthors);
            expect(mockFind().sort).toHaveBeenCalledWith([
                ["family_name", "ascending"],
            ]);
        });

        it("should format fullname correctly if first name is absent", async () => {
            const sortedAuthors = [
                {
                    first_name: "",
                    family_name: "Austen",
                    date_of_birth: new Date("1775-12-16"),
                    date_of_death: new Date("1817-07-18"),
                },
                {
                    first_name: "Amitav",
                    family_name: "Ghosh",
                    date_of_birth: new Date("1835-11-30"),
                    date_of_death: new Date("1910-04-21"),
                },
                {
                    first_name: "Rabindranath",
                    family_name: "Tagore",
                    date_of_birth: new Date("1812-02-07"),
                    date_of_death: new Date("1870-06-09"),
                },
            ];

            const mockFind = jest.fn().mockReturnValue({
                sort: jest.fn().mockResolvedValue(sortedAuthors),
            });

            Author.find = mockFind;

            const result = await getAuthorList();
            const expectedAuthors = [
                " : 1775 - 1817",
                "Ghosh, Amitav : 1835 - 1910",
                "Tagore, Rabindranath : 1812 - 1870",
            ];
            expect(result).toEqual(expectedAuthors);
            expect(mockFind().sort).toHaveBeenCalledWith([
                ["family_name", "ascending"],
            ]);
        });

        it("should format fullname correctly if family name is absent", async () => {
            const sortedAuthors = [
                {
                    first_name: "Jane",
                    family_name: "",
                    date_of_birth: new Date("1775-12-16"),
                    date_of_death: new Date("1817-07-18"),
                },
                {
                    first_name: "Amitav",
                    family_name: "Ghosh",
                    date_of_birth: new Date("1835-11-30"),
                    date_of_death: new Date("1910-04-21"),
                },
                {
                    first_name: "Rabindranath",
                    family_name: "Tagore",
                    date_of_birth: new Date("1812-02-07"),
                    date_of_death: new Date("1870-06-09"),
                },
            ];

            const mockFind = jest.fn().mockReturnValue({
                sort: jest.fn().mockResolvedValue(sortedAuthors),
            });

            Author.find = mockFind;

            const result = await getAuthorList();
            const expectedAuthors = [
                " : 1775 - 1817",
                "Ghosh, Amitav : 1835 - 1910",
                "Tagore, Rabindranath : 1812 - 1870",
            ];
            expect(result).toEqual(expectedAuthors);
            expect(mockFind().sort).toHaveBeenCalledWith([
                ["family_name", "ascending"],
            ]);
        });

        it("should format fullname as empty string if both first and family names are absent", async () => {
            const sortedAuthors = [
                {
                    first_name: "",
                    family_name: "",
                    date_of_birth: new Date("1775-12-16"),
                    date_of_death: new Date("1817-07-18"),
                },
                {
                    first_name: "Amitav",
                    family_name: "Ghosh",
                    date_of_birth: new Date("1835-11-30"),
                    date_of_death: new Date("1910-04-21"),
                },
                {
                    first_name: "Rabindranath",
                    family_name: "Tagore",
                    date_of_birth: new Date("1812-02-07"),
                    date_of_death: new Date("1870-06-09"),
                },
            ];

            const mockFind = jest.fn().mockReturnValue({
                sort: jest.fn().mockResolvedValue(sortedAuthors),
            });

            Author.find = mockFind;

            const result = await getAuthorList();
            const expectedAuthors = [
                " : 1775 - 1817",
                "Ghosh, Amitav : 1835 - 1910",
                "Tagore, Rabindranath : 1812 - 1870",
            ];
            expect(result).toEqual(expectedAuthors);
            expect(mockFind().sort).toHaveBeenCalledWith([
                ["family_name", "ascending"],
            ]);
        });

        it("should return an empty array when an error occurs", async () => {
            Author.find = jest.fn().mockImplementation(() => {
                throw new Error("Database error");
            });

            const result = await getAuthorList();
            expect(result).toEqual([]);
        });
    });

    describe("showAllAuthors", () => {
        let mockResponse: Response;

        beforeEach(() => {
            mockResponse = {
                send: jest.fn(),
            } as unknown as Response; // Type casting to Response
        });

        it("should send the authors list if data is available", async () => {
            const authorsList = [
                "Austen, Jane : 1775 - 1817",
                "Ghosh, Amitav : 1835 - 1910",
                "Tagore, Rabindranath : 1812 - 1870",
            ];
            jest
                .spyOn(AuthorFunctions, "getAuthorList")
                .mockResolvedValue(authorsList);

            await showAllAuthors(mockResponse);

            expect(mockResponse.send).toHaveBeenCalledWith(authorsList);
        });

        it('should send "No authors found" if the data array is empty', async () => {
            jest.spyOn(AuthorFunctions, "getAuthorList").mockResolvedValue([]);

            await showAllAuthors(mockResponse);

            expect(mockResponse.send).toHaveBeenCalledWith("No authors found");
        });

        it('should send "No authors found" if an error occurs', async () => {
            jest
                .spyOn(AuthorFunctions, "getAuthorList")
                .mockRejectedValue(new Error("Error"));

            await showAllAuthors(mockResponse);

            expect(mockResponse.send).toHaveBeenCalledWith("No authors found");
        });
    });
});