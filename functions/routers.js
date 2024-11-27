const express = require("express");
const bcrypt = require("bcrypt");

// const jwt = require("jsonwebtoken");
const { User, Project, Attendance } = require("./models");
// const { isSeller } = require("./middleware");

const router = express.Router();
// const asyncHandler = require("express-async-handler");
const { Op } = require("sequelize");
const expressAsyncHandler = require("express-async-handler");

// const JWT_SECRET = process.env.JWT_SECRET || "instamine";

// async function addChatPartner(userId, partnerId) {
// 	try {
// 		const chatMessage = await ChatMessage.create();

// 		let chat1 = await Chat.findOne({ where: { userId } });
// 		if (chat1) {
// 			chat1.chatPartner = {
// 				...chat1.chatPartner,
// 				[partnerId]: chatMessage.id,
// 			};
// 			await chat1.save();
// 		} else {
// 			chat1 = await Chat.create({
// 				userId,
// 				chatPartner: { [partnerId]: chatMessage.id },
// 			});
// 		}

// 		let chat2 = await Chat.findOne({ where: { userId: partnerId } });
// 		if (chat2) {
// 			chat2.chatPartner = {
// 				...chat2.chatPartner,
// 				[userId]: chatMessage.id,
// 			};
// 			await chat2.save();
// 		} else {
// 			chat2 = await Chat.create({
// 				userId: partnerId,
// 				chatPartner: { [userId]: chatMessage.id },
// 			});
// 		}
// 		return { success: true, chat: chat1 };
// 	} catch (error) {
// 		return {
// 			success: false,
// 			message: "Could not initiate chat",
// 			details: error,
// 		};
// 	}
// }

// class ChatRouter {
// 	constructor() {
// 		this.router = router;
// 		this.initRoutes();
// 	}

// 	initRoutes() {
// 		this.router.post("/get-chats", expressAsyncHandler(this.getAllChats));
// 		this.router.post(
// 			"/retrieve-chat",
// 			expressAsyncHandler(this.retrieveChats)
// 		);
// 		this.router.post("/message", expressAsyncHandler(this.messagePartner));
// 	}

// 	async getAllChats(req, res) {
// 		const { userId } = req.body;

// 		try {
// 			const chat = await Chat.findOne({ where: { userId } });
// 			if (!chat) {
// 				await Chat.create({
// 					userId,
// 					chatPartner: {},
// 				});
// 				res.send({ success: true, chats: {} });
// 				return;
// 			}

// 			const partnerIds = Object.keys(chat.chatPartner);

// 			const partners = await User.findAll({
// 				where: { id: partnerIds },
// 				attributes: ["id", "username", "profileImage"],
// 			});

// 			const chats = await Promise.all(
// 				partnerIds.map(async (partnerId) => {
// 					const partner = partners.find(
// 						(p) => p.id.toString() === partnerId
// 					);

// 					if (partner) {
// 						const chatMessageId = chat.chatPartner[partnerId];
// 						const chatMessage = await ChatMessage.findByPk(
// 							chatMessageId
// 						);

// 						const lastMessage = chatMessage.messages?.length
// 							? chatMessage.messages[
// 									chatMessage.messages.length - 1
// 							  ]
// 							: null;

// 						return {
// 							partnerId,
// 							username: partner.username,
// 							profileImage: partner.profileImage,
// 							chatMessageId,
// 							lastMessage,
// 						};
// 					}
// 					return null;
// 				})
// 			);

// 			res.send({
// 				success: true,
// 				chats: chats.filter((chat) => chat !== null),
// 			});
// 		} catch (error) {
// 			res.send({
// 				message: "Could not save message",
// 				details: error,
// 			});
// 		}
// 	}

// 	async retrieveChats(req, res) {
// 		const { userId, partnerId } = req.body;

