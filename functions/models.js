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

User.hasMany(Project, {
	foreignKey: "projectManager",
	as: "Projects",
	onDelete: "CASCADE",
});
Project.belongsTo(User, {
	foreignKey: "projectManager",
	as: "Users",
});

module.exports = { sequelize, User, Project };
