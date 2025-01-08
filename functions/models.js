require("dotenv").config();
const pg = require("pg");
const { Sequelize, DataTypes, INTEGER } = require("sequelize");

const sequelize = new Sequelize(
	"postgresql://jdm:gA00MXJG6XdxLl7tZvCuEA@jdm-master-15017.7tt.aws-us-east-1.cockroachlabs.cloud:26257/aps?sslmode=verify-full",
	{
		dialect: "postgres",
		dialectModule: pg,
		dialectOptions: {
			ssl: {
				require: true,
				rejectUnauthorized: false,
			},
		},
	}
);

const User = sequelize.define(
	"User",
	{
		profileImage: {
			type: DataTypes.STRING,
			defaultValue: "",
		},
		firstName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		lastName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		middleName: {
			type: DataTypes.STRING,
			defaultValue: "",
		},
		gender: {
			type: DataTypes.STRING,
			defaultValue: "Male",
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true,
			},
		},
		is_deactivated: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		department: {
			type: DataTypes.STRING,
			defaultValue: "",
		},
		skills: {
			type: DataTypes.ARRAY(DataTypes.STRING),
			defaultValue: [],
		},
		phoneNumber: {
			type: DataTypes.STRING,
			defaultValue: "",
		},
		location: {
			type: DataTypes.STRING,
			defaultValue: "",
		},
		position: {
			type: DataTypes.STRING,
			defaultValue: "",
		},
		salary: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		status: {
			type: DataTypes.STRING,
			defaultValue: "Active",
		},
		projectId: {
			type: DataTypes.INTEGER,
			defaultValue: null,
		},
		projectManagerId: {
			type: DataTypes.INTEGER,
			defaultValue: null,
		},
		projectManager: {
			type: DataTypes.STRING,
			defaultValue: "",
		},
		isManager: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		startDate: {
			type: DataTypes.DATEONLY,
			defaultValue: Sequelize.NOW,
		},
		endDate: {
			type: DataTypes.DATEONLY,
			defaultValue: null,
		},
		lastRequest: {
			type: DataTypes.DATE,
			defaultValue: null,
		},
		leaveStart: {
			type: DataTypes.DATEONLY,
			defaultValue: null,
		},
		leaveEnd: {
			type: DataTypes.DATEONLY,
			defaultValue: null,
		},
		isVerified: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		workingHrs: {
			type: INTEGER,
			defaultValue: 0,
		},
	},
	{
		timestamps: true,
	}
);

const Project = sequelize.define(
	"Project",
	{
		projectManager: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "Users",
				key: "id",
			},
			onDelete: "CASCADE",
		},
		projectName: {
			type: DataTypes.STRING,
			defaultValue: "",
		},
		projectLocation: {
			type: DataTypes.STRING,
			defaultValue: "",
		},
		projectType: {
			type: DataTypes.STRING,
			defaultValue: "",
		},
		projectDescription: {
			type: DataTypes.STRING,
			defaultValue: "",
		},
		status: {
			type: DataTypes.STRING,
			defaultValue: "Active",
		},
		startDate: {
			type: DataTypes.DATEONLY,
			defaultValue: null,
		},

		budget: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		clientName: {
			type: DataTypes.STRING,
			defaultValue: "",
		},
		clientEmail: {
			type: DataTypes.STRING,
			defaultValue: "",
		},
		clientType: {
			type: DataTypes.STRING,
			defaultValue: "",
		},
		// RESIDENTIAL
		// GOVERNMENT
		// COMMERCIAL
		// PUBLIC SECTOR
		endDate: {
			type: DataTypes.DATEONLY,
			defaultValue: null,
		},
		projectEmployees: {
			type: DataTypes.ARRAY(DataTypes.INTEGER),
			defaultValue: [],
		},
	},
	{
		timestamps: true,
	}
);

const Attendance = sequelize.define("Attendance", {
	date: {
		type: DataTypes.DATE,
		defaultValue: DataTypes.NOW,
	},
	userId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: "Users",
			key: "id",
		},
		onDelete: "CASCADE",
	},
	isLate: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
	},
	isPresent: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
	},
	isAbsent: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
	},
	isOnLeave: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
	},
	notDecided: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
	},
	timeIn: {
		type: DataTypes.TIME,
		allowNull: true,
	},
	timeOut: {
		type: DataTypes.TIME,
		allowNull: true,
		defaultValue: null,
	},
	place: {
		type: DataTypes.STRING,
		allowNull: true,
	},
});

const Schedule = sequelize.define("Schedule", {
	userId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: "Users",
			key: "id",
		},
		onDelete: "CASCADE",
	},
	date: {
		type: DataTypes.DATE,
		allowNull: false,
	},
	timeIn: {
		type: DataTypes.TIME,
		allowNull: false,
	},
	timeOut: {
		type: DataTypes.TIME,
		allowNull: false,
	},
	description: {
		type: DataTypes.STRING,
		defaultValue: "",
	},
	isDoned: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
	},
});

const RequestLeave = sequelize.define(
	"RequestLeave",
	{
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "Users",
				key: "id",
			},
		},
		reason: {
			type: DataTypes.STRING,
			defaultValue: "",
		},
		leaveType: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		startDate: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		endDate: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		accepted: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		denied: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
	},
	{
		timestamps: true,
	}
);

const Notification = sequelize.define(
	"Notification",
	{
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "Users",
				key: "id",
			},
		},
		title: {
			type: DataTypes.STRING,
			defaultValue: "",
		},
		message: {
			type: DataTypes.STRING,
			defaultValue: "",
		},
		read: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
	},
	{
		timestamps: true,
	}
);

const ProjectReport = sequelize.define("ProjectReport", {
	projectId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: "Projects",
			key: "id",
		},
	},
	titleReport: {
		type: DataTypes.STRING,
		defaultValue: "",
	},
	description: {
		type: DataTypes.STRING,
		defaultValue: "",
	},
	uploadedPicture: {
		type: DataTypes.STRING,
		defaultValue: "",
	},
},{timestamps: true,});

User.hasMany(Project, {
	foreignKey: "projectManager",
	as: "Projects",
	onDelete: "CASCADE",
});
Project.belongsTo(User, {
	foreignKey: "projectManager",
	as: "Users",
});

// User.hasMany(Notification, {
// 	foreignKey: "userId",
// 	onDelete: "CASCADE",
// });
// Notification.belongsTo(User, {
// 	foreignKey: "userId",
// 	onDelete: "CASCADE",
// });
User.hasMany(RequestLeave, {
	foreignKey: "userId",
	onDelete: "CASCADE",
});
RequestLeave.belongsTo(User, {
	foreignKey: "userId",
});

User.hasMany(Attendance, { foreignKey: "userId" });
Attendance.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Schedule, { foreignKey: "userId" });
Schedule.belongsTo(User, { foreignKey: "userId" });

module.exports = {
	sequelize,
	User,
	Project,
	Attendance,
	Schedule,
	RequestLeave,
	Notification,
	ProjectReport,
};
