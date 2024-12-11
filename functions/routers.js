const express = require("express");
const bcrypt = require("bcryptjs");

// const jwt = require("jsonwebtoken");
const {
	User,
	Project,
	Attendance,
	Schedule,
	RequestLeave,
	Notification,
} = require("./models");
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
		this.router.post(
			"/makeProjectManager",
			expressAsyncHandler(this.makeProjectManager)
		);
		this.router.post(
			"/updatePositionSkills",
			expressAsyncHandler(this.updatePositionSkills)
		);
		this.router.post(
			"/requestLeave",
			expressAsyncHandler(this.requestLeave)
		);
		this.router.post(
			"/getAllAttendance",
			expressAsyncHandler(this.getAllAttendance)
		);
		this.router.post(
			"/getMonthlyAttendance",
			expressAsyncHandler(this.getMonthlyAttendance)
		);
		this.router.post(
			"/get-all-leave-request",
			expressAsyncHandler(this.getAllRequestLeave)
		);
		this.router.post(
			"/getAllNotification",
			expressAsyncHandler(this.getAllNotification)
		);
	}

	async getAllNotification(req, res) {
		const { userId } = req.body;

		try {
			const notifications = await Notification.findAll({
				where: { userId },
			});
			res.send({ success: false, notifications });
		} catch (error) {
			console.error(error);
			return res.status(500).send({
				success: false,
				message: "Error getting notifications: " + error.message,
			});
		}
	}

	async getAllAttendance(req, res) {
		const { userId, month, year } = req.body;
		try {
			const filters = {};
			if (userId) {
				filters.userId = userId;
			}
			if (year) {
				// let startOfYear, endOfYear;

				const selectedYear = year
					? parseInt(year, 10)
					: new Date().getFullYear();
				const selectedMonth = month
					? parseInt(month, 10) - 1
					: undefined;
				console.log(selectedYear);
				console.log(selectedMonth);

				// const selectedYear = parseInt(year, 10);
				let startOfYear = new Date(selectedYear, 0, 1);
				let endOfYear = new Date(selectedYear, 11, 31, 23, 59, 59);

				if (month) {
					const selectedMonth = parseInt(month, 10) - 1;
					startOfYear = new Date(selectedYear, selectedMonth, 1);
					endOfYear = new Date(
						selectedYear,
						selectedMonth + 1,
						0,
						23,
						59,
						59
					);
				}
				filters.date = { [Op.between]: [startOfYear, endOfYear] };
			}
			const attendance = await Attendance.findAll({
				where: filters,
				order: [["date", "DESC"]],
			});
			return res.status(200).send({
				success: true,
				message: "Attendance retrieved successfully",
				attendance,
			});
		} catch (error) {
			console.error(error);
			return res.status(500).send({
				success: false,
				message: "Error getting attendance: " + error.message,
			});
		}
	}

	async getMonthlyAttendance(req, res) {
		const { projectId, month, year } = req.body;

		try {
			console.log(month);
			console.log(year);
			if (!projectId) {
				return res.status(400).send({
					success: false,
					message: "Project Manager is not assigned in any project",
				});
			}

			const project = await Project.findByPk(projectId);
			if (!project) {
				return res.status(404).send({
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
				attributes: ["id", "firstName", "middleName", "lastName"],
			});

			if (!allUsers.length) {
				return res.status(404).send({
					success: false,
					message: "No employees found for the project.",
				});
			}

			const selectedYear = year
				? parseInt(year, 10)
				: new Date().getFullYear();
			const selectedMonth = month ? parseInt(month, 10) - 1 : undefined;

			const startOfMonth = new Date(selectedYear, selectedMonth, 1);
			const endOfMonth = new Date(
				selectedYear,
				selectedMonth + 1,
				0,
				23,
				59,
				59
			);

			const attendanceRecords = await Attendance.findAll({
				where: {
					date: { [Op.between]: [startOfMonth, endOfMonth] },
					userId: { [Op.in]: allUsers.map((user) => user.id) },
				},
				attributes: ["userId", "isPresent", "isAbsent", "isOnLeave"],
			});

			if (!attendanceRecords.length) {
				return res.status(200).send({
					success: true,
					message:
						"No attendance records found for the selected month.",
					data: [],
				});
			}

			const attendanceSummary = allUsers.map((user) => ({
				userId: user.id,
				userName:
					user.firstName +
					" " +
					(user.middleName ? user.middleName + " " : "") +
					user.lastName,
				present: 0,
				absent: 0,
				leave: 0,
			}));

			attendanceRecords.forEach((record) => {
				const userSummary = attendanceSummary.find(
					(u) => u.userId === record.userId
				);
				if (userSummary) {
					if (record.isPresent) {
						userSummary.present += 1;
					} else if (record.isAbsent) {
						userSummary.absent += 1;
					} else if (record.isOnLeave) {
						userSummary.leave += 1;
					}
				}
			});

			const filteredSummary = attendanceSummary.filter(
				(user) => user.present > 0 || user.absent > 0 || user.leave > 0
			);

			return res.status(200).send({
				success: true,
				message: "Monthly attendance retrieved successfully",
				data: filteredSummary,
			});
		} catch (error) {
			console.error(error);
			return res.status(500).send({
				success: false,
				message: "Error getting attendance: " + error.message,
			});
		}
	}

	async getAllRequestLeave(req, res) {
		const { projectId } = req.body;
		try {
			const project = await Project.findByPk(projectId);
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

			const userIds = allUsers.map((user) => user.id);
			const leaveRequests = await RequestLeave.findAll({
				where: {
					userId: {
						[Op.in]: userIds,
					},
				},
				include: {
					model: User,
					attributes: ["firstName", "middleName", "lastName"],
				},
			});
			return res.status(200).send({
				success: true,
				message: "Leave requests fetched successfully.",
				data: leaveRequests,
			});

			// return res.status(200).send({
			// 	success: true,
			// 	message: "Leave requests fetched successfully.",
			// });
		} catch (error) {
			console.error(error);
			return res.status(500).send({
				success: false,
				message: "Error processing the leave request: " + error.message,
			});
		}
	}

	async requestLeave(req, res) {
		const { userId, reason, leaveType, startDate, endDate } = req.body;
		try {
			const user = await User.findByPk(userId);

			if (!user) {
				return res.status(404).send({
					success: false,
					message: "Employee does not exist.",
				});
			}

			const currentDate = new Date();
			const lastRequestDate = new Date(user.lastRequest);
			const timeDifference = currentDate - lastRequestDate;
			const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

			if (timeDifference < oneDayInMilliseconds) {
				return res.status(400).send({
					success: false,
					message:
						"You cannot request leave within 24 hours of your last request.",
				});
			}

			await RequestLeave.destroy({
				where: { userId },
			});
			await RequestLeave.create({
				userId,
				reason,
				leaveType,
				startDate,
				endDate,
			});

			await user.update({
				lastRequest: currentDate,
				isManager: true,
			});

			await Notification.create({
				userId,
				title: "Leave Request Submitted",
				message: `Your leave request for ${startDate} to ${endDate} has been submitted successfully.`,
			});

			return res.status(200).send({
				success: true,
				message: "Leave request submitted successfully.",
			});
		} catch (error) {
			console.error(error);
			return res.status(500).send({
				success: false,
				message: "Error processing the leave request: " + error.message,
			});
		}
	}

	async makeProjectManager(req, res) {
		const { userId } = req.body;
		try {
			const user = await User.findByPk(userId);
			if (!user) {
				return res.send({
					success: false,
					message: "Employee is does not exists.",
				});
			}
			await user.update({ isManager: true });
			return res.send({
				message: "Employee is now project manager.",
				success: true,
			});
		} catch (error) {
			console.error(error);
			return res.send({
				message: "Error making project manager: " + error.message,
				success: false,
			});
		}
	}

	async updatePositionSkills(req, res) {
		const { userId, position, skills } = req.body;
		try {
			const user = await User.findByPk(userId);
			if (!user) {
				return res.send({
					success: false,
					message: "Employee is does not exists.",
				});
			}
			console.log(skills);
			await user.update({ position, skills });
			console.log(user);
			return res.send({
				message: "Employee updated successfully",
				success: true,
			});
		} catch (error) {
			console.error(error);
			return res.send({
				message: "Error making updating employee: " + error.message,
				success: false,
			});
		}
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
			position,
			isProjectManager,
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
				position,
				isManager: isProjectManager,
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
		const { doesNotHaveProject } = req.body;
		try {
			const whereClause = { isManager: true, projectManager: "" };
			if (doesNotHaveProject !== undefined && doesNotHaveProject)
				whereClause["projectId"] = null;
			const users = await User.findAll({
				where: whereClause,
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
				projectManagerId: project.Users.id,
				projectId: project.id,
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
			budget,
			projectLocation,
			projectType,
			projectDescription,
			startDate,
			endDate,
			clientName,
			clientEmail,
			clientType,
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
			const newProject = await Project.create({
				projectManager,
				projectName,
				projectLocation,
				projectType,
				budget,
				clientName,
				clientEmail,
				clientType,
				projectDescription,
				startDate,
				endDate,
			});
			await manager.update({ projectId: newProject.id });

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
			"/getAllSchedule",
			expressAsyncHandler(this.getAllSchedule)
		);
		this.router.post(
			"/createSchedule",
			expressAsyncHandler(this.createSchedule)
		);
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
		this.router.post(
			"/getAllEmployeesAttendanceVar",
			expressAsyncHandler(this.getAllEmployeesAttendanceVar)
		);
	}

	async createSchedule(req, res) {
		const { userId, date, timeFrom, timeTo, description } = req.body;
		try {
			await Schedule.create({
				userId,
				date,
				timeIn: timeFrom,
				timeOut: timeTo,
				description,
			});
			return res.send({
				success: true,
			});
		} catch (error) {
			console.error("Error getting schedules:", error);
			res.status(500).send({ success: false, message: "Server error." });
		}
	}

	async getAllSchedule(req, res) {
		const { userId } = req.body;
		try {
			const schedules = await Schedule.findAll({
				where: { userId },
			});
			return res.send({
				success: true,
				schedules,
			});
		} catch (error) {
			console.error("Error getting schedules:", error);
			res.status(500).send({ success: false, message: "Server error." });
		}
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
		const { userId, timeIn, place, status } = req.body;
		const todayDate = new Date().toISOString().split("T")[0];

		try {
			// console.log({
			// 	date: todayDate,
			// 	userId,
			// 	timeIn,
			// 	place,
			// 	isPresent: status === "Present",
			// 	isAbsent: status === "Absent",
			// 	isOnLeave: status === "Leave",
			// });
			await Attendance.create({
				date: todayDate,
				userId,
				timeIn,
				place,
				isPresent: status === "Present",
				isAbsent: status === "Absent",
				isOnLeave: status === "Leave",
			});
			return res.send({
				success: true,
				message: "Attendance created successfully.",
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
		const { id } = req.body;

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

			const currentDate = new Date();

			const allUsers = await User.findAll({
				where: {
					id: {
						[Op.in]: project.projectEmployees,
					},
					[Op.or]: [
						{ leaveStart: null },
						{ leaveEnd: null },
						{
							[Op.and]: [
								{ leaveStart: { [Op.gt]: currentDate } },
								{ leaveEnd: { [Op.lt]: currentDate } },
							],
						},
					],
				},
			});

			if (allUsers.length === 0) {
				return res.send({
					success: false,
					message: "No employees found for this project.",
				});
			}
			const todayDate = new Date().toISOString().split("T")[0];
			const whereClause = {
				userId: {
					[Op.in]: allUsers.map((user) => user.id),
				},
			};
			const allAttendance = await Attendance.findAll({
				where: whereClause,
			});
			const filteredAllAttendance = allAttendance.filter((attendance) => {
				const attendanceDate = new Date(attendance.date)
					.toISOString()
					.split("T")[0];
				console.log(`ATTENDANCE DATE: ${attendanceDate}`);
				console.log(`TODAY DATE: ${todayDate}`);
				return attendanceDate === todayDate;
			});
			const attendedUserIds = new Set(
				filteredAllAttendance.map((attendance) => attendance.userId)
			);
			const usersWithoutAttendance = allUsers.filter(
				(user) => !attendedUserIds.has(user.id)
			);
			res.send({
				success: true,
				message: "Project employees fetched successfully.",
				users: usersWithoutAttendance,
			});
		} catch (error) {
			console.log(error);
			res.send({
				success: false,
				message: "Error on fetching project employees.",
			});
		}
	}

	async getAllEmployeesAttendanceVar(req, res) {
		const { id, isPresent, isAbsent, isOnLeave } = req.body;

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
			const whereClause = {
				userId: {
					[Op.in]: allUsers.map((user) => user.id),
				},
			};
			if (isPresent !== undefined) whereClause["isPresent"] = isPresent;
			if (isAbsent !== undefined) whereClause["isAbsent"] = isAbsent;
			if (isOnLeave !== undefined) whereClause["isOnLeave"] = isOnLeave;
			const allAttendance = await Attendance.findAll({
				where: whereClause,
			});
			console.log(`ATTENDANCE: ${JSON.stringify(allAttendance)}`);
			const filteredAllAttendance = allAttendance.filter((attendance) => {
				const attendanceDate = new Date(attendance.date)
					.toISOString()
					.split("T")[0];
				console.log(`ATTENDANCE DATE: ${attendanceDate}`);
				console.log(`TODAY DATE: ${todayDate}`);
				return attendanceDate === todayDate;
			});

			const attendedUserIds = new Set(
				filteredAllAttendance.map((attendance) => attendance.userId)
			);
			const usersAttendance = allUsers.filter((user) =>
				attendedUserIds.has(user.id)
			);
			res.send({
				success: true,
				message: "Project employees fetched successfully.",
				users: usersAttendance,
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
