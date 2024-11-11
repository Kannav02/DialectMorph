import fs from "fs";
import os from "os";
import path from "path";
import toml from "toml";
import {
	makeDir,
	createFile,
	extractCodeBlock,
	loadTomlConfigFile,
} from "../src/fileHelper";

// Mock the required modules
jest.mock("fs");
jest.mock("os");
jest.mock("path");
jest.mock("toml");

describe("File utility functions", () => {
	beforeEach(() => {
		jest.resetAllMocks();
		jest.spyOn(process, "cwd").mockReturnValue("/root");
		path.join = jest.fn((...args: string[]) => args.join("/"));
		path.resolve = jest.fn((...args: string[]) => args.join("/"));

		(fs.existsSync as jest.Mock).mockReturnValue(false);
		(fs.mkdirSync as jest.Mock).mockImplementation(() => "/root/testDir");
		(os.homedir as jest.Mock).mockReturnValue("/home/user");
		(toml.parse as jest.Mock).mockReturnValue({});
	});

	describe("makeDir Function", () => {
		it("Creates a Directory and returns its path", () => {
			const result = makeDir("testDir");

			expect(fs.mkdirSync).toHaveBeenCalledWith("/root/testDir", {
				recursive: true,
			});
			expect(result).toBe("/root/testDir");
		});
		it("Doesn't create directory if it already exists", () => {
			(fs.existsSync as jest.Mock).mockReturnValue(true);
			const result = makeDir("testDir");

			expect(result).toBe("/root/testDir");
			expect(fs.mkdirSync).not.toHaveBeenCalled();
		});
	});
	describe("createFile Function", () => {
		it("Creates a file", () => {
			const result = createFile("random", "txt", "/root", "something random");
			expect(result).not.toBeDefined();
			expect(path.join).toHaveBeenCalledWith("/root", "random.txt");
			expect(fs.writeFileSync).toHaveBeenCalledWith(
				"/root/random.txt",
				"something random"
			);
		});
	});
	describe("extractCodeBlock Function", () => {
		it("Empty string if no valid content given", () => {
			const result = extractCodeBlock("something lalala");

			expect(result).toBe("");
		});
		it("The code if valid content given", () => {
			const result = extractCodeBlock(
				"``` Hello This is something random  ```"
			);

			expect(result).toBe("Hello This is something random");
		});
	});
	describe("loadTomlConfigFile Function", () => {
		it("Should parse dialectMorph.config.toml, if no file name provided", () => {
			(fs.existsSync as jest.Mock).mockReturnValue(true);
			(fs.readFileSync as jest.Mock).mockReturnValue(`
                Key1:somethingRandom
                Key2:somethingRandom
                `);
			(toml.parse as jest.Mock).mockReturnValue({
				Key1: "somethingRandom",
				Key2: "somethingRandom",
			});

			const result = loadTomlConfigFile();

			expect(result).toEqual({
				Key1: "somethingRandom",
				Key2: "somethingRandom",
			});
			expect(fs.existsSync).toHaveBeenCalledWith(
				"/home/user/dialectMorph.config.toml"
			);
			expect(fs.readFileSync).toHaveBeenCalledWith(
				"/home/user/dialectMorph.config.toml",
				"utf-8"
			);
			expect(toml.parse).toHaveBeenCalledWith(`
                Key1:somethingRandom
                Key2:somethingRandom
                `);
		});
		it("Should parse the given file name if it exists", () => {
			(fs.existsSync as jest.Mock).mockReturnValue(true);
			(fs.readFileSync as jest.Mock).mockReturnValue(`
                Key1:somethingRandom
                Key2:somethingRandom
                `);
			(toml.parse as jest.Mock).mockReturnValue({
				Key1: "somethingRandom",
				Key2: "somethingRandom",
			});

			const result = loadTomlConfigFile("somethingRandom.toml");

			expect(result).toEqual({
				Key1: "somethingRandom",
				Key2: "somethingRandom",
			});
			expect(fs.existsSync).toHaveBeenCalledWith(
				"/home/user/somethingRandom.toml"
			);
			expect(fs.readFileSync).toHaveBeenCalledWith(
				"/home/user/somethingRandom.toml",
				"utf-8"
			);
			expect(toml.parse).toHaveBeenCalledWith(`
                Key1:somethingRandom
                Key2:somethingRandom
                `);
		});
		it("Should return {} if no file exists in the users home directory", () => {
			(fs.existsSync as jest.Mock).mockReturnValue(false);

			const result = loadTomlConfigFile("notExistingPath.toml");

			expect(result).toEqual({});
			expect(fs.existsSync).toHaveBeenCalledWith(
				"/home/user/notExistingPath.toml"
			);
			expect(fs.readFileSync).not.toHaveBeenCalled();

			expect(toml.parse).not.toHaveBeenCalled();
		});
	});
});
