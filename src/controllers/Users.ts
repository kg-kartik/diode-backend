import { Request, Response, NextFunction } from "express";
import ApiResponse from "../Types/ApiResponse";
import UsersModel from "../models/Users";
import ErrorResponse from "../utils/ErrorResponse";
import InstancesModel from "../models/Instances";
import jwt from "jsonwebtoken";

export const signup = (req: Request, res: Response, next: NextFunction) => {
    const { personalaccesstoken } = req.body;
    const secret = "hello";

    UsersModel.findOne({
        personalaccesstoken
    }).then((user: any) => {
        if (user) {
            console.log(user, "userr");
            const token = jwt.sign(
                {
                    _id: user._id
                },
                secret
            );
            const response: ApiResponse = {
                data: { user, token },
                status: 200,
                success: true,
                message: "User successfully signed In"
            };

            res.status(200).json(response);
        } else {
            const newUser = new UsersModel({
                personalaccesstoken
            });

            console.log(newUser, "neww");

            newUser
                .save()
                .then((savedUser) => {
                    console.log(savedUser, "savee");
                    const token = jwt.sign(
                        {
                            _id: savedUser._id
                        },
                        secret
                    );

                    const response: ApiResponse = {
                        data: { user: savedUser, token },
                        status: 200,
                        success: true,
                        message: "User successfully registered"
                    };

                    res.status(200).json(response);
                })
                .catch(next);
        }
    });
};

export const createInstance = (req: Request, res: Response, next: NextFunction) => {
    const { userId, instanceDetails } = req.body;

    const newInstance = new InstancesModel({
        ...instanceDetails
    });

    //send region,type,name details to python api ->
    //get back ssh_key and ip -< save to mongo

    newInstance
        .save()
        .then((instance) => {})
        .catch(next);

    UsersModel.findByIdAndUpdate(
        {
            _id: userId
        },
        {
            $push: {
                instances: instanceDetails.instanceId
            }
        },
        {
            new: true,
            runValidators: true
        }
    )
        .then((user) => {
            const response: ApiResponse = {
                data: user,
                status: 200,
                success: true,
                message: "Instance successfully created"
            };

            res.status(200).json(response);
        })
        .catch(next);
};

export const selectRepo = (req: Request, res: Response, next: NextFunction) => {
    const { updatedInstanceDetails, instanceId } = req.body;

    InstancesModel.findOneAndUpdate(
        {
            instanceId
        },
        {
            $set: {
                repo: updatedInstanceDetails.repo,
                buildpack: updatedInstanceDetails.buildpack,
                env: updatedInstanceDetails.env
            }
        },
        {
            new: true,
            runValidators: true
        }
    )
        .then((updatedInstance) => {
            const response: ApiResponse = {
                data: updatedInstance,
                status: 200,
                success: true,
                message: "Instance set for Deployment"
            };

            res.status(200).json(response);
        })
        .catch(next);
};
