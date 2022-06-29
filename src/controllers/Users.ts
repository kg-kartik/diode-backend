import { Request, Response, NextFunction } from "express";
import ApiResponse from "../Types/ApiResponse";
import UsersModel from "../models/Users";
import ErrorResponse from "../utils/ErrorResponse";
import InstancesModel from "../models/Instances";
import jwt from "jsonwebtoken";
import RequestWithUser from "../Types/RequestWithUser";
import Users from "src/Types/Users";

export const signup = (req: Request, res: Response, next: NextFunction) => {
    const { personalaccesstoken } = req.body;
    const secret = process.env.JWT_SECRET;

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

    const newInstance = new InstancesModel({});

    //send region,type,name details to python api ->
    //get back ssh_key and ip -< save to mongo

    newInstance
        .save()
        .then((instance) => {
            UsersModel.findByIdAndUpdate(
                {
                    _id: userId
                },
                {
                    $push: {
                        instances: instance._id
                    }
                },
                {
                    new: true,
                    runValidators: true
                }
            )

                .then((user) => {
                    InstancesModel.findByIdAndUpdate(
                        {
                            _id: instance._id
                        },
                        {
                            $set: {
                                ...instanceDetails
                            }
                        },
                        {
                            new: true,
                            runValidators: true
                        }
                    )
                        .then((instance) => {
                            const response: ApiResponse = {
                                data: instance,
                                status: 200,
                                success: true,
                                message: "Instance successfully created"
                            };
                            res.status(200).json(response);
                        })
                        .catch(next);
                })
                .catch(next);
        })
        .catch(next);
};

export const getInstances = (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.body;

    UsersModel.findById({
        _id: userId
    })
        .populate("instances")
        .then((user: any) => {
            const response: ApiResponse = {
                data: user.instances,
                status: 200,
                success: true,
                message: "Instance successfully created"
            };
            res.status(200).json(response);
        })
        .catch(next);
};
