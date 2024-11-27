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
		leaveStart: {
			type: DataTypes.DATEONLY,
			defaultValue: null,
		},
		leaveEnd: {
			type: DataTypes.DATEONLY,
			defaultValue: null,
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
		defaultValue: true,
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

User.hasMany(Project, {
	foreignKey: "projectManager",
	as: "Projects",
	onDelete: "CASCADE",
});
Project.belongsTo(User, {
	foreignKey: "projectManager",
	as: "Users",
});

User.hasMany(Attendance, { foreignKey: "userId" });
Attendance.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Schedule, { foreignKey: "userId" });
Schedule.belongsTo(User, { foreignKey: "userId" });

module.exports = { sequelize, User, Project, Attendance, Schedule };