// 		try {
// 			let chat = await Chat.findOne({ where: { userId } });
// 			if (!chat) {
// 				const result = await addChatPartner(userId, partnerId);
// 				if (!result.success) res.send(result);
// 				chat = result.chat;
// 			}
// 			const chatMessage = await ChatMessage.findByPk(
// 				chat.chatPartner[partnerId]
// 			);
// 			// await chatMessage.update({ messages: [] });
// 			res.send({
// 				success: true,
// 				message: "Load successfully",
// 				messages: chatMessage.messages,
// 			});
// 		} catch (error) {
// 			console.log(error);
// 			res.send({
// 				success: false,
// 				message: "Could not save message",
// 				details: error,
// 			});
// 		}
// 	}

// 	async messagePartner(req, res) {
// 		const { userId, partnerId, message } = req.body;

// 		try {
// 			let chat = await Chat.findOne({ where: { userId } });
// 			if (!chat) {
// 				const result = await addChatPartner(userId, partnerId);
// 				if (!result.success) res.send(result);
// 				chat = result.chat;
// 			}
// 			const chatMessage = await ChatMessage.findByPk(
// 				chat.chatPartner[partnerId]
// 			);

// 			const messagesArray = chatMessage.messages
// 				? [...chatMessage.messages, { sender: userId, message }]
// 				: [{ sender: userId, message }];
// 			await chatMessage.update({ messages: messagesArray });

// 			res.send({
// 				success: true,
// 				message: "Send successfully",
// 				messages: chatMessage.messages,
// 			});
// 		} catch (error) {
// 			res.send({
// 				success: false,
// 				message: "Could not save message",
// 				details: error,
// 			});
// 		}
// 	}
// }

class UserRoute {
	constructor() {
		this.router = router;
		this.initRoutes();
	}

	initRoutes() {
		this.router.post("/create-user", expressAsyncHandler(this.createUser));
		// this.router.post("/verify", expressAsyncHandler(this.verifyAccount));
		// this.router.post("/seller", expressAsyncHandler(this.becomeSeller));

		this.router.post("/login", expressAsyncHandler(this.loginUser));
		this.router.post(
			"/get-all-employees",
			expressAsyncHandler(this.getAllEmployees)
		);
		this.router.post(
			"/get-all-manager",
			expressAsyncHandler(this.getAllManager)
		);
	}

	async createUser(req, res) {
		const {
			firstName,
			lastName,
			middleName,
			gender,
			email,
			password,
			department,
			skills,
			isManager,
		} = req.body;

		try {
			const user = await User.findOne({
				where: { email },
			});
			if (user) {
				return res.send({
					success: false,
					message: "Email is already being used.",
				});
			}
			const hashedPassword = await bcrypt.hash(password, 10);
			await User.create({
				firstName,
				lastName,
				middleName,
				gender,
				email,
				password: hashedPassword,
				department,
				skills,
				isManager,
			});

			return res.send({
				message: "User created successfully",
				success: true,
			});
		} catch (error) {
			console.error(error);
			return res.send({
				message: "Error creating user: " + error.message,
				success: false,
			});
		}
	}

	async loginUser(req, res) {
		const { email, password } = req.body;

		try {
			const normalizedEmail = email.toLowerCase().trim();
			const user = await User.findOne({
				where: { email: normalizedEmail },
			});

			if (!user || !(await bcrypt.compare(password, user.password))) {
				return res.send({
					success: false,
					message: "Email or password is invalid.",
				});
			}

			return res.send({
				message: "Login successful",
				success: true,
				user: user,
			});
		} catch (error) {
			console.error(error);
			return res.send({
				message: "Error logging in",
				success: false,
				error: error.message,
			});
		}
	}

	async getAllEmployees(req, res) {
		const { notAssigned, is_deact } = req.body;

		try {
			const whereClause = {};
			if (
				(notAssigned !== undefined && notAssigned == true) ||
				notAssigned == "true"
			) {
				whereClause["projectManager"] = "";
				whereClause["isManager"] = false;
			}

			const users = await User.findAll({
				where: whereClause,
			});
			return res.send({
				success: true,
				message: "Employees fetched successfully",
				users,
			});
		} catch (error) {
			console.log(error);
			return res.send({
				success: false,
				message: "Error on fetching Employees",
			});
		}
	}

