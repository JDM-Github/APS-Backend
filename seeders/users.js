"use strict";
const bcrypt = require("bcryptjs");

module.exports = {
	up: async (queryInterface, Sequelize) => {
		const users = [
			{
				profileImage: "https://example.com/profile1.jpg",
				firstName: "John",
				lastName: "Doe",
				middleName: "M",
				gender: "Male",
				email: "john.doe@example.com",
				password: await bcrypt.hash("password123", 10),
				department: "Engineering",
				skills: ["JavaScript", "Node.js", "React"],
				phoneNumber: "1234567890",
				location: "New York",
				position: "Software Engineer",
				salary: 80000,
				status: "Active",
				projectId: null,
				projectManagerId: null,
				projectManager: "",
				isManager: false,
				startDate: "2020-05-22",
				endDate: null,
				lastRequest: null,
				leaveStart: "2023-07-01",
				leaveEnd: "2023-07-10",
				isVerified: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				profileImage: "https://example.com/profile2.jpg",
				firstName: "Jane",
				lastName: "Smith",
				middleName: "",
				gender: "Female",
				email: "jane.smith@example.com",
				password: await bcrypt.hash("password456", 10),
				department: "Marketing",
				skills: ["Marketing", "SEO", "Content Creation"],
				phoneNumber: "9876543210",
				location: "California",
				position: "Marketing Specialist",
				salary: 70000,
				status: "Active",
				projectId: null,
				projectManagerId: null,
				projectManager: "",
				isManager: false,
				startDate: "2020-05-22",
				endDate: null,
				lastRequest: null,
				leaveStart: "2023-07-01",
				leaveEnd: "2023-07-10",
				isVerified: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		];

		// Insert users into the table
		await queryInterface.bulkInsert("Users", users, {});
	},

	down: async (queryInterface, Sequelize) => {
		// Delete all data from the Users table (rollback)
		await queryInterface.bulkDelete("Users", null, {});
	},
};
