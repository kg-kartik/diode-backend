import { Schema, model } from "mongoose";
import Instances from "src/Types/Instances";

const instancesSchema = new Schema<Instances>({
    instanceId: {
        type: String
    },
    name: {
        type: String
    },
    region: {
        type: String
    },
    type: {
        type: String
    },
    buildpack: {
        type: String
    },
    ip_address: {
        type: String
    },
    ssh_key: {
        type: String
    },
    repo: {
        type: String
    },
    env: [
        {
            key: {
                type: String
            },
            value: {
                type: String
            }
        }
    ]
});

const InstancesModel = model<Instances>("Instances", instancesSchema);
export default InstancesModel;