	async getAllManager(req, res) {
		try {
			const users = await User.findAll({
				where: {
					isManager: true,
					projectManager: "",
				},
			});
			return res.send({
				success: true,
				message: "Project Managers fetched successfully",
				managers: users,
			});
		} catch (error) {
			console.log(error);
			return res.send({
				success: false,
				message: "Error on fetching Project Managers",
			});
		}
	}
}

class ProjectRouter {
	constructor() {
		this.router = router;
		this.initRoutes();
	}
	initRoutes() {
		// this.router.get("/", asyncHandler(this.test));
		this.router.post(
			"/create-project",
			expressAsyncHandler(this.createProject)
		);
		this.router.post(
			"/get-all-projects",
			expressAsyncHandler(this.getAllProjects)
		);
		this.router.post(
			"/get-all-project-employee",
			expressAsyncHandler(this.getAllProjectEmployee)
		);
		this.router.post(
			"/add-project-employee",
			expressAsyncHandler(this.assignEmployeeOnProject)
		);
		// this.router.post(
		// 	"/deactive:id",
		// 	isSeller,
		// 	asyncHandler(this.deactivateProduct)
		// );
		// this.router.get("/products", asyncHandler(this.getAllProducts));
	}

	async assignEmployeeOnProject(req, res) {
		const { project_id, employee_id } = req.body;
		try {
			const project = await Project.findByPk(project_id, {
				include: {
					model: User,
					as: "Users",
					attributes: ["firstName", "middleName", "lastName"],
				},
			});
			if (!project) {
				return res.send({
					success: false,
					message: "Project does not exist.",
				});
			}
			const user = await User.findByPk(employee_id);
			if (!user) {
				return res.send({
					success: false,
					message: "Employee does not exist.",
				});
			}
			await user.update({
				projectManager:
					project.Users.firstName +
					" " +
					project.Users.middleName +
					" " +
					project.Users.lastName,
			});
			await project.update({
				projectEmployees: [...project.projectEmployees, employee_id],
			});
			res.send({
				success: true,
				message: "Project Employees added successfully",
			});
		} catch (error) {
			console.log(error);
			res.send({
				success: false,
				message: "Error on adding Project Employees",
			});
		}
	}

	async getAllProjectEmployee(req, res) {
		const { id } = req.body;
		try {
			const project = await Project.findByPk(id);
			if (!project) {
				return res.send({
					success: false,
					message: "Project does not exist.",
				});
			}

			const allUsers = await User.findAll({
				where: {
					id: {
						[Op.in]: project.projectEmployees,
					},
				},
			});
			res.send({
				success: true,
				message: "Project Employees fetched successfully",
				users: allUsers,
			});
		} catch (error) {
			console.log(error);
			res.send({
				success: false,
				message: "Error on fetching Project Employees",
			});
		}
	}

	async createProject(req, res) {
		const {
			projectManager,
			projectName,
			projectLocation,
			projectType,
			projectDescription,
			startDate,
			endDate,
		} = req.body;

		try {
			const project = await Project.findOne({
				where: { projectName },
			});
			if (project) {
				return res.send({
					success: false,
					message: "Project name is already being used.",
				});
			}
			const manager = await User.findByPk(projectManager);
			await manager.update({ projectManager: "self" });
			await Project.create({
				projectManager,
				projectName,
				projectLocation,
				projectType,
				projectDescription,
				startDate,
				endDate,
			});

			return res.send({
				message: "Project created successfully",
				success: true,
			});
		} catch (error) {
			console.error(error);
			return res.send({
				message: "Error creating project: " + error.message,
				success: false,
			});
		}
	}

