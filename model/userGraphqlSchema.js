const graphQL = require("graphql");
const userMongoDbSchema = require("./userMongoDbSchema.js");
const hashPassworFunc = require("../utils/hashPassword.js");
const bcrypt = require("bcrypt");
const emailValidation = require("../utils/EmailValidation.js");
const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLBoolean,
} = graphQL;

const signUp = new GraphQLObjectType({
  name: "signUp",
  fields: () => ({
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
    message: {
      type: GraphQLString,
    },
    status: {
      type: GraphQLBoolean,
    },
  }),
});

const signIn = new GraphQLObjectType({
  name: "signIn",
  fields: () => ({
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
    message: {
      type: GraphQLString,
    },
    status: {
      type: GraphQLBoolean,
    },
  }),
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    signUp: {
      type: signUp,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args) => {
        try {
          const { email, password } = args;
         if(!email || !password) {
            return {
                email:"email is required",
                password:"password is required",
                message:"both email and password are required",
                status:false
            }
         }
          // checking if the email is valid
const isEmailValid = await emailValidation(email)
    if(!isEmailValid){
        return {
            email:"invalid email or password",
            password:"invalid email or password",
            message:"invalid email format",
            status:false
        }

    }

          const hashedPassword = await hashPassworFunc(password);
         
          const newUser = {
            email,
            hashedPassword,
          };
          // checking if email already exists
  const UserExist = await userMongoDbSchema.findOne({
      email
  })
  if(UserExist){
    return {
        email:"invalid email or password",
        password:"invalid email or password",
        message:"email already exist in db",
        status:false
    }
  }

          const user = await userMongoDbSchema.create(newUser);
          if (user) {
            const { email, hashedPassword } = user;
            return {
              email,
              password: hashedPassword,
              message:"User creation successful",
              status: true
            };
          }
        } catch (error) {
          console.log(error.message);
        }
      },
    },
  },
});

const RootQuery = new GraphQLObjectType({
  name: "rootQuery",
  fields: {
    signIn: {
      type: signIn,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args) => {
        try {
          const { email, password } = args;
          if(!email || !password) {
            return {
                email:"email is required",
                password:"password is required",
                message:"password and email is required",
                status:false
            }
    
        }
          const isEmailValid = await emailValidation(email)
    if(!isEmailValid) {
        return {
            email:"invalid email or password",
            password:"invalid email or password",
            message:"invalid email format",
            status:false
        }

    }
          const user = await userMongoDbSchema.findOne({
            email,
          });

          if (!user) {
            return {
              email: "invalid email or password",
              password: "invalid email or password",
              message: "failed to login user due to incorrect password",
              status: false,
            };
          }
          const { hashedPassword } = user;
          const passWordMatch = await bcrypt.compare(password, hashedPassword);
          console.log("passWordMatch", passWordMatch);
          if (!passWordMatch) {
            return {
              email: "invalid email or password",
              password: "invalid email or password",
              message: "wrong password",
              status: false,
            };
          }
          return {
            email: user.email,
            password: user.hashedPassword,
            message: "User logged in successfully",
            status: true,
          };
        } catch (error) {
          console.log(error.message);
          return {
            email: "server error",
            password: "server error",
            message: "server error",
            status: false,
          };
        }
      },
    },
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

module.exports = schema;
