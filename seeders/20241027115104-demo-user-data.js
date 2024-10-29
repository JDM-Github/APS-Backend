"use strict";
const bcrypt = require("bcrypt");

module.exports = {
	up: async (queryInterface, Sequelize) => {
		const sellerPassword = await bcrypt.hash("seller", 10);
		const clientPassword = await bcrypt.hash("client", 10);
		await queryInterface.bulkInsert("Users", [
			{
				id: 1,
				profileImage: "http://example.com/profile-seller.jpg",
				firstName: "Seller",
				lastName: "One",
				username: "seller",
				organizationName: "Seller Organization",
				birthdate: "1985-06-15",
				email: "seller_one@example.com",
				password: sellerPassword,
				isSeller: true,
				isVerified: true,
				location: "New York, USA",
				numberProduct: 5,
				online: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: 2,
				profileImage: "http://example.com/profile-client.jpg",
				firstName: "Client",
				lastName: "Two",
				username: "client",
				organizationName: null,
				birthdate: "1990-08-25",
				email: "client_two@example.com",
				password: clientPassword,
				isSeller: false,
				isVerified: true,
				location: "Los Angeles, USA",
				numberProduct: 0,
				online: false,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		]);
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.bulkDelete("Users", null, {});
	},
};