	async getAllProjects(req, res) {
		const { filter } = req.body;
		try {
			const projects = await Project.findAll({
				where: { status: filter },
				include: {
					model: User,
					as: "Users",
					attributes: ["firstName", "middleName", "lastName"],
				},
			});
			res.send({
				success: true,
				message: "Projects fetched successfully",
				projects,
			});
		} catch (error) {
			console.log(error);
			res.send({
				success: false,
				message: "Error on fetching Projects",
			});
		}
	}
}

class HandleAttendance {
	constructor() {
		this.router = router;
		this.initRoutes();
	}
	initRoutes() {
		this.router.post(
			"/setAttendance",
			expressAsyncHandler(this.setAttendance)
		);
		this.router.post(
			"/createAttendance",
			expressAsyncHandler(this.createAttendance)
		);
		this.router.post(
			"/getAllEmployeesAttendance",
			expressAsyncHandler(this.getAllEmployeesAttendance)
		);
	}

	async setAttendance(req, res) {
		const { userId } = req.body;
		try {
			const project = await Project.findOne({
				where: { projectManager: userId },
			});

			if (!project) {
				return res.send({
					success: false,
					message: "Project does not exist.",
				});
			}
			const allUsers = await User.findAll({
				where: {
					id: {
						[Op.in]: project.projectEmployees,
					},
				},
			});

			if (!allUsers.length) {
				return res.send({
					success: false,
					message: "No employees found in the project.",
				});
			}

			const todayDate = new Date().toISOString().split("T")[0];
			const attendanceData = allUsers.map((user) => {
				const isOnLeave =
					user.leaveStart &&
					user.leaveEnd &&
					todayDate >= user.leaveStart.toISOString().split("T")[0] &&
					todayDate <= user.leaveEnd.toISOString().split("T")[0];

				return {
					userId: user.id,
					date: todayDate,
					isPresent: false,
					isAbsent: false,
					notDecided: !isOnLeave,
					isOnLeave: isOnLeave === null || isOnLeave,
				};
			});

			await Attendance.bulkCreate(attendanceData);
			return res.send({
				success: true,
				message:
					"Attendance records created with default absent status.",
			});
		} catch (error) {
			console.error("Error setting attendance:", error);
			res.status(500).send({ success: false, message: "Server error." });
		}
	}

	async createAttendance(req, res) {
		const { userId, isPresent } = req.body;
		const todayDate = new Date().toISOString().split("T")[0];

		try {
			const attendance = await Attendance.findOne({
				where: {
					// date: todayDate,
					userId,
					isOnLeave: null,
				},
			});
			if (!attendance) {
				return res.status(404).send({
					success: false,
					message: "Attendance record not found or user is on leave.",
				});
			}
			await attendance.update({
				isPresent: isPresent,
				isAbsent: !isPresent,
				isOnLeave: false,
				notDecided: false,
			});
			return res.send({
				success: true,
				message: "Attendance updated successfully.",
			});
		} catch (error) {
			console.error("Error updating attendance:", error);
			return res.status(500).send({
				success: false,
				message: "Server error.",
			});
		}
	}

