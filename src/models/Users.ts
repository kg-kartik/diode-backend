import { Schema, model, Types } from "mongoose";
import Users from "../Types/Users";

const { ObjectId } = Types;

const usersSchema = new Schema<Users>({
    personalaccesstoken: {
        type: String
    },
    instances: [
        {
            type: ObjectId,
            ref: "Instances"
        }
    ]
});

const UsersModel = model<Users>("Users", usersSchema);
export default UsersModel;