	async getAllEmployeesAttendance(req, res) {
		const { id, isPresent, isAbsent, isOnLeave, notDecided } = req.body;

		try {
			let project;
			if (id == "") {
				res.send({
					success: true,
					message: "Project employees fetched successfully.",
					users: [],
				});
				return;
			} else project = await Project.findByPk(id);

			if (!project) {
				return res.send({
					success: false,
					message: "Project does not exist.",
				});
			}

			const allUsers = await User.findAll({
				where: {
					id: {
						[Op.in]: project.projectEmployees,
					},
				},
			});

			if (allUsers.length === 0) {
				return res.send({
					success: false,
					message: "No employees found for this project.",
				});
			}

			const todayDate = new Date().toISOString().split("T")[0];
			const allAttendance = await Attendance.findAll({
				where: {
					userId: {
						[Op.in]: allUsers.map((user) => user.id),
					},
					// isPresent,
					// isAbsent,
					// isOnLeave,
					// notDecided,
					// date: todayDate,
				},
			});
			const allAttendances = await Attendance.findAll();
			console.log(allAttendance);
			console.log(allAttendances);
			const allUsersInAttendance = allUsers
				.filter((user) =>
					allAttendance.some((att) => att.userId === user.id)
				)
				.map((user) => {
					const attendance = allAttendance.find(
						(att) => att.userId === user.id
					);
					return {
						...user.toJSON(),
						attendance,
					};
				});
			res.send({
				success: true,
				message: "Project employees fetched successfully.",
				users: allUsersInAttendance,
			});
		} catch (error) {
			console.log(error);
			res.send({
				success: false,
				message: "Error on fetching project employees.",
			});
		}
	}
}

// class ProductRoute {
// 	constructor() {
// 		this.router = router;
// 		this.initRoutes();
// 	}

// 	initRoutes() {
// 		this.router.get("/", asyncHandler(this.test));
// 		this.router.post("/create", isSeller, asyncHandler(this.createProduct));
// 		this.router.post(
// 			"/deactive:id",
// 			isSeller,
// 			asyncHandler(this.deactivateProduct)
// 		);
// 		this.router.get("/products", asyncHandler(this.getAllProducts));
// 	}

// 	async test(req, res) {
// 		res.send("TEST");
// 	}

// 	async createProduct(req, res) {
// 		const { name, userId, specification, category } = req.body;
// 		try {
// 			const newProduct = await Product.create({
// 				name,
// 				userId,
// 				specification,
// 				category,
// 				active: true,
// 			});

// 			return res.status(201).json({
// 				success: true,
// 				message: "Product created successfully",
// 				product: newProduct,
// 			});
// 		} catch (error) {
// 			return res.status(500).json({
// 				success: false,
// 				message: "Error creating product",
// 				error: error.message,
// 			});
// 		}
// 	}

// 	async deactivateProduct(req, res) {
// 		const productId = req.params.id;

// 		try {
// 			const product = await Product.findByPk(productId);

// 			if (!product) {
// 				return res.status(404).json({
// 					success: false,
// 					message: "Product not found",
// 				});
// 			}
// 			product.active = false;
// 			await product.save();

// 			return res.status(200).json({
// 				success: true,
// 				message: "Product deactivated successfully",
// 				product,
// 			});
// 		} catch (error) {
// 			return res.status(500).json({
// 				success: false,
// 				message: "Error deactivating product",
// 				error: error.message,
// 			});
// 		}
// 	}

// 	async getAllProducts(req, res) {
// 		const { category, search, email } = req.query;

// 		try {
// 			let query = {
// 				where: {},
// 				include: [
// 					{
// 						model: User,
// 						as: "Users",
// 						attributes: [
// 							"id",
// 							"username",
// 							"email",
// 							"organizationName",
// 							"profileImage",
// 							"numberProduct",
// 							"online",
// 							"location",
// 							"logoutTime",
// 						],
// 						where: {},
// 					},
// 				],
// 			};

// 			if (category) {
// 				query.where.category = category;
// 			}

// 			if (search) {
// 				query.where.name = {
// 					[Op.like]: `%${search}%`,
// 				};
// 				query.limit = 10;
// 			}

// 			if (email) {
// 				query.include[0].where.email = email;
// 			}

// 			const products = await Product.findAll(query);

// 			return res.status(200).json({
// 				success: true,
// 				message: "Products fetched successfully",
// 				products,
// 			});
// 		} catch (error) {
// 			throw error;
// 		}
// 	}
// }

const userRouter = new UserRoute().router;
const projectRouter = new ProjectRouter().router;
const handleAttendance = new HandleAttendance().router;
// const productRouter = new ProductRoute().router;
module.exports = { userRouter, projectRouter, handleAttendance };
